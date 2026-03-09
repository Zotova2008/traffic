import { useState, useEffect } from 'react';
import type { Tariff, TariffWithDiscount } from '@/types/tariff';

interface UseTariffsReturn {
  tariffs: TariffWithDiscount[];
  loading: boolean;
  error: string | null;
}

function calculateDiscount(price: number, fullPrice: number): number {
  if (fullPrice <= 0) return 0;
  return Math.round(((fullPrice - price) / fullPrice) * 100);
}

export function useTariffs(): UseTariffsReturn {
  const [tariffs, setTariffs] = useState<TariffWithDiscount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTariffs = async () => {
      try {
        const response = await fetch('https://t-core.fit-hub.pro/Test/GetTariffs');
        if (!response.ok) {
          throw new Error('Failed to fetch tariffs');
        }
        const data: Tariff[] = await response.json();
        
        // Add discount calculation to each tariff
        const tariffsWithDiscount = data.map((tariff) => ({
          ...tariff,
          discountPercent: calculateDiscount(tariff.price, tariff.full_price),
        }));
        
        setTariffs(tariffsWithDiscount);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchTariffs();
  }, []);

  return { tariffs, loading, error };
}
