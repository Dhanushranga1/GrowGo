"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Badge } from "@/components/ui/badge";

dayjs.extend(relativeTime);

type CheckIn = {
  note: string;
  created_at: string;
};

type PodMember = {
  user_id: string;
  username: string;
  email: string;
  streak: number;
  avatar_url?: string;
};

type PodMemberWithCheckIn = PodMember & {
  latest_check_in?: CheckIn;
};

export default function PodFeed() {
  const [podMembers, setPodMembers] = useState<PodMemberWithCheckIn[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPodMembers = async () => {
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();

        if (!currentUser) return;

        const { data: currentProfile, error: profileError } = await supabase
          .from<{ pod_id: string }>("users")
          .select("pod_id")
          .eq("id", currentUser.id)
          .single();

        if (profileError || !currentProfile?.pod_id) {
          setLoading(false);
          return;
        }

        const { data: members, error: memberError } = await supabase
          .from<PodMember>("pod_members")
          .select("*")
          .eq("pod_id", currentProfile.pod_id);

        if (memberError || !members) {
          setLoading(false);
          return;
        }

        const membersWithCheckIns: PodMemberWithCheckIn[] = await Promise.all(
          members.map(async (member) => {
            const { data: latestCheckIn } = await supabase
              .from<CheckIn>("check_ins")
              .select("note, created_at")
              .eq("user_id", member.user_id)
              .order("created_at", { ascending: false })
              .limit(1)
              .single();

            return {
              ...member,
              latest_check_in: latestCheckIn ?? undefined,
            };
          })
        );

        const sorted = membersWithCheckIns.sort((a, b) => {
          if (!a.latest_check_in) return 1;
          if (!b.latest_check_in) return -1;
          return (
            dayjs(b.latest_check_in.created_at).unix() -
            dayjs(a.latest_check_in.created_at).unix()
          );
        });

        setPodMembers(sorted);
      } catch (err) {
        console.error("Error fetching pod feed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPodMembers();

    const channel = supabase
      .channel("pod-updates")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "check_ins" },
        () => fetchPodMembers()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">👥 Your Pod</h2>

      {podMembers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No pod members yet.</p>
          <p className="text-sm text-gray-400 mt-1">
            Invite friends to join your accountability pod!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {podMembers.map((member) => (
            <div key={member.user_id} className="flex items-start space-x-3">
              <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-medium overflow-hidden">
                {member.avatar_url ? (
                  <img
                    src={member.avatar_url}
                    alt={member.username}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  member.username?.charAt(0).toUpperCase() || "?"
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center">
                  <span className="font-medium text-gray-900">
                    {member.username || member.email}
                  </span>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    🔥 {member.streak}
                  </Badge>
                </div>

                {member.latest_check_in ? (
                  <div className="mt-1">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {member.latest_check_in.note}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {dayjs(member.latest_check_in.created_at).fromNow()}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 mt-1">No recent activity</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pt-4 border-t mt-4">
        <button className="text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors">
          View All Pod Activity →
        </button>
      </div>
    </div>
  );
}
