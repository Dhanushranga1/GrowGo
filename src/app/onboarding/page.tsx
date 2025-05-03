'use client';

import { useState } from 'react';
import Step1_Goal from '@/app/onboarding/Step1_Goal';
import Step2_Profile from '@/app/onboarding/Step2_Profile';
import Step3_Pod from '@/app/onboarding/Step3_Pod';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const [step, setStep] = useState<number>(1); // ✅ type number explicitly
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      {step === 1 && <Step1_Goal onNext={() => setStep(2)} />}
      {step === 2 && <Step2_Profile onNext={() => setStep(3)} />}
      {step === 3 && <Step3_Pod onFinish={() => router.push('/dashboard')} />}
    </div>
  );
}
