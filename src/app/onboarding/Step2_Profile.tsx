import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const EMOJI_OPTIONS = ['😎', '🎯', '🌱', '🚀', '🧠', '🔥', '🧘‍♂️'];

export default function Step2_Profile({ onNext }: { onNext: () => void }) {
  const [username, setUsername] = useState('');
  const [emoji, setEmoji] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username || !emoji) {
      toast.error('Please enter a username and choose an emoji.');
      return;
    }

    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('users')
      .update({ username, avatar_emoji: emoji })
      .eq('id', user.id);

    if (error) {
      toast.error('Failed to update profile.');
      console.error(error);
    } else {
      toast.success('Profile updated!');
      onNext();
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-8 space-y-6">
      <h2 className="text-2xl font-bold">Choose Your Pod Identity</h2>
      <p className="text-gray-500">This is how others will see you inside your pod.</p>

      <div className="space-y-2">
        <label className="block font-medium">Username <span className="text-red-500">*</span></label>
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. mindful_maker"
        />
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Pick an Avatar Emoji <span className="text-red-500">*</span></label>
        <div className="flex flex-wrap gap-3">
          {EMOJI_OPTIONS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEmoji(e)}
              className={`text-2xl p-2 rounded-xl border ${
                emoji === e ? 'bg-blue-100 border-blue-500' : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <Button className="w-full mt-4" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Saving...' : 'Continue to Pod →'}
      </Button>
    </div>
  );
}
