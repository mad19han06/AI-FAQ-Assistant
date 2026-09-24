import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { MessageSquare, ShieldCheck, Compass, ArrowRight, Check } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, setCurrentView } = useApp();
  const [step, setStep] = useState<number>(1);

  if (!isOnboardingOpen) return null;

  const steps = [
    {
      stepNumber: '01',
      title: 'Ask naturally',
      tagline: 'Simple. Human. Direct.',
      description:
        "Type your question just like you're talking to a person. The AI understands conversational context, follow-ups, and natural phrasing.",
      icon: MessageSquare,
      graphicColor: 'from-blue-600 to-indigo-500',
    },
    {
      stepNumber: '02',
      title: 'Get reliable answers',
      tagline: 'Transparency by design.',
      description:
        'Answers are strictly grounded in our verified FAQ knowledge base. High confidence matches show verified badges, while unknown queries transparently offer support escalations without hallucinating.',
      icon: ShieldCheck,
      graphicColor: 'from-blue-500 to-teal-400',
    },
    {
      stepNumber: '03',
      title: 'Find more',
      tagline: 'Continuous discovery.',
      description:
        'Explore related questions, save useful answers to your personal vault, check knowledge sources, or connect instantly with human support specialists.',
      icon: Compass,
      graphicColor: 'from-emerald-500 to-blue-500',
    },
  ];

  const currentStepData = steps[step - 1];
  const Icon = currentStepData.icon;

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsOnboardingOpen(false);
      setCurrentView('chat');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7] dark:border-[#38383A] rounded-3xl shadow-2xl p-8 text-center animate-in zoom-in-95 duration-200">
        {/* Step indicator pills */}
        <div className="flex items-center justify-center gap-1.5 mb-8">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step
                  ? 'w-8 bg-blue-600 dark:bg-blue-400'
                  : 'w-2 bg-neutral-200 dark:bg-neutral-800'
              }`}
            />
          ))}
        </div>

        {/* Visual Icon Badge */}
        <div
          className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-tr ${currentStepData.graphicColor} text-white flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-105`}
        >
          <Icon className="w-10 h-10" />
        </div>

        {/* Content */}
        <span className="text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
          Step {step} of 3
        </span>
        <h3 className="text-2xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] mt-1 mb-2">
          {currentStepData.title}
        </h3>
        <p className="text-xs font-medium text-[#6E6E73] dark:text-[#98989D] mb-4">
          {currentStepData.tagline}
        </p>
        <p className="text-sm text-[#6E6E73] dark:text-[#98989D] leading-relaxed mb-8">
          {currentStepData.description}
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsOnboardingOpen(false);
            }}
            className="flex-1 py-3 px-4 text-xs font-medium text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Skip
          </button>
          <button
            onClick={handleNext}
            className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-medium rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all"
          >
            <span>{step === 3 ? 'Get Started' : 'Continue'}</span>
            {step === 3 ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
