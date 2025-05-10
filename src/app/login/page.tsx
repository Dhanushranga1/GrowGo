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
        const email = prompt("Enter your email to receive a login link:");
        if (!email) throw new Error("Email is required");
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) throw error;
        toast.success("Check your email!", {
          description: "A login link has been sent.",
        });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error("Authentication failed", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left Panel */}
      <div className="hidden md:flex w-3/5 bg-green-800 px-16 py-24 flex-col justify-center h-screen">
        <div className="text-white">
          <h1 className="text-4xl font-bold">GrowGo</h1>
          <h2 className="text-3xl font-semibold mt-10">🌱 Grow 1% every day.</h2>
          <p className="text-lg text-white/80 mt-4 max-w-md">
            A place to commit to what matters — no scrolls, no noise.
          </p>
        </div>
      </div>
      {/* Right Panel */}
      <div className="w-full md:w-2/5 bg-white flex flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md rounded-2xl shadow-md p-10 space-y-6">
          <CardHeader className="space-y-1 px-0 pt-0">
            <h2 className="text-2xl font-semibold">Welcome to GrowGo 🌱</h2>
            <p className="text-sm text-gray-500">Sign in to grow with intention.</p>
          </CardHeader>
          <CardContent className="space-y-4 px-0 pt-0">
            <Button
              variant="default"
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => handleAuth('Google')}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : '🔵 Continue with Google'}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleAuth('Email')}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : '✉️ Continue with Email'}
            </Button>
            <p className="text-xs text-center text-gray-500">
              By continuing, you agree to our{' '}
              <a href="#" className="underline hover:text-green-800">terms</a> and{' '}
              <a href="#" className="underline hover:text-green-800">privacy policy</a>.
            </p>
          </CardContent>
        </Card>
        <Button
          variant="ghost"
          className="mt-6 text-green-600 hover:text-green-800 hover:bg-green-50"
          onClick={() => router.push('/')}
        >
          ← Back to Landing Page
        </Button>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}