import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import dayjs from 'dayjs';

export default function DailyGoalCard() {
  const [goal, setGoal] = useState(null);
  const [checkIns, setCheckIns] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGoalAndCheckIns = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error("Failed to fetch user");
        return;
      }

      const { data: goalData, error: goalError } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (goalError) {
        toast.error("Failed to fetch goal");
        return;
      }

      setGoal(goalData);

      const { data: entries, error: checkInsError } = await supabase
        .from('check_ins')
        .select('*')
        .eq('user_id', user.id)
        .eq('goal_id', goalData?.id)
        .gte('created_at', dayjs().startOf('day').toISOString())
        .order('created_at', { ascending: false });

      if (checkInsError) {
        toast.error("Failed to fetch check-ins");
        return;
      }

      setCheckIns(entries || []);
    };

    fetchGoalAndCheckIns();
  }, []);

  const handleSubmit = async () => {
    if (!newEntry.trim() || !goal) return;
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      toast.error("User not found");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('check_ins').insert({
      goal_id: goal.id,
      user_id: user.id,
      note: newEntry, // 🔁 renamed from `content`
    });

    if (error) {
      toast.error('Check-in failed', {
        description: error.message,
      });
    } else {
      toast.success('Check-in saved!');
      setCheckIns((prev) => [
        { note: newEntry, created_at: new Date().toISOString() },
        ...prev,
      ]);
      setNewEntry('');
    }

    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">🎯 Your Current Goal</h2>
      <p className="text-gray-700 font-medium">{goal?.title || 'No goal set'}</p>

      <div>
        <Textarea
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          placeholder="What did you do today? Reflect, log, or jot something down..."
        />
        <Button onClick={handleSubmit} className="mt-3 w-full" disabled={loading}>
          {loading ? 'Saving...' : '✅ Add Check-In'}
        </Button>
      </div>

      <div className="pt-4 border-t">
        <h3 className="font-medium text-gray-700 mb-2">Today’s Check-Ins</h3>
        {checkIns.length === 0 && <p className="text-sm text-gray-400">No entries yet today.</p>}
        <ul className="space-y-2">
          {checkIns.map((entry, idx) => (
            <li key={idx} className="text-sm text-gray-600">
              <span className="text-gray-400 mr-2">•</span>
              {entry.note} <span className="text-gray-400 text-xs ml-2">({dayjs(entry.created_at).format('h:mm A')})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
