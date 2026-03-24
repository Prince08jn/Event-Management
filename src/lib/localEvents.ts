// Utilities to read and filter locally persisted frontend events (localStorage)

export type FrontEvent = {
  id: string;
  category?: string;
  name?: string;
  img?: string;
  slug?: string;
  campus_slug?: string;
  [k: string]: unknown;
};

const normalizeToSlug = (v: string | undefined) =>
  v ? v.toString().toLowerCase().replace(/[^a-z0-9\-]+/g, '-').replace(/^-+|-+$/g, '') : '';

export function getLocalEventsForPage(pageKey: string): FrontEvent[] {
  try {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('localEvents') : null;
    const local = stored ? (JSON.parse(stored) as FrontEvent[]) : [];
    const key = normalizeToSlug(pageKey || '');
    console.log('getLocalEventsForPage debug:', { pageKey, normalizedKey: key, allLocalEvents: local });
    
    if (!key) return local;

    const filtered = local.filter((le) => {
      const campusSlug = normalizeToSlug(le?.campus_slug || le?.slug || '');
      const localCat = (le?.category || '').toString().toLowerCase();
      const nameSlug = normalizeToSlug(le?.name || '');
      const eventName = (le?.name || '').toLowerCase();
      
      const matchesCampusSlug = campusSlug && campusSlug === key;
      const matchesCategory = localCat && localCat === key;
      const matchesNameSlug = nameSlug && nameSlug === key;
      
      // Also check if event name contains the key or cricket-related terms
      const nameContainsKey = eventName && eventName.includes(key);
      const isCricketEvent = key === 'cricket' && eventName && (
        eventName.includes('icc') || 
        eventName.includes('cricket') || 
        eventName.includes('world cup') ||
        eventName.includes('tournament')
      );
      
      console.log('Event filter check:', {
        eventName: le?.name,
        campusSlug,
        localCat,
        nameSlug,
        key,
        matchesCampusSlug,
        matchesCategory,
        matchesNameSlug,
        nameContainsKey,
        isCricketEvent
      });
      
      return matchesCampusSlug || matchesCategory || matchesNameSlug || nameContainsKey || isCricketEvent;
    });
    
    console.log('Filtered events for page:', filtered);
    return filtered;
  } catch (err) {
    console.error('Error in getLocalEventsForPage:', err);
    return [];
  }
}

export function listenLocalEvents(handler: () => void) {
  window.addEventListener('events:updated', handler);
  return () => window.removeEventListener('events:updated', handler);
}
