import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { FAQ_CATEGORIES } from '../data/knowledgeBase.ts';
import {
  UserCheck,
  CreditCard,
  Package,
  Cpu,
  ShieldCheck,
  Lock,
  HelpCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const CategoriesView: React.FC = () => {
  const { faqs, setSelectedCategoryFilter, setCurrentView, askQuestionInChat } = useApp();

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'UserCheck':
        return UserCheck;
      case 'CreditCard':
        return CreditCard;
      case 'Package':
        return Package;
      case 'Cpu':
        return Cpu;
      case 'ShieldCheck':
        return ShieldCheck;
      case 'Lock':
        return Lock;
      default:
        return HelpCircle;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 pt-6">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          Topic Directory
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
          Categories
        </h1>
        <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#98989D] leading-relaxed">
          Browse verified articles and guides across core platform branches.
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {FAQ_CATEGORIES.map(cat => {
          const Icon = getCategoryIcon(cat.iconName);
          const categoryFaqs = faqs.filter(f => f.category === cat.slug);

          return (
            <div
              key={cat.id}
              className="p-6 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7]/70 dark:border-[#38383A] shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs"
                    style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[#6E6E73] dark:text-[#98989D] tabular-nums">
                    {categoryFaqs.length} {categoryFaqs.length === 1 ? 'article' : 'articles'}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                  {cat.name}
                </h2>
                <p className="text-xs text-[#6E6E73] dark:text-[#98989D] mt-2 leading-relaxed">
                  {cat.description}
                </p>

                {/* Sample top questions */}
                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 space-y-1.5">
                  <span className="text-[10px] font-semibold text-[#6E6E73] dark:text-[#98989D] uppercase tracking-wider">
                    Popular in this topic:
                  </span>
                  {categoryFaqs.slice(0, 2).map(f => (
                    <p
                      key={f.id}
                      onClick={() => {
                        setSelectedCategoryFilter(cat.slug);
                        setCurrentView('faqs');
                      }}
                      className="text-xs text-[#1D1D1F] dark:text-[#F5F5F7] hover:text-blue-600 truncate cursor-pointer"
                    >
                      • {f.question}
                    </p>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedCategoryFilter(cat.slug);
                    setCurrentView('faqs');
                  }}
                  className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Explore Topic</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => askQuestionInChat(`What are the key policies regarding ${cat.name}?`)}
                  className="p-1.5 rounded-lg text-[#6E6E73] hover:text-blue-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  title="Ask AI about this category"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
