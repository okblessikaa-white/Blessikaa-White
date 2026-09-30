import React, { useState } from 'react';
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  Zap,
  Award,
  Clock,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Challenge, ChallengeCategory, ChallengeIntensity } from '../types';
import { soundManager } from '../utils/audio';

interface AIChallengeArchitectProps {
  onAdoptChallenge: (challenge: Challenge) => void;
}

export const AIChallengeArchitect: React.FC<AIChallengeArchitectProps> = ({ onAdoptChallenge }) => {
  const [goal, setGoal] = useState('');
  const [category, setCategory] = useState<ChallengeCategory>('personal-growth');
  const [intensity, setIntensity] = useState<ChallengeIntensity>('medium');
  const [focusArea, setFocusArea] = useState('Daily Consistency');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedChallenge, setGeneratedChallenge] = useState<Challenge | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  const sampleGoals = [
    'Overcome procrastination & master deep work',
    'Run my first 5K with progressive couch-to-5k',
    'Learn conversational Spanish basics (30m/day)',
    'Quit sugar and heal gut microbiome',
    'Morning meditation and anxiety reduction',
    'Daily gratitude journaling and positive mindset',
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;

    setLoading(true);
    setError(null);
    setGeneratedChallenge(null);
    soundManager.playTick();

    try {
      const response = await fetch('/api/ai/generate-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          category,
          intensity,
          focusArea,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate challenge. Please try again.');
      }

      const data = await response.json();
      const completeChallenge: Challenge = {
        id: 'ai_' + Date.now(),
        title: data.title || `21 Days to ${goal}`,
        description: data.description || `A custom 21-day structured blueprint for ${goal}.`,
        category: (data.category as ChallengeCategory) || category,
        intensity: (data.intensity as ChallengeIntensity) || intensity,
        iconName: 'Sparkles',
        tags: ['AI Generated', category, intensity],
        isAiGenerated: true,
        milestone7: data.milestone7 || 'Week 1 Foundation Milestone',
        milestone14: data.milestone14 || 'Week 2 Momentum Milestone',
        milestone21: data.milestone21 || '21-Day Habit Mastery Transformation',
        days: data.days || [],
        createdAt: new Date().toISOString(),
      };

      setGeneratedChallenge(completeChallenge);
      soundManager.playCelebration();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to generate challenge. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdopt = () => {
    if (!generatedChallenge) return;
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#fb923c', '#f43f5e'],
    });
    soundManager.playCelebration();
    onAdoptChallenge(generatedChallenge);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 p-5 sm:p-6 text-white shadow-xl shadow-purple-900/10 border border-purple-400/20 space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white/20 text-white border border-white/30">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
            Powered by Gemini AI
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          AI 21-Day Challenge Architect
        </h2>
        <p className="text-xs sm:text-sm text-purple-200 max-w-xl">
          Enter any goal or habit you desire to build. Our AI habit scientist will generate a personalized, day-by-day 21-stage progressive neuroplasticity curriculum with daily checklists and actionable tips.
        </p>

        {/* Quick sample chips */}
        <div className="pt-2">
          <span className="text-[11px] font-semibold text-purple-200 block mb-1.5">
            Or pick a popular idea:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {sampleGoals.map((sample, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setGoal(sample)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 text-white transition-colors"
              >
                + {sample}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generator Form Card */}
      <div className="rounded-3xl bg-white border border-purple-100 p-5 sm:p-6 shadow-md space-y-4">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-purple-700">
              What specific habit or goal do you want to conquer in 21 days? *
            </label>
            <input
              type="text"
              required
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Master 30 minutes of daily Spanish practice, Drink 3L water and quit sodas, Do 50 pushups daily..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-purple-50/30 border border-purple-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ChallengeCategory)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-purple-50/30 border border-purple-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="personal-growth">Personal Growth</option>
                <option value="productivity">Productivity & Focus</option>
                <option value="fitness">Fitness & Physical</option>
                <option value="mindfulness">Mindfulness & Zen</option>
                <option value="health">Health & Nutrition</option>
                <option value="finance">Finance & Wealth</option>
                <option value="creativity">Creativity & Skills</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Intensity Level</label>
              <select
                value={intensity}
                onChange={(e) => setIntensity(e.target.value as ChallengeIntensity)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-purple-50/30 border border-purple-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="gentle">Gentle (10-15m micro-actions)</option>
                <option value="medium">Medium (20-30m steady progression)</option>
                <option value="intense">Intense (45m+ high performance)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Focus Nuance</label>
              <input
                type="text"
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
                placeholder="e.g. Overcoming resistance, Beginner friendly"
                className="w-full px-3 py-2 text-xs rounded-xl bg-purple-50/30 border border-purple-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              {error}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading || !goal.trim()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Synthesizing 21-Day Neural Curriculum...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Complete 21-Day Plan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Generated Result Preview */}
      {generatedChallenge && (
        <div className="rounded-3xl bg-white border border-purple-200 p-5 sm:p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-800 border border-purple-200">
                  AI Generated Curriculum
                </span>
                <span className="text-xs text-slate-500 capitalize">{generatedChallenge.intensity} intensity</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
                {generatedChallenge.title}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                {generatedChallenge.description}
              </p>
            </div>

            <button
              onClick={handleAdopt}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 shrink-0 transform active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Adopt & Start This Challenge</span>
            </button>
          </div>

          {/* Milestones Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-purple-50/50 border border-purple-100 text-xs">
              <span className="font-bold text-purple-700">Day 7 Milestone</span>
              <p className="text-slate-600 text-[11px] mt-0.5">{generatedChallenge.milestone7}</p>
            </div>
            <div className="p-3 rounded-2xl bg-purple-50/50 border border-purple-100 text-xs">
              <span className="font-bold text-amber-600">Day 14 Milestone</span>
              <p className="text-slate-600 text-[11px] mt-0.5">{generatedChallenge.milestone14}</p>
            </div>
            <div className="p-3 rounded-2xl bg-purple-50/50 border border-purple-100 text-xs">
              <span className="font-bold text-purple-700">Day 21 Full Mastery</span>
              <p className="text-slate-600 text-[11px] mt-0.5">{generatedChallenge.milestone21}</p>
            </div>
          </div>

          {/* 21 Days Breakdown Accordion */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Curriculum Breakdown (21 Days)
            </h4>
            <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
              {generatedChallenge.days.map((d) => {
                const isExpanded = expandedDay === d.day;
                return (
                  <div
                    key={d.day}
                    className="rounded-2xl border border-purple-100 bg-purple-50/20 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedDay(isExpanded ? null : d.day)}
                      className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-purple-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-purple-100 text-purple-800 text-[11px] font-bold flex items-center justify-center shrink-0">
                          {d.day}
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          {d.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <span className="text-[10px] text-slate-400 hidden xs:inline">
                          ~{d.estimatedMinutes}m
                        </span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-3.5 pb-3 pt-1 border-t border-purple-100 space-y-2 text-xs">
                        <p className="text-slate-600">{d.description}</p>
                        <div className="space-y-1">
                          {d.tasks.map((task, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-slate-800">
                              <span className="text-purple-600 mt-0.5">•</span>
                              <span>{task}</span>
                            </div>
                          ))}
                        </div>
                        {d.tip && (
                          <div className="flex items-start gap-1.5 p-2 rounded-xl bg-amber-50 text-[11px] text-amber-900 border border-amber-200">
                            <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                            <span>{d.tip}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleAdopt}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Adopt & Set as Active Challenge</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
