"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Toaster, toast } from 'sonner';
import { supabase } from '@/lib/supabase';

type AuthProvider = 'Google' | 'Email';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        router.replace('/dashboard');
      }
    };
    checkSession();
  }, [router]);

  const handleAuth = async (provider: AuthProvider) => {
    setIsLoading(true);
    try {
      if (provider === 'Google') {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/dashboard`,
          },
        });
        if (error) throw error;
      } else if (provider === 'Email') {
        const email = prompt("📧 Enter your email to get a magic link:");
        if (!email) {
          setIsLoading(false);
          return;
        }
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) throw error;
        toast.success("Check your inbox ✉️", {
          description: "A login link has been sent to you.",
        });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Something went wrong';
      toast.error("Oops! Couldn't sign you in", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left Panel */}
      <div className="hidden md:flex w-3/5 bg-green-800 px-16 py-24 flex-col justify-center">
        <div className="text-white">
          <h1 className="text-4xl font-bold">GrowGo</h1>
          <h2 className="text-3xl font-semibold mt-10">🌱 Welcome back.</h2>
          <p className="text-lg text-white/80 mt-4 max-w-md">
            Your pod is waiting. Stay accountable and keep your growth streak alive.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-2/5 bg-white flex flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md rounded-xl shadow-lg p-8">
          <CardHeader className="space-y-1 px-0 pt-0">
            <h2 className="text-2xl font-bold text-gray-900">Sign in to GrowGo 🌿</h2>
            <p className="text-sm text-gray-600">Just one click to start showing up</p>
          </CardHeader>

          <CardContent className="space-y-4 px-0 pt-4">
            <Button
              variant="default"
              className="w-full bg-green-600 hover:bg-green-700 font-medium"
              onClick={() => handleAuth('Google')}
              disabled={isLoading}
            >
              {isLoading ? 'Connecting...' : '🔵 Sign in with Google'}
            </Button>

            <Button
              variant="outline"
              className="w-full font-medium"
              onClick={() => handleAuth('Email')}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : '📧 Sign in with Email Link'}
            </Button>
            
            <p className="text-xs text-center text-gray-500 italic pt-2">
              "Keep showing up. That's the habit." — GrowGo
            </p>
          </CardContent>
        </Card>

        {/* Back button - desktop version in main content area, mobile version absolute positioned */}
        <Button
          variant="ghost"
          className="hidden md:flex mt-6 text-green-600 hover:text-green-800 hover:bg-green-50"
          onClick={() => router.push('/')}
        >
          ← Back to home
        </Button>
        
        <Button
          variant="ghost"
          className="absolute top-4 left-4 md:hidden text-green-600 hover:text-green-800 hover:bg-green-50"
          onClick={() => router.push('/')}
        >
          ← Back
        </Button>
      </div>

      <Toaster position="top-right" richColors />
    </div>
  );
}