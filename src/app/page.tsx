"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Leaf, ArrowRight, CheckCircle, XCircle, Users, BarChart2, Calendar, Shield } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Testimonial data
const testimonials = [
  {
    text: "GrowGo made me show up for my goals every single day. The pod feels like family.",
    author: "Sarah L.",
    role: "Freelance Designer"
  },
  {
    text: "Feels like a group hug. Exactly the nudge I needed to stay consistent.",
    author: "Michael T.",
    role: "Software Engineer"
  },
  {
    text: "I've tried every productivity app out there. GrowGo is the only one that kept me coming back.",
    author: "Aisha K.",
    role: "Marketing Lead"
  }
];

// Dashboard preview screens
const dashboardPreviews = [
  "/dashboard-preview-1.png",
  "/habit-tracker-preview.png",
  "/pod-feed-preview.png"
];

export default function LandingPage() {
  const router = useRouter();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentPreview, setCurrentPreview] = useState(0);

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

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate dashboard previews
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPreview((prev) => (prev + 1) % dashboardPreviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Minimal header with navigation */}
      <header className="py-6 px-8 md:px-16 flex justify-between items-center border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="bg-green-600 p-1.5 rounded-md">
            <Leaf size={20} className="text-white" strokeWidth={2} />
          </div>
          <span className="text-xl font-bold text-green-600">GrowGo</span>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => router.push("/login")}
            className="text-gray-700 hover:text-green-700 hover:bg-green-50"
          >
            Log In
          </Button>

        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="flex-1 flex flex-col md:flex-row">
        {/* Left side - Content with improved messaging */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16">
          <div className="max-w-lg space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Grow with Intention. <span className="text-green-600">Show up for what matters.</span>
              </h1>
              
              <p className="text-lg text-gray-600">
                Track small wins. Build daily momentum. Create lasting change with your pod.
              </p>

              <div className="pt-6">
                <Button
                  onClick={() => router.push("/login")}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 rounded-lg text-lg font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <span>Get Started – It's Free and Yours to Keep</span>
                  <ArrowRight size={18} />
                </Button>
                <p className="text-sm text-gray-500 mt-3">
                  No ads. No distractions. Just growth.
                </p>
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-green-${100 + i * 100}`}></div>
                  ))}
                </div>
                <span className="text-sm text-gray-600 font-medium">Join the growth community</span>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Right side - Visual with dashboard preview */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-green-50 to-white items-center justify-center p-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full max-w-md aspect-square bg-white rounded-3xl shadow-xl overflow-hidden border border-green-100"
          >
            <div className="bg-green-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Leaf size={18} />
                <span className="font-medium">GrowGo Dashboard</span>
              </div>
              <div className="flex space-x-1">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-white opacity-80"></div>
                ))}
              </div>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Welcome back, Alex!</h3>
                <p className="text-gray-600 mt-1">Your 7-day streak is growing 🔥</p>
              </div>
              
              <div className="grid grid-cols-7 gap-1 mb-6">
                {Array(7).fill(0).map((_, i) => (
                  <div key={i} className={`aspect-square rounded-md ${i < 5 ? 'bg-green-500' : 'bg-gray-200'} flex items-center justify-center text-white font-medium text-xs`}>
                    {i < 5 ? '✓' : ''}
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h4 className="font-medium text-gray-800">Today's Focus</h4>
                  <p className="text-green-700 text-sm mt-1">30 minutes of focused learning</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-green-600 h-2 rounded-full w-2/3"></div>
                  </div>
                </div>
                
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800">Pod Message</h4>
                  <p className="text-gray-600 text-sm mt-1">"Great job with your consistency, Alex! Keep it up!" - Jamie</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Problem-Solution Section */}
      <section className="bg-gray-50 py-16 px-8 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">The Journey to Better Habits</h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              Moving from struggle to success with the right support.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Problems */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <span className="mr-2">You might be feeling...</span>
                <div className="h-px bg-gray-300 flex-grow ml-4"></div>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    <XCircle size={20} className="text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Too many productivity apps, none feel human</h4>
                    <p className="text-gray-600 text-sm mt-1">Digital tools that forget you're a person, not a productivity machine.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    <XCircle size={20} className="text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">You start, stop, and forget your goals</h4>
                    <p className="text-gray-600 text-sm mt-1">Even with the best intentions, consistency is hard to maintain alone.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    <XCircle size={20} className="text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">No one notices your progress</h4>
                    <p className="text-gray-600 text-sm mt-1">Small wins go unacknowledged, making it hard to stay motivated.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Solutions */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-green-700 flex items-center">
                <span className="mr-2">GrowGo helps you...</span>
                <div className="h-px bg-green-200 flex-grow ml-4"></div>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    <CheckCircle size={20} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">A pod that sees and supports your growth</h4>
                    <p className="text-gray-600 text-sm mt-1">Connect with accountability partners who notice and celebrate your progress.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    <CheckCircle size={20} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Daily check-ins that keep you aligned</h4>
                    <p className="text-gray-600 text-sm mt-1">Simple micro-commitments that build lasting momentum over time.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    <CheckCircle size={20} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">A clear dashboard to track your momentum</h4>
                    <p className="text-gray-600 text-sm mt-1">Visualize your progress and see how small actions lead to big changes.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-8 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Built to make showing up easier</h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              Simple, focused tools that work with your psychology, not against it.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users size={24} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Pods</h3>
              <p className="text-gray-600">
                Private circles for consistent feedback and encouragement from people who matter.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart2 size={24} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Streak Tracking</h3>
              <p className="text-gray-600">
                Build real momentum you can see. Every check-in reinforces your identity as someone who shows up.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar size={24} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Daily Focus</h3>
              <p className="text-gray-600">
                Start every day with a micro-commitment. One simple action that moves your needle forward.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="bg-green-50 py-16 px-8 md:px-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">What Our Community Says</h2>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="w-8 h-8 rotate-45 bg-white"></div>
            </div>
            
            <div className="text-center">
              <p className="text-xl text-gray-700 font-medium italic mb-6">
                "{testimonials[currentTestimonial].text}"
              </p>
              <div>
                <p className="font-semibold text-gray-900">{testimonials[currentTestimonial].author}</p>
                <p className="text-gray-600 text-sm">{testimonials[currentTestimonial].role}</p>
              </div>
            </div>
            
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`w-2 h-2 rounded-full ${i === currentTestimonial ? 'bg-green-600' : 'bg-gray-300'}`}
                  aria-label={`View testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-8 md:px-16 bg-gradient-to-br from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Become someone who shows up.
          </h2>
          <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
            Your future self is built by the small actions you take today.
            We're here to make those actions stick.
          </p>
          
          <Button
            onClick={() => router.push("/signup")}
            className="bg-white text-green-700 hover:bg-green-50 px-8 py-6 rounded-lg text-lg font-medium transition-all duration-300 flex items-center space-x-2 mx-auto shadow-lg"
          >
            <span>Start your growth journey →</span>
            <ArrowRight size={18} />
          </Button>
          
          <div className="mt-8 flex items-center justify-center space-x-4">
            <div className="text-sm text-green-100">Private. Minimal. Built with care.</div>
          </div>
        </div>
      </section>
      
      {/* Minimal footer */}
      <footer className="py-8 px-8 md:px-16 border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-center">
            <div className="text-sm text-gray-500">
              Made with <span className="text-green-600">🌱</span> by Dhanush • No trackers. No noise. Just growth.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}