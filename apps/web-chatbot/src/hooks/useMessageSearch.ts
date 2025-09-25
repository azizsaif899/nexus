import { useState, useCallback, useMemo } from 'react';
import { useMessageStore } from '../store/message.store';
import type { Message } from '../store/message.store';

export interface SearchFilters {
  query?: string;
  sender?: 'user' | 'ai' | 'all';
  messageType?: Message['messageType'] | 'all';
  dateFrom?: Date;
  dateTo?: Date;
  hasAttachments?: boolean;
  sessionId?: string;
}

export interface SearchResult extends Message {
  matchScore: number;
  matchedFields: string[];
}

export interface UseMessageSearchReturn {
  searchResults: SearchResult[];
  isSearching: boolean;
  searchQuery: string;
  filters: SearchFilters;
  totalResults: number;
  performSearch: (query: string, filters?: Partial<SearchFilters>) => void;
  clearSearch: () => void;
  updateFilters: (filters: Partial<SearchFilters>) => void;
  savedSearches: SavedSearch[];
  saveSearch: (name: string, query: string, filters: SearchFilters) => void;
  loadSearch: (searchId: string) => void;
  deleteSearch: (searchId: string) => void;
}

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: SearchFilters;
  createdAt: Date;
  lastUsed?: Date;
}

const SAVED_SEARCHES_KEY = 'nexus-chat-saved-searches';

export const useMessageSearch = (): UseMessageSearchReturn => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);

  const { messages } = useMessageStore();

  // Load saved searches on mount
  useMemo(() => {
    try {
      const saved = localStorage.getItem(SAVED_SEARCHES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert date strings back to Date objects
        const searchesWithDates = parsed.map((search: any) => ({
          ...search,
          createdAt: new Date(search.createdAt),
          lastUsed: search.lastUsed ? new Date(search.lastUsed) : undefined,
        }));
        setSavedSearches(searchesWithDates);
      }
    } catch (error) {
      console.error('Failed to load saved searches:', error);
    }
  }, []);

  const saveSearchesToStorage = useCallback((searches: SavedSearch[]) => {
    try {
      localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(searches));
    } catch (error) {
      console.error('Failed to save searches:', error);
    }
  }, []);

  const calculateMatchScore = useCallback((message: Message, query: string): { score: number; fields: string[] } => {
    const matchedFields: string[] = [];
    let score = 0;

    const lowerQuery = query.toLowerCase();
    const lowerContent = message.content.toLowerCase();

    // Exact match in content gets highest score
    if (lowerContent.includes(lowerQuery)) {
      score += 100;
      matchedFields.push('content');
    }

    // Partial matches in content
    const words = lowerQuery.split(' ');
    words.forEach(word => {
      if (lowerContent.includes(word)) {
        score += 50;
      }
    });

    // Match in metadata
    if (message.metadata) {
      const metadataString = JSON.stringify(message.metadata).toLowerCase();
      if (metadataString.includes(lowerQuery)) {
        score += 25;
        matchedFields.push('metadata');
      }
    }

    // Recent messages get slight boost
    const daysSince = (Date.now() - message.timestamp.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince < 1) score += 10;
    else if (daysSince < 7) score += 5;

    return { score, fields: matchedFields };
  }, []);

  const matchesFilters = useCallback((message: Message, filters: SearchFilters): boolean => {
    // Sender filter
    if (filters.sender && filters.sender !== 'all' && message.sender !== filters.sender) {
      return false;
    }

    // Message type filter
    if (filters.messageType && filters.messageType !== 'all' && message.messageType !== filters.messageType) {
      return false;
    }

    // Date range filter
    if (filters.dateFrom && message.timestamp < filters.dateFrom) {
      return false;
    }
    if (filters.dateTo && message.timestamp > filters.dateTo) {
      return false;
    }

    // Attachments filter
    if (filters.hasAttachments !== undefined) {
      const hasAttachments = !!(message.metadata?.fileUrl || message.metadata?.fileName);
      if (filters.hasAttachments !== hasAttachments) {
        return false;
      }
    }

    // Session filter
    if (filters.sessionId && message.sessionId !== filters.sessionId) {
      return false;
    }

    return true;
  }, []);

  const performSearch = useCallback((query: string, searchFilters: Partial<SearchFilters> = {}) => {
    setIsSearching(true);
    setSearchQuery(query);

    const currentFilters = { ...filters, ...searchFilters };
    setFilters(currentFilters);

    try {
      let filteredMessages = messages;

      // Apply filters first
      if (Object.keys(currentFilters).length > 0) {
        filteredMessages = messages.filter(message => matchesFilters(message, currentFilters));
      }

      // Perform search if query exists
      if (query.trim()) {
        const results: SearchResult[] = filteredMessages
          .map(message => {
            const { score, fields } = calculateMatchScore(message, query);
            return score > 0 ? { ...message, matchScore: score, matchedFields: fields } : null;
          })
          .filter((result): result is SearchResult => result !== null)
          .sort((a, b) => b.matchScore - a.matchScore); // Sort by relevance

        setSearchResults(results);
      } else {
        // No query, just return filtered messages
        const results: SearchResult[] = filteredMessages.map(message => ({
          ...message,
          matchScore: 0,
          matchedFields: []
        }));
        setSearchResults(results);
      }
    } finally {
      setIsSearching(false);
    }
  }, [messages, filters, matchesFilters, calculateMatchScore]);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setSearchQuery('');
    setFilters({});
    setIsSearching(false);
  }, []);

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    // Re-run search with new filters if there's a query
    if (searchQuery) {
      performSearch(searchQuery, updatedFilters);
    }
  }, [filters, searchQuery, performSearch]);

  const saveSearch = useCallback((name: string, query: string, searchFilters: SearchFilters) => {
    const newSearch: SavedSearch = {
      id: `search-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      query,
      filters: searchFilters,
      createdAt: new Date(),
    };

    const updatedSearches = [...savedSearches, newSearch];
    setSavedSearches(updatedSearches);
    saveSearchesToStorage(updatedSearches);
  }, [savedSearches, saveSearchesToStorage]);

  const loadSearch = useCallback((searchId: string) => {
    const search = savedSearches.find((s: SavedSearch) => s.id === searchId);
    if (search) {
      // Update last used
      const updatedSearches = savedSearches.map((s: SavedSearch) =>
        s.id === searchId ? { ...s, lastUsed: new Date() } : s
      );
      setSavedSearches(updatedSearches);
      saveSearchesToStorage(updatedSearches);

      // Perform the search
      performSearch(search.query, search.filters);
    }
  }, [savedSearches, saveSearchesToStorage, performSearch]);

  const deleteSearch = useCallback((searchId: string) => {
    const updatedSearches = savedSearches.filter((s: SavedSearch) => s.id !== searchId);
    setSavedSearches(updatedSearches);
    saveSearchesToStorage(updatedSearches);
  }, [savedSearches, saveSearchesToStorage]);

  const totalResults = searchResults.length;

  return {
    searchResults,
    isSearching,
    searchQuery,
    filters,
    totalResults,
    performSearch,
    clearSearch,
    updateFilters,
    savedSearches,
    saveSearch,
    loadSearch,
    deleteSearch,
  };
};