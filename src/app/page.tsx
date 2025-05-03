"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Leaf } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white text-gray-900 px-6 py-12 flex flex-col items-center justify-center text-center space-y-12">
      <header className="flex items-center justify-center w-full mb-8">
        <div className="flex items-center space-x-2">
          <div className="bg-green-600 p-2 rounded-lg">
            <Leaf size={28} className="text-white" strokeWidth={2} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-green-600 tracking-tight">
            GrowGo
          </h1>
        </div>
      </header>
      
      <div className="space-y-6 max-w-3xl">
        <h2 className="text-5xl md:text-6xl font-extrabold leading-tight text-green-600">
          Build Habits That Stick.
        </h2>
        <p className="text-lg md:text-xl text-gray-600">
          GrowGo was built with one purpose: to help you grow 1% every day — with consistency, intention, and a support system that keeps you going.
        </p>
        <p className="text-md md:text-lg text-gray-600">
          Log your daily progress. Reflect with short check-ins. Stay accountable with a pod of likeminded individuals. No distractions, no doomscrolling.
        </p>
        <Button
          onClick={() => router.push("/login")}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl text-lg font-medium shadow-lg transition-all duration-300"
        >
          Get Started →
        </Button>
      </div>
      
      <div className="max-w-4xl w-full mt-12">
        <div className="grid md:grid-cols-3 gap-8 text-left">
          <FeatureCard
            icon="🌱"
            title="Daily Check-Ins"
            description="Take a minute each day to write what you did. That's all it takes to build awareness."
          />
          <FeatureCard
            icon="🧠"
            title="Clarity & Reflection"
            description="Journaling meets goal-tracking — track progress and revisit how far you've come."
          />
          <FeatureCard
            icon="👥"
            title="Accountability Pod"
            description="Stay consistent by joining a pod. Celebrate wins, encourage progress, and grow together."
          />
        </div>
      </div>
      
      <footer className="mt-16 pt-8 border-t border-green-100 text-sm text-gray-500 w-full max-w-4xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Leaf size={16} className="text-green-600" />
            <span className="font-semibold text-green-600">GrowGo</span>
          </div>
          <div>
            © {new Date().getFullYear()} GrowGo. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white border border-green-100 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:border-green-200">
      <div className="flex items-start mb-4">
        <span className="text-2xl mr-3">{icon}</span>
        <h3 className="text-xl font-bold text-green-600">{title}</h3>
      </div>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}