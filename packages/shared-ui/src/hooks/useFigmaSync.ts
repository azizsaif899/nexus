import { useState, useCallback } from 'react';

interface FigmaComponent {
  name: string;
  code: string;
  saved?: boolean;
}

interface UseFigmaSyncReturn {
  components: FigmaComponent[];
  isLoading: boolean;
  error: string | null;
  syncComponents: () => Promise<void>;
  clearError: () => void;
}

export const useFigmaSync = (apiBaseUrl: string = '/api'): UseFigmaSyncReturn => {
  const [components, setComponents] = useState<FigmaComponent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const syncComponents = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/figma/sync-components`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setComponents(data.components || []);
      } else {
        throw new Error(data.message || 'Failed to sync components');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Figma sync error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    components,
    isLoading,
    error,
    syncComponents,
    clearError,
  };
};