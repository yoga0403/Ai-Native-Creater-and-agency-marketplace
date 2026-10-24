/**
 * CreatorConnect AI — Supabase REST Client
 * Zero-dependency browser-native client that connects directly to Supabase PostgREST & Auth APIs.
 * Automatically switches between live Supabase credentials and offline fallback store.
 */

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes('your-supabase-project'));
};

interface SupabaseQueryOptions {
  select?: string;
  order?: string;
  limit?: number;
  match?: Record<string, any>;
}

export const supabaseRest = {
  /**
   * Query records from a Supabase table
   */
  async select<T = any>(table: string, options: SupabaseQueryOptions = {}): Promise<{ data: T[] | null; error: any }> {
    if (!isSupabaseConfigured()) {
      return { data: null, error: new Error('Supabase is not configured') };
    }

    try {
      const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`);
      url.searchParams.set('select', options.select || '*');
      if (options.order) url.searchParams.set('order', options.order);
      if (options.limit) url.searchParams.set('limit', String(options.limit));
      if (options.match) {
        Object.entries(options.match).forEach(([key, val]) => {
          url.searchParams.set(key, `eq.${val}`);
        });
      }

      const res = await fetch(url.toString(), {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        return { data: null, error: new Error(errorText) };
      }

      const data = await res.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  /**
   * Insert records into a Supabase table
   */
  async insert<T = any>(table: string, record: Partial<T> | Partial<T>[]): Promise<{ data: T[] | null; error: any }> {
    if (!isSupabaseConfigured()) {
      return { data: null, error: new Error('Supabase is not configured') };
    }

    try {
      const url = `${SUPABASE_URL}/rest/v1/${table}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify(record),
      });

      if (!res.ok) {
        const errorText = await res.text();
        return { data: null, error: new Error(errorText) };
      }

      const data = await res.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  /**
   * Update records in a Supabase table
   */
  async update<T = any>(table: string, id: string, updates: Partial<T>): Promise<{ data: T | null; error: any }> {
    if (!isSupabaseConfigured()) {
      return { data: null, error: new Error('Supabase is not configured') };
    }

    try {
      const url = `${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`;
      const res = await fetch(url, {
        method: 'PATCH',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const errorText = await res.text();
        return { data: null, error: new Error(errorText) };
      }

      const data = await res.json();
      return { data: data[0] || null, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },
};

