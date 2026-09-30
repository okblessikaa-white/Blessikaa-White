import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Volume2,
  VolumeX,
  Flame,
  Send,
  Loader2,
  Quote,
  Lightbulb,
  Heart,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import { Challenge, DayLog, MotivationBoost, UserChallengeProgress } from '../types';
import { soundManager } from '../utils/audio';

interface AICoachModalProps {
  challenge: Challenge;
  progress: UserChallengeProgress;
  onClose: () => void;
}

export const AICoachModal: React.FC<AICoachModalProps> = ({ challenge, progress, onClose }) => {
  const [activeTab, setActiveTab] = useState<'motivation' | 'chat'>('motivation');
  const [boost, setBoost] = useState<MotivationBoost | null>(null);
  const [loadingBoost, setLoadingBoost] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  // Chat Q&A State
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatResponse, setChatResponse] = useState<{
    answer: string;
    practicalTips: string[];
  } | null>(null);

  const completedCount = (Object.values(progress.dayLogs) as DayLog[]).filter(
    (l) => l.completed
  ).length;

  const fetchDailyBoost = async () => {
    setLoadingBoost(true);
    soundManager.playTick();
    try {
      const response = await fetch('/api/ai/daily-motivation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeTitle: challenge.title,
          currentDay: progress.currentDay || 1,
          streak: progress.streak || 0,
          completedTasksCount: completedCount,
          mood: progress.dayLogs[progress.currentDay]?.mood || 'Determined',
        }),
      });

      if (!response.ok) {
        throw new Error('Could not generate boost');
      }

      const data = await response.json();
      setBoost(data);
      soundManager.playStreakChime();
    } catch (e) {
      console.error(e);
      // High quality fallback
      setBoost({
        quote: 'Every action you take is a vote for the type of person you wish to become.',
        message: `You are on Day ${progress.currentDay} with a ${progress.streak}-day streak in "${challenge.title}". Consistency compounds into identity!`,
        actionableNudge: 'Take 3 slow box breaths right now and visualize yourself crossing Day 21 with pride.',
        affirmation: 'I am disciplined, resilient, and capable of rewiring my habits one day at a time.',
      });
    } finally {
      setLoadingBoost(false);
    }
  };

  // Speak aloud with SpeechSynthesis
  const speakMotivation = () => {
    if (!boost || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const textToSpeak = `${boost.quote}. ${boost.message}. Remember: ${boost.actionableNudge}. Affirmation: ${boost.affirmation}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleAskCoach = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuestion.trim()) return;

    setChatLoading(true);
    soundManager.playTick();
    try {
      const response = await fetch('/api/ai/coach-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: chatQuestion,
          challengeContext: {
            title: challenge.title,
            currentDay: progress.currentDay,
            streak: progress.streak,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Coach service error');
      }

      const data = await response.json();
      setChatResponse(data);
      soundManager.playTick();
    } catch (e) {
      console.error(e);
      setChatResponse({
        answer: `When encountering friction on "${challenge.title}", remember James Clear's 2-Minute Rule. Reduce the initial step to make starting irresistible.`,
        practicalTips: [
          'Anchor this habit immediately after your morning coffee or established cue.',
          'Prepare all tools and environment items the evening prior.',
          'Never miss two days in a row — a single slip is an accident; two slips is the start of a new bad habit.',
        ],
      });
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl rounded-3xl bg-white border border-purple-100 shadow-2xl p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => {
            if (speaking && typeof window !== 'undefined') window.speechSynthesis?.cancel();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-purple-100 text-purple-700 border border-purple-200">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
              Personalized AI Habit Coach
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Daily Motivation & Advice
          </h3>
          <p className="text-xs text-slate-600">
            Tailored to Day {progress.currentDay} of "{challenge.title}" ({progress.streak}-day streak).
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-purple-50/50 border border-purple-100">
          <button
            onClick={() => setActiveTab('motivation')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'motivation'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Daily Motivation Boost</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'chat'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Habit Doctor Q&A</span>
          </button>
        </div>

        {/* Tab 1: Daily Motivation Boost */}
        {activeTab === 'motivation' && (
          <div className="space-y-4 pt-1">
            {!boost && !loadingBoost ? (
              <div className="text-center py-8 px-4 rounded-2xl bg-purple-50/30 border border-purple-100 space-y-3">
                <div className="w-12 h-12 rounded-full bg-purple-600 mx-auto flex items-center justify-center shadow-md">
                  <Sparkles className="w-6 h-6 text-amber-300" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">
                    Need a Psychological Spark Today?
                  </h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Generate an instant energizing booster, custom-crafted by AI for your exact Day {progress.currentDay} progress and streak.
                  </p>
                </div>
                <button
                  onClick={fetchDailyBoost}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition-all transform active:scale-95"
                >
                  Generate Daily Motivational Boost
                </button>
              </div>
            ) : loadingBoost ? (
              <div className="text-center py-10 rounded-2xl bg-purple-50/30 border border-purple-100 space-y-2">
                <Loader2 className="w-6 h-6 animate-spin text-purple-600 mx-auto" />
                <p className="text-xs text-slate-600">
                  Consulting habit psychology & creating your daily booster...
                </p>
              </div>
            ) : boost ? (
              <div className="space-y-3.5 animate-in fade-in zoom-in-95 duration-150">
                {/* Quote Card */}
                <div className="relative p-4 rounded-2xl bg-purple-50 border border-purple-100 space-y-2">
                  <Quote className="w-6 h-6 text-purple-300 absolute top-3 right-3" />
                  <div className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                    Daily Wisdom
                  </div>
                  <p className="text-sm font-medium text-slate-800 italic leading-relaxed">
                    "{boost.quote}"
                  </p>
                </div>

                {/* Personal Message */}
                <div className="p-3.5 rounded-2xl bg-white border border-purple-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>Coach Note for Day {progress.currentDay}:</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {boost.message}
                  </p>
                </div>

                {/* Actionable Nudge */}
                <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                    <span>1-Minute Action Nudge:</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {boost.actionableNudge}
                  </p>
                </div>

                {/* Affirmation */}
                <div className="p-3 rounded-2xl bg-purple-50/40 border border-purple-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700">
                    <Heart className="w-3.5 h-3.5 text-purple-600" />
                    <span>Today's Affirmation:</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-900">
                    "{boost.affirmation}"
                  </p>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={speakMotivation}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      speaking
                        ? 'bg-purple-100 border-purple-300 text-purple-800'
                        : 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'
                    }`}
                  >
                    {speaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{speaking ? 'Stop Voice' : 'Read Aloud'}</span>
                  </button>

                  <button
                    onClick={fetchDailyBoost}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition-all"
                  >
                    Refresh Booster
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Tab 2: Habit Doctor Q&A */}
        {activeTab === 'chat' && (
          <div className="space-y-4 pt-1">
            <form onSubmit={handleAskCoach} className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
                <span>Ask about habits, overcoming resistance, or friction:</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={chatQuestion}
                  onChange={(e) => setChatQuestion(e.target.value)}
                  placeholder="e.g. How do I maintain consistency when traveling? What if I miss a day?"
                  className="w-full pl-3.5 pr-20 py-2.5 text-xs rounded-xl bg-purple-50/30 border border-purple-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  disabled={chatLoading || !chatQuestion.trim()}
                  className="absolute right-1.5 top-1.5 px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 disabled:opacity-40 flex items-center gap-1"
                >
                  {chatLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                  <span>Ask</span>
                </button>
              </div>
            </form>

            {/* Quick suggested questions */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-medium">
                Common questions:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'How to overcome afternoon resistance?',
                  'How does habit stacking work?',
                  'What if I feel like quitting on Day 10?',
                ].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setChatQuestion(q)}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-medium transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {chatResponse && (
              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2.5 animate-in fade-in duration-150">
                <div className="text-xs font-bold text-purple-800">
                  AI Coach Guidance:
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {chatResponse.answer}
                </p>

                {chatResponse.practicalTips && chatResponse.practicalTips.length > 0 && (
                  <div className="space-y-1 pt-1 border-t border-purple-100">
                    <span className="text-[11px] font-bold text-purple-900">
                      Tactical Recommendations:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {chatResponse.practicalTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-purple-600 mt-0.5">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
