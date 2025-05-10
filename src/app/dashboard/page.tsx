"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "./components/DashboardLayout";
import UserStatsHeader from "./components/UserStatsHeader";
import DailyGoalCard from "./components/DailyGoalCard";
import PodFeed from "./components/PodFeed";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.replace("/login");
      } else {
        setLoading(false);
      }
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (loading) {
    return <div className="p-10 text-center text-gray-600">Loading your dashboard...</div>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 w-full max-w-5xl mx-auto px-4 py-6">
        <Suspense fallback={<SkeletonHeader />}>
          <UserStatsHeader />
        </Suspense>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Suspense fallback={<SkeletonCard />}>
              <DailyGoalCard />
            </Suspense>
          </div>

          <div>
            <Suspense fallback={<SkeletonPod />}>
              <PodFeed />
            </Suspense>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function SkeletonHeader() {
  return (
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-10 w-20 rounded-full" />
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">
      <Skeleton className="h-7 w-48" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-10 w-full" />
      <div className="pt-4 border-t">
        <Skeleton className="h-6 w-36 mb-2" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  );
}

function SkeletonPod() {
  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">
      <Skeleton className="h-7 w-32" />
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
