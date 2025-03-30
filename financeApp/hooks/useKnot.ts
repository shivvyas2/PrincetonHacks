import { useState, useEffect } from 'react';
import { initializeKnot, closeKnot } from '@/services/knot';
import { fetchBusinesses } from '@/services/api';

export const useKnot = (sessionId: string, clientId: string) => {
  const [recommendedBusinesses, setRecommendedBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let listeners: any;

    const setupKnot = async () => {
      try {
        setLoading(true);
        listeners = await initializeKnot(sessionId, clientId);
        
        // Fetch initial businesses
        const allBusinesses = await fetchBusinesses();
        
        // You can implement your recommendation logic here
        // For now, we'll just show all businesses
        setRecommendedBusinesses(allBusinesses);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize Knot');
      } finally {
        setLoading(false);
      }
    };

    setupKnot();

    return () => {
      // Cleanup
      if (listeners) {
        Object.values(listeners).forEach((listener: any) => listener.remove());
      }
      closeKnot();
    };
  }, [sessionId, clientId]);

  return { recommendedBusinesses, loading, error };
}; 