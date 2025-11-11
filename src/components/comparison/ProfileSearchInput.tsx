import { useState, useRef, useEffect } from "react";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import { useProfileSearch } from "../../hooks/useProfileSearch";
import {
  detectInputType,
  validateWallet,
  truncateAddress,
} from "../../utils/validation";
import type { TraderSelection, ProfileSearchResult } from "../../types";

interface ProfileSearchInputProps {
  value: TraderSelection | null;
  onChange: (selection: TraderSelection | null) => void;
  onSelect?: () => void;
  placeholder?: string;
  label: string;
  disabled?: boolean;
  hideSelectedDisplay?: boolean;
}

export function ProfileSearchInput({
  value,
  onChange,
  onSelect,
  placeholder = "Search by name or wallet address...",
  label,
  disabled = false,
  hideSelectedDisplay = false,
}: ProfileSearchInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { results, loading, search, clearResults } = useProfileSearch();

  const inputType = detectInputType(inputValue);
  const isValidWallet = inputType === "wallet" && validateWallet(inputValue);
  const showDropdown =
    isFocused && inputType === "name" && inputValue.length >= 2 && !value;

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setSelectedIndex(-1);

    // Clear selection when user types
    if (value) {
      onChange(null);
    }

    // Search if it's a name
    if (detectInputType(newValue) === "name") {
      search(newValue);
    } else {
      clearResults();
    }
  };

  // Handle profile selection
  const handleSelectProfile = (profile: ProfileSearchResult) => {
    const selection: TraderSelection = {
      walletAddress: profile.proxyWallet,
      name: profile.name,
      pseudonym: profile.pseudonym,
      bio: profile.bio,
      profileImage: profile.profileImageOptimized || profile.profileImage,
      source: "search",
    };

    onChange(selection);
    setInputValue("");
    setIsFocused(false);
    clearResults();

    // Trigger onSelect callback
    if (onSelect) {
      onSelect();
    }
  };

  // Handle wallet address entry (direct)
  const handleWalletEntry = () => {
    if (isValidWallet) {
      const selection: TraderSelection = {
        walletAddress: inputValue,
        source: "wallet",
      };

      onChange(selection);
      setInputValue("");
      setIsFocused(false);

      // Trigger onSelect callback
      if (onSelect) {
        onSelect();
      }
    }
  };

  // Handle blur after a delay (to allow clicking on dropdown)
  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
      setSelectedIndex(-1);
    }, 200);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown && e.key === "Enter" && isValidWallet) {
      handleWalletEntry();
      return;
    }

    if (!showDropdown) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev,
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;

      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelectProfile(results[selectedIndex]);
        }
        break;

      case "Escape":
        e.preventDefault();
        setIsFocused(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <label
        htmlFor={label}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>

      {/* Selected Trader Display */}
      {value && !hideSelectedDisplay && (
        <div className="relative">
          <div className="flex items-center gap-3 px-4 py-3 bg-white border-2 border-green-400 rounded-md">
            {value.profileImage && (
              <img
                src={value.profileImage}
                alt={value.name || "Trader"}
                className="w-10 h-10 rounded-full"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900">
                {value.name || truncateAddress(value.walletAddress)}
              </p>
              {value.bio && (
                <p className="text-sm text-gray-600 truncate">{value.bio}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {truncateAddress(value.walletAddress)}
              </p>
            </div>
            <HiCheckCircle className="text-green-500 text-2xl flex-shrink-0" />
          </div>
          <button
            onClick={() => {
              onChange(null);
              setInputValue("");
              setTimeout(() => inputRef.current?.focus(), 100);
            }}
            className="mt-2 w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
          >
            Change Trader
          </button>
        </div>
      )}

      {/* Input Field */}
      {(!value || hideSelectedDisplay) && (
        <>
          <div className="relative">
            <input
              ref={inputRef}
              id={label}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className={`w-full px-4 py-3 pr-12 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-trader1 ${
                inputValue && !isValidWallet && inputType === "wallet"
                  ? "border-red-400"
                  : inputValue && isValidWallet
                    ? "border-green-400"
                    : "border-gray-300"
              }`}
              aria-label={label}
            />

            {/* Validation Icons */}
            {inputValue && inputType === "wallet" && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isValidWallet ? (
                  <HiCheckCircle className="text-green-500 text-2xl" />
                ) : (
                  <HiXCircle className="text-red-500 text-2xl" />
                )}
              </div>
            )}

            {/* Loading Indicator */}
            {loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-trader1 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Dropdown */}
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl max-h-80 overflow-y-auto"
            >
              {results.length === 0 && !loading && (
                <div className="p-4 text-center text-gray-500">
                  No traders found
                </div>
              )}

              {results.map((profile, index) => (
                <button
                  key={profile.proxyWallet}
                  onClick={() => handleSelectProfile(profile)}
                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                    selectedIndex === index ? "bg-blue-50" : ""
                  }`}
                >
                  <img
                    src={
                      profile.profileImageOptimized ||
                      profile.profileImage ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=random`
                    }
                    alt={profile.name}
                    className="w-10 h-10 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-semibold text-gray-900">
                      {profile.name}
                    </p>
                    {profile.bio && (
                      <p className="text-sm text-gray-600 truncate">
                        {profile.bio}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 flex-shrink-0">
                    {truncateAddress(profile.proxyWallet)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
