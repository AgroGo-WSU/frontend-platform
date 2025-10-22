import { useEffect, useMemo, useState } from 'react';
import type { Notification } from '../components/Notification/types';

const seed: Notification[] = [
  {
    id: 'n1',
    kind: 'success',
    title: 'Watering completed',
    message: 'Zone 2 finished at 5:03 PM.',
    createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
  },
  {
    id: 'n2',
    kind: 'error',
    title: 'Pi disconnected',
    message: 'Lost connection at 4:58 PM.',
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: 'n3',
    kind: 'info',
    title: 'Account update',
    message: 'New device firmware available.',
    createdAt: new Date(Date.now() - 1000 * 60 * 58).toISOString(),
  },
];

export function useNotifications(userId?: string) {
  const [items, setItems] = useState<Notification[]>(seed);

  const add = (n: Notification) => setItems(prev => [n, ...prev].slice(0, 50));
  const clear = () => setItems([]);

  const sorted = useMemo(
    () => [...items].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [items]
  );

  // 👇 This effect references userId so it's "used" and ready for future fetching.
  useEffect(() => {
    // TODO: fetch user-scoped notifications when backend is ready.
    // e.g., fetch(`/api/notifications?user=${userId}`)
  }, [userId]);

  // demo: simulate an incoming tip
  useEffect(() => {
    const t = setTimeout(() => {
      add({
        id: crypto.randomUUID(),
        kind: 'info',
        title: 'Greenhouse tip',
        message: 'Try raising fan speed during midday heat.',
        createdAt: new Date().toISOString(),
      });
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  return { items: sorted, add, clear };
}
