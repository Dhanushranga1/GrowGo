'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useUserProfile } from '@/lib/useUserProfile';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { profile, loading } = useUserProfile();

  useEffect(() => {
    if (!loading && profile && !profile.is_onboarded && pathname !== '/onboarding') {
      router.push('/onboarding');
    }
  }, [loading, profile, pathname]);

  return <>{children}</>;
}
