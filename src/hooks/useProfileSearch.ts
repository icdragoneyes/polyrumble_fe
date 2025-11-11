import { useState, useEffect, useCallback, useRef } from "react";
import { searchProfiles } from "../services/polymarketApi";
import type { ProfileSearchResult } from "../types";

interface UseProfileSearchResult {
  results: ProfileSearchResult[];
  loading: boolean;
  error: string | null;
  search: (query: string) => void;
  clearResults: () => void;
}

/**
 * Hook for searching trader profiles with debouncing
 */
export function useProfileSearch(
  debounceMs: number = 300,
): UseProfileSearchResult {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProfileSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setQuery("");
    setError(null);
  }, []);

  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Clear results if query is too short
    if (query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    // Set loading state immediately
    setLoading(true);
    setError(null);

    // Debounce the search
    debounceTimerRef.current = setTimeout(async () => {
      try {
        abortControllerRef.current = new AbortController();

        const searchResults = await searchProfiles(query, 5);

        setResults(searchResults);
        setLoading(false);
      } catch (err) {
        // Ignore abort errors
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        console.error("Profile search error:", err);
        setError("Failed to search profiles");
        setResults([]);
        setLoading(false);
      }
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query, debounceMs]);

  return {
    results,
    loading,
    error,
    search,
    clearResults,
  };
}
