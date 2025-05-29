import { AtlasOutput } from '@/datamodels/atlas_model';
import { createClient } from '@supabase/supabase-js';
import { endOfDay, startOfDay } from 'date-fns';
  
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getAtlasOutputs(
  page = 1, 
  pageSize = 30, 
  selectedDate?: Date,
  strongTrendOnly = false
) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('atlas_output')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (selectedDate) {
    const start = startOfDay(selectedDate).toISOString();
    const end = endOfDay(selectedDate).toISOString();
    query = query.gte('created_at', start).lte('created_at', end);
  }

  if (strongTrendOnly) {
    query = query.gt('probability', 50);
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    throw new Error(`Error fetching atlas outputs: ${error.message}`);
  }

  return {
    data: data as AtlasOutput[],
    count: count || 0,
    page,
    pageSize
  };
}

export function subscribeToAtlasOutputs(callback: (payload: AtlasOutput) => void) {
  const subscription = supabase
    .channel('atlas_output_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'atlas_output'
      },
      (payload) => {
        callback(payload.new as AtlasOutput);
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}