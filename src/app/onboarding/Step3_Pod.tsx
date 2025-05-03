import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Pod {
  id: string;
  name: string;
  tagline: string;
  is_private: boolean;
  created_by: string;
}

interface Step3PodProps {
  onFinish: () => void;
}

export default function Step3_Pod({ onFinish }: Step3PodProps) {
  const [mode, setMode] = useState<'join' | 'create'>('join');
  const [pods, setPods] = useState<Pod[]>([]);
  const [selectedPodId, setSelectedPodId] = useState<string>('');
  const [newPodName, setNewPodName] = useState<string>('');
  const [newPodTagline, setNewPodTagline] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPods = async () => {
      const { data, error } = await supabase
        .from('pods')
        .select('*')
        .eq('is_private', false);

      if (error) {
        console.error(error);
        toast.error('Failed to fetch pods.');
      } else {
        setPods(data as Pod[]);
      }
    };
    fetchPods();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error('User not found.');
      setLoading(false);
      return;
    }

    let podId = selectedPodId;

    if (mode === 'create') {
      if (!newPodName.trim()) {
        toast.error('Enter a name for your pod.');
        setLoading(false);
        return;
      }

      const { data: newPod, error } = await supabase
        .from('pods')
        .insert({
          name: newPodName,
          tagline: newPodTagline,
          created_by: user.id,
          is_private: false,
        })
        .select()
        .single();

      if (error || !newPod) {
        toast.error('Failed to create pod.');
        setLoading(false);
        return;
      }

      podId = newPod.id;
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({
        pod_id: podId,
        is_onboarded: true,
        onboarded_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      toast.error('Failed to join pod.');
      console.error(updateError);
    } else {
      toast.success('Welcome to your pod!');
      onFinish();
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-8 space-y-6">
      <h2 className="text-2xl font-bold">Choose Your Pod</h2>
      <p className="text-gray-500">Join a public pod or create your own space for growth.</p>

      <div className="flex gap-4">
        <Button variant={mode === 'join' ? 'default' : 'outline'} onClick={() => setMode('join')}>
          Join Pod
        </Button>
        <Button variant={mode === 'create' ? 'default' : 'outline'} onClick={() => setMode('create')}>
          Create Pod
        </Button>
      </div>

      {mode === 'join' ? (
        <div className="space-y-3">
          {pods.length > 0 ? (
            pods.map((pod) => (
              <button
                key={pod.id}
                onClick={() => setSelectedPodId(pod.id)}
                className={`w-full border rounded-lg p-4 text-left ${
                  selectedPodId === pod.id ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
                }`}
              >
                <div className="font-semibold">{pod.name}</div>
                <div className="text-sm text-gray-500">{pod.tagline}</div>
              </button>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No public pods found.</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <Input
            value={newPodName}
            onChange={(e) => setNewPodName(e.target.value)}
            placeholder="Pod Name"
          />
          <Input
            value={newPodTagline}
            onChange={(e) => setNewPodTagline(e.target.value)}
            placeholder="Tagline (optional)"
          />
        </div>
      )}

      <Button className="w-full mt-4" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Joining...' : 'Finish Onboarding →'}
      </Button>
    </div>
  );
}
