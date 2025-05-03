"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function UserStatsHeader() {
  const [user, setUser] = useState(null);
  const [streak, setStreak] = useState(0);
  const [lastCheckIn, setLastCheckIn] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        // Get current user
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();

        if (!currentUser) return;

        // Get user profile
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", currentUser.id)
          .single();

        setUser(profile);

        // Get streak information
        const { data: streakData } = await supabase.rpc("calculate_user_streak", {
          user_id: currentUser.id,
        });
        
        setStreak(streakData?.streak || 0);

        // Get last check-in
        const { data: recentCheckIn } = await supabase
          .from("check_ins")
          .select("created_at")
          .eq("user_id", currentUser.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        setLastCheckIn(recentCheckIn?.created_at);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return null; // Skeleton is handled by Suspense in parent
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {getGreeting()}, {user?.username || 'there'}! 👋
        </h1>
        <p className="text-gray-600">
          {lastCheckIn 
            ? `Last check-in ${dayjs(lastCheckIn).fromNow()}`
            : "No check-ins yet. Start your journey today!"}
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full font-medium flex items-center">
          <span className="mr-2">🔥</span>
          <span>{streak} day streak</span>
        </div>
      </div>
    </div>
  );
}