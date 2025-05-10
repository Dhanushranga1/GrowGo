"use client";

import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Leaf, ArrowRight, CheckCircle } from "lucide-react";
import { supabase } from '@/lib/supabase';

export default function LandingPage() {
  const router = useRouter();

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

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Minimal header with navigation */}
      <header className="py-6 px-8 flex justify-between items-center border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="bg-green-600 p-1.5 rounded-md">
            <Leaf size={20} className="text-white" strokeWidth={2} />
          </div>
          <span className="text-xl font-bold text-green-600">GrowGo</span>
        </div>
        <Button 
          variant="ghost" 
          onClick={() => router.push("/login")}
          className="text-green-600 hover:text-green-700 hover:bg-green-50"
        >
          Log In
        </Button>
      </header>

      {/* Hero Section - More minimal, focused on conversion */}
      <section className="flex-1 flex flex-col md:flex-row">
        {/* Left side - Content */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16">
          <div className="max-w-lg space-y-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Grow <span className="text-green-600">1% better</span> every day.
            </h1>
            
            <p className="text-lg text-gray-600">
              Simple daily habits. Measurable progress. Real accountability.
              Build a system that actually helps you achieve your goals.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle size={20} className="text-green-600" />
                <span className="text-gray-700">Daily micro-commitments</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle size={20} className="text-green-600" />
                <span className="text-gray-700">Progress visualization</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle size={20} className="text-green-600" />
                <span className="text-gray-700">Accountability partners</span>
              </div>
            </div>
            
            <div className="pt-4">
              <Button
                onClick={() => router.push("/login")}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 rounded-lg text-lg font-medium transition-all duration-300 flex items-center space-x-2"
              >
                <span>Start your growth journey</span>
                <ArrowRight size={18} />
              </Button>
              <p className="text-sm text-gray-500 mt-3">
                Join 5,000+ people growing together
              </p>
            </div>
          </div>
        </div>
        
        {/* Right side - Visual */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-green-50 to-white items-center justify-center p-16">
          <div className="w-full max-w-md aspect-square bg-white rounded-3xl shadow-xl overflow-hidden border border-green-100 flex items-center justify-center">
            <div className="text-center p-8 space-y-6">
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <Leaf size={32} className="text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900">Your Growth Dashboard</h3>
                <p className="text-gray-600">Track habits, set goals, and see your progress over time.</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-square rounded-lg bg-green-50 flex items-center justify-center">
                    <div className={`w-4/5 h-4/5 rounded-md ${i % 2 === 0 ? 'bg-green-200' : 'bg-green-100'}`}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Minimal footer */}
      <footer className="py-6 px-8 border-t border-gray-100 text-sm text-gray-500">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <Leaf size={16} className="text-green-600" />
            <span className="font-medium text-green-600">GrowGo</span>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-green-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-green-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-green-600 transition-colors">Support</a>
          </div>
          <div>© {new Date().getFullYear()} GrowGo</div>
        </div>
      </footer>
    </div>
  );
}