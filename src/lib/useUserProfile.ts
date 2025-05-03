import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
  streak?: number;
  pod_id?: string;
  [key: string]: unknown;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setProfile(null);
          setLoading(false);
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (fetchError && fetchError.code === 'PGRST116') {
          // Insert default profile if not found
          const { error: insertError } = await supabase
            .from('users')
            .insert({ id: user.id, email: user.email });

          if (insertError) {
            setError(insertError);
            return;
          }

          const { data: newData } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

          setProfile(newData ?? null);
        } else {
          setProfile(data ?? null);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loading, error };
}
