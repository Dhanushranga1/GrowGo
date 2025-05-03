import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useUserProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setProfile(null);
          setLoading(false);
          return;
        }

        // Try to fetch from users table
        const { data, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (fetchError && fetchError.code === 'PGRST116') {
          // User not found → insert
          const { error: insertError } = await supabase
            .from('users')
            .insert({ id: user.id, email: user.email });

          if (insertError) {
            setError(insertError);
            setLoading(false);
            return;
          }

          // Retry fetch after insert
          const { data: newData } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

          setProfile(newData);
        } else {
          setProfile(data);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loading, error };
}
