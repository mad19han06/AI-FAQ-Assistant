import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Sparkles, Shield, Lock, LifeBuoy, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, setIsOnboardingOpen, setIsTicketModalOpen } = useApp();

  return (
    <footer className="border-t border-[#D2D2D7]/60 dark:border-[#38383A] bg-[#F5F5F7] dark:bg-[#1C1C1E] text-[#6E6E73] dark:text-[#98989D] text-xs py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          {/* Col 1: Brand info */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-[#1D1D1F] dark:text-[#F5F5F7] font-semibold text-sm">
              <span className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <span>Fast FAQ</span>
            </div>
            <p className="text-xs max-w-sm leading-relaxed">
              An intelligent, transparent knowledge assistant built on Apple-inspired design principles. Grounded answers, verified sources, and real human support fallbacks.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-[#6E6E73] dark:text-[#98989D]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span>All Systems Operational</span>
              <span>·</span>
              <span>v2.4 LTS</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] text-xs mb-3">Product</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setCurrentView('landing')} className="hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors">
                  Overview
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('chat')} className="hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors">
                  Ask AI Assistant
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('faqs')} className="hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors">
                  Explore FAQs
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('categories')} className="hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors">
                  Category Directory
                </button>
              </li>
              <li>
                <button onClick={() => setIsOnboardingOpen(true)} className="hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors">
                  3-Step Onboarding
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Support */}
          <div>
            <h4 className="font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] text-xs mb-3">Support</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setIsTicketModalOpen(true)} className="hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors">
                  Submit Support Ticket
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('support')} className="hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors">
                  My Tickets
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('chat')} className="hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors">
                  Live Chat AI
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('login')} className="hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors">
                  Account Sign In
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('admin')} className="hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors">
                  Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Legal */}
          <div>
            <h4 className="font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] text-xs mb-3">Trust & Privacy</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => { setCurrentView('faqs'); }} className="hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors">
                  Security Architecture
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentView('faqs'); }} className="hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors">
                  Privacy Charter
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentView('faqs'); }} className="hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentView('faqs'); }} className="hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors">
                  Accessibility Statement
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D]">
            © {new Date().getFullYear()} Fast FAQ. Designed with Apple-inspired minimalism and zero-slop rigor.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Grounded Knowledge Base</span>
            <span>·</span>
            <span>AES-256 Encrypted</span>
            <span>·</span>
            <span>Zero Training Retention</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
