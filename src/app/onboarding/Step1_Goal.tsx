import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const FOCUS_AREAS = [
  { label: 'Health 🏃‍♂️', value: 'Health' },
  { label: 'Learning 📚', value: 'Learning' },
  { label: 'Creativity 🎨', value: 'Creativity' },
  { label: 'Discipline ⏰', value: 'Discipline' },
  { label: 'Relationships 💬', value: 'Relationships' },
  { label: 'Custom ✍️', value: 'Custom' },
];

export default function Step1_Goal({ onNext }: { onNext: () => void }) {
  const [focusArea, setFocusArea] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!focusArea || !title) {
      toast.error('Please fill in required fields.');
      return;
    }

    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    const { error } = await supabase.from('goals').insert({
      user_id: userId,
      focus_area: focusArea,
      title,
      description,
    });

    if (error) {
      toast.error('Failed to save goal.');
      console.error(error);
    } else {
      toast.success('Goal saved!');
      onNext();
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-8 space-y-6">
      <h2 className="text-2xl font-bold">What do you want to grow in?</h2>
      <p className="text-gray-500">Choose something that excites you or scares you a little.</p>

      <div className="space-y-2">
        <label className="block font-medium">Focus Area <span className="text-red-500">*</span></label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {FOCUS_AREAS.map((area) => (
            <button
              key={area.value}
              type="button"
              onClick={() => setFocusArea(area.value)}
              className={`border rounded-xl px-4 py-2 text-sm font-medium hover:bg-muted transition ${
                focusArea === area.value ? 'bg-blue-100 border-blue-600 text-blue-800' : 'bg-white'
              }`}
            >
              {area.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Goal Title <span className="text-red-500">*</span></label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Run 5km daily" />
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Description (optional)</label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Why this goal matters..." />
      </div>

      <Button className="w-full mt-4" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Saving...' : 'Commit & Continue →'}
      </Button>
    </div>
  );
}
