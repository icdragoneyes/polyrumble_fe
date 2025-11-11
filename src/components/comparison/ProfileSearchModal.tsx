import { useState, useEffect } from 'react';
import { HiX } from 'react-icons/hi';
import { useProfileSearch } from '../../hooks/useProfileSearch';
import { truncateAddress } from '../../utils/validation';
import type { ProfileSearchResult, TraderSelection } from '../../types';

interface ProfileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selection: TraderSelection) => void;
  label: string;
}

export function ProfileSearchModal({
  isOpen,
  onClose,
  onSelect,
  label
}: ProfileSearchModalProps) {
  const [inputValue, setInputValue] = useState('');
  const { results, loading, search, clearResults } = useProfileSearch();

  // Clear on close
  useEffect(() => {
    if (!isOpen) {
      setInputValue('');
      clearResults();
    }
  }, [isOpen, clearResults]);

  const handleSelectProfile = (profile: ProfileSearchResult) => {
    const selection: TraderSelection = {
      walletAddress: profile.proxyWallet,
      name: profile.name,
      pseudonym: profile.pseudonym,
      bio: profile.bio,
      profileImage: profile.profileImageOptimized || profile.profileImage,
      source: 'search'
    };

    onSelect(selection);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    search(newValue);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">{label}</h2>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          aria-label="Close"
        >
          <HiX className="w-6 h-6" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Search by name or wallet address..."
            className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-trader1"
            autoFocus
          />

          {/* Loading Indicator */}
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-trader1 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {inputValue.length < 2 && (
          <div className="p-8 text-center text-gray-500">
            Type at least 2 characters to search
          </div>
        )}

        {inputValue.length >= 2 && results.length === 0 && !loading && (
          <div className="p-8 text-center text-gray-500">
            No traders found
          </div>
        )}

        {results.map((profile) => (
          <button
            key={profile.proxyWallet}
            onClick={() => handleSelectProfile(profile)}
            className="w-full px-4 py-4 flex items-center gap-3 hover:bg-gray-50 border-b border-gray-100 transition-colors"
          >
            <img
              src={
                profile.profileImageOptimized ||
                profile.profileImage ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=random`
              }
              alt={profile.name}
              className="w-12 h-12 rounded-full flex-shrink-0"
            />
            <div className="flex-1 text-left min-w-0">
              <p className="font-semibold text-gray-900">{profile.name}</p>
              {profile.bio && (
                <p className="text-sm text-gray-600 line-clamp-2">{profile.bio}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {truncateAddress(profile.proxyWallet)}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
