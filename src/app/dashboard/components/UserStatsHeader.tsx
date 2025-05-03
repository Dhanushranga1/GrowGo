"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type UserProfile = {
  id: string;
  username?: string;
  // Add more fields if needed (e.g., email, avatar_url)
};

type CheckIn = {
  created_at: string;
};

export default function UserStatsHeader() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const {
          data: { user: currentUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !currentUser) return;

        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("id, username")
          .eq("id", currentUser.id)
          .single();

        if (profileError || !profile) return;

        setUser(profile);

        const { data: streakData, error: streakError } = await supabase.rpc("calculate_user_streak", {
          user_id: currentUser.id,
        });

        if (!streakError && streakData?.streak !== undefined) {
          setStreak(streakData.streak);
        }

        const { data: recentCheckIn, error: checkInError } = await supabase
          .from("check_ins")
          .select("created_at")
          .eq("user_id", currentUser.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (!checkInError && recentCheckIn) {
          setLastCheckIn(recentCheckIn.created_at);
        }
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (loading) return null;

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {getGreeting()}, {user?.username || "there"}! 👋
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
