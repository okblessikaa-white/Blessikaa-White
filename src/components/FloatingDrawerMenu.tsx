import React, { useState } from 'react';
import {
  Menu,
  X,
  BookOpen,
  Sparkles,
  Sun,
  Users,
  Share2,
  BookMarked,
  Bell,
  Flame,
  Image as ImageIcon,
  Music,
  HelpCircle,
  Mail,
  ShieldCheck,
  Award,
  Crown,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Download,
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface FloatingDrawerMenuProps {
  onOpenPenaltiesRewards: () => void;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  onNavigateTab: (tab: any) => void;
  streakCount: number;
}

export const FloatingDrawerMenu: React.FC<FloatingDrawerMenuProps> = ({
  onOpenPenaltiesRewards,
  onOpenNotifications,
  onOpenSettings,
  onNavigateTab,
  streakCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<
    'blog' | 'reminder' | 'music' | 'wallpapers' | 'faq' | 'book' | null
  >(null);

  // Ambient sound synthesizer state
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [activeSound, setActiveSound] = useState<'rain' | 'forest' | 'waves' | 'zen'>('zen');

  const handleToggleSound = () => {
    setIsPlayingMusic(!isPlayingMusic);
    soundManager.playTick();
    triggerHaptic('light');
  };

  return (
    <>
      {/* Floating Hamburger Round Button on bottom right matching Screenshot 1 */}
      <button
        id="floating-menu-btn"
        onClick={() => {
          setIsOpen(true);
          soundManager.playTick();
          triggerHaptic('medium');
        }}
        className="fixed bottom-24 right-5 sm:right-8 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-xl shadow-purple-600/30 flex items-center justify-center border-2 border-white/40 transform active:scale-90 hover:scale-105 transition-all"
        title="Open Blessikaa Hub Menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-sm h-full bg-[#FAF8F5] border-l border-purple-100 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                    <span className="text-purple-700">Blessikaa</span> Menu
                  </h3>
                  <p className="text-[11px] text-purple-700/80 font-medium">
                    21-Day Transformation Ecosystem
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full bg-white hover:bg-purple-50 text-slate-700 border border-purple-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Streak Banner */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2.5">
                  <Flame className="w-6 h-6 text-amber-300 fill-current animate-pulse" />
                  <div>
                    <div className="text-xs font-black uppercase tracking-wider text-purple-100">
                      Active Streak
                    </div>
                    <div className="text-base font-black">{streakCount} Days Strong</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onNavigateTab('today');
                  }}
                  className="px-3 py-1 rounded-xl bg-white text-purple-900 text-xs font-bold shadow-xs hover:bg-purple-50"
                >
                  View Day
                </button>
              </div>

              {/* Menu Items matching Screenshot 2 */}
              <div className="space-y-1 pt-2">
                <button
                  id="menu-btn-menstrual"
                  onClick={() => {
                    setIsOpen(false);
                    soundManager.playTick();
                    triggerHaptic('medium');
                    onNavigateTab('menstrual-cycle');
                  }}
                  className="w-full p-3 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-left flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🌸</span>
                    <div>
                      <span className="text-xs font-black text-purple-900 block">Menstrual Cycle Tracker</span>
                      <span className="text-[10px] text-purple-600 font-medium">Periods, phases & fertility</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-purple-200 text-purple-900 font-black px-2 py-0.5 rounded-full">
                    Health
                  </span>
                </button>

                <button
                  id="menu-btn-services"
                  onClick={() => {
                    setIsOpen(false);
                    soundManager.playTick();
                    triggerHaptic('light');
                    onNavigateTab('services-hub');
                  }}
                  className="w-full p-3 rounded-2xl bg-white hover:bg-purple-50 border border-purple-100 text-left flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🗂️</span>
                    <span className="text-xs font-bold text-slate-800">Ecosystem Services (69+)</span>
                  </div>
                  <span className="text-[10px] text-purple-600 font-semibold">Workspaces</span>
                </button>

                <button
                  onClick={() => {
                    setActiveModal('blog');
                    soundManager.playTick();
                  }}
                  className="w-full p-3 rounded-2xl bg-white hover:bg-purple-50 border border-purple-100 text-left flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📖</span>
                    <span className="text-xs font-bold text-slate-800">Blog & Science</span>
                  </div>
                  <span className="text-[10px] text-purple-600 font-semibold">Articles</span>
                </button>

                <button
                  onClick={() => {
                    onOpenPenaltiesRewards();
                    setIsOpen(false);
                    soundManager.playTick();
                  }}
                  className="w-full p-3 rounded-2xl bg-white hover:bg-purple-50 border border-purple-100 text-left flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">⚖️</span>
                    <span className="text-xs font-bold text-slate-800">
                      Penalty & Reward Setup
                    </span>
                  </div>
                  <span className="text-[10px] text-purple-600 font-semibold">Customize</span>
                </button>

                <button
                  onClick={() => {
                    setActiveModal('reminder');
                    soundManager.playTick();
                  }}
                  className="w-full p-3 rounded-2xl bg-white hover:bg-purple-50 border border-purple-100 text-left flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">💡</span>
                    <span className="text-xs font-bold text-slate-800">Reminder of the Day</span>
                  </div>
                  <span className="text-[10px] text-amber-600 font-semibold">Daily Boost</span>
                </button>

                <button
                  onClick={() => {
                    setActiveModal('music');
                    soundManager.playTick();
                  }}
                  className="w-full p-3 rounded-2xl bg-white hover:bg-purple-50 border border-purple-100 text-left flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🎵</span>
                    <span className="text-xs font-bold text-slate-800">Relaxing Music</span>
                  </div>
                  <span className="text-[10px] text-purple-600 font-semibold">Soundscape</span>
                </button>

                <button
                  onClick={() => {
                    setActiveModal('wallpapers');
                    soundManager.playTick();
                  }}
                  className="w-full p-3 rounded-2xl bg-white hover:bg-purple-50 border border-purple-100 text-left flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🖼️</span>
                    <span className="text-xs font-bold text-slate-800">Wallpapers</span>
                  </div>
                  <span className="text-[10px] text-purple-600 font-semibold">Aesthetic</span>
                </button>

                <button
                  onClick={() => {
                    setActiveModal('book');
                    soundManager.playTick();
                  }}
                  className="w-full p-3 rounded-2xl bg-white hover:bg-purple-50 border border-purple-100 text-left flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📚</span>
                    <span className="text-xs font-bold text-slate-800">Buy My Book</span>
                  </div>
                  <span className="text-[10px] text-purple-600 font-semibold">Author</span>
                </button>

                <button
                  onClick={() => {
                    setActiveModal('faq');
                    soundManager.playTick();
                  }}
                  className="w-full p-3 rounded-2xl bg-white hover:bg-purple-50 border border-purple-100 text-left flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">❓</span>
                    <span className="text-xs font-bold text-slate-800">FAQ & Guide</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">Help</span>
                </button>

                <button
                  onClick={() => {
                    onOpenSettings();
                    setIsOpen(false);
                    soundManager.playTick();
                  }}
                  className="w-full p-3 rounded-2xl bg-white hover:bg-purple-50 border border-purple-100 text-left flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">⚙️</span>
                    <span className="text-xs font-bold text-slate-800">App Settings</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">Prefs</span>
                </button>
              </div>
            </div>

            {/* Social Links & Footer */}
            <div className="pt-4 border-t border-purple-200/80 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold">Follow & Join:</span>
                <div className="flex gap-2">
                  <span className="px-2 py-1 rounded-lg bg-white border border-purple-200 text-xs font-bold text-slate-800">
                    TikTok
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-white border border-purple-200 text-xs font-bold text-purple-800">
                    Instagram
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-white border border-purple-200 text-xs font-bold text-red-600">
                    YouTube
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-center text-slate-500">
                Blessikaa © 21-Day Habit Transformation Engine
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sub-modals for Drawer items */}
      {activeModal === 'reminder' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-white border border-purple-100 shadow-2xl p-6 text-center space-y-4">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl mx-auto">
              💡
            </div>
            <h3 className="text-xl font-black text-slate-900">Reminder of the Day</h3>
            <p className="text-sm font-serif italic text-purple-950 px-4 leading-relaxed">
              "You do not rise to the level of your goals. You fall to the level of your systems. Each small habit completed today rewires your subconscious."
            </p>
            <div className="p-3 bg-purple-50 rounded-2xl text-xs text-purple-800 font-semibold">
              Today's Focus: Show up for Day {streakCount + 1}, even for just 5 minutes.
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
            >
              Got It ✨
            </button>
          </div>
        </div>
      )}

      {activeModal === 'blog' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white border border-purple-100 shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span>📖</span> Habit Science Articles
            </h3>
            <div className="space-y-3">
              {[
                {
                  title: 'Why 21 Days Changes Your Synaptic Pathways',
                  readTime: '3 min read',
                  snippet:
                    'Neuroplasticity research by Dr. Maxwell Maltz shows it takes a minimum of 21 consecutive days of conscious effort for the brain to carve new mental automatic pathways.',
                },
                {
                  title: 'Overcoming The "Day 7 Friction Wall"',
                  readTime: '4 min read',
                  snippet:
                    'Around Day 7, dopamine novelty wears off. Using our micro-step technique and scratch rewards allows you to bypass cognitive resistance effortlessly.',
                },
                {
                  title: 'The Power of Custom Accountability Penalties',
                  readTime: '2 min read',
                  snippet:
                    'Loss aversion is a proven psychological lever. Setting a small physical or digital penalty keeps motivation high during low-willpower evenings.',
                },
              ].map((article, i) => (
                <div key={i} className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] text-purple-600 font-bold uppercase">
                    <span>Research Paper</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{article.title}</h4>
                  <p className="text-xs text-slate-600">{article.snippet}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeModal === 'music' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-white border border-purple-100 shadow-2xl p-6 text-center space-y-4">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl mx-auto">
              🎵
            </div>
            <h3 className="text-xl font-black text-slate-900">Relaxing Ambient Sounds</h3>
            <p className="text-xs text-slate-600">
              Calm your nervous system and enter deep focus flow during habit execution.
            </p>

            <div className="grid grid-cols-2 gap-2.5 py-2">
              {[
                { id: 'zen', name: 'Tibetan Zen Bowl', icon: '🧘' },
                { id: 'rain', name: 'Gentle Rain', icon: '🌧️' },
                { id: 'forest', name: 'Deep Forest', icon: '🌲' },
                { id: 'waves', name: 'Ocean Waves', icon: '🌊' },
              ].map((sound) => (
                <button
                  key={sound.id}
                  onClick={() => {
                    setActiveSound(sound.id as any);
                    soundManager.playTick();
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                    activeSound === sound.id
                      ? 'bg-purple-100 border-purple-600 text-purple-900 font-bold'
                      : 'bg-white border-purple-100 text-slate-700 hover:bg-purple-50'
                  }`}
                >
                  <span className="text-2xl">{sound.icon}</span>
                  <span className="text-xs">{sound.name}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleToggleSound}
              className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                isPlayingMusic
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {isPlayingMusic ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause Soundscape</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Play {activeSound.toUpperCase()} Frequency</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {activeModal === 'wallpapers' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white border border-purple-100 shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span>🖼️</span> Aesthetic Habit Wallpapers
            </h3>
            <p className="text-xs text-slate-500">
              Download inspiring mobile wallpapers to keep your goals front and center.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { title: 'Morning Light', color: 'from-amber-200 to-purple-400', quote: 'Rise & Conquer' },
                { title: 'Zen Lilac', color: 'from-purple-300 to-indigo-500', quote: 'Steady Mind' },
                { title: 'Deep Discipline', color: 'from-indigo-600 to-purple-800', quote: 'Day by Day' },
                { title: 'Golden Hour', color: 'from-yellow-300 to-pink-400', quote: 'Stay Grateful' },
                { title: 'Ecosystem Harmony', color: 'from-emerald-300 to-teal-600', quote: 'Rooted Habits' },
                { title: 'Cosmic Focus', color: 'from-purple-900 to-slate-900', quote: 'Unstoppable' },
              ].map((wp, i) => (
                <div
                  key={i}
                  className={`h-40 rounded-2xl bg-gradient-to-br ${wp.color} p-3 text-white flex flex-col justify-between shadow-md relative group overflow-hidden`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full self-start">
                    {wp.title}
                  </span>
                  <div className="text-center font-black text-xs drop-shadow-md">"{wp.quote}"</div>
                  <button
                    onClick={() => {
                      soundManager.playCelebration();
                      triggerHaptic('success');
                      alert(`Downloading "${wp.title}" wallpaper for your phone background!`);
                    }}
                    className="w-full py-1.5 rounded-xl bg-white/90 text-slate-900 text-[10px] font-bold hover:bg-white flex items-center justify-center gap-1 shadow-xs"
                  >
                    <Download className="w-3 h-3" />
                    Save
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeModal === 'book' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-white border border-purple-100 shadow-2xl p-6 text-center space-y-4">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-2xl mx-auto shadow-md">
              📚
            </div>
            <h3 className="text-xl font-black text-slate-900">"The 21-Day Awakening"</h3>
            <p className="text-xs text-slate-600 leading-relaxed px-2">
              The official companion book by the creator of Blessikaa. Discover the step-by-step psychological blueprint for breaking toxic cycles and rebuilding your identity.
            </p>
            <div className="p-3 bg-purple-50 rounded-2xl text-xs text-purple-900 font-bold border border-purple-200">
              Includes 50+ Habit Blueprints, Printable Planners & Reflection Logs.
            </div>
            <button
              onClick={() => {
                soundManager.playCelebration();
                triggerHaptic('success');
                alert('Redirecting to author store / digital edition!');
                setActiveModal(null);
              }}
              className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md"
            >
              Order Hardcover / E-Book ($14.99)
            </button>
          </div>
        </div>
      )}

      {activeModal === 'faq' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white border border-purple-100 shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span>❓</span> Frequently Asked Questions
            </h3>
            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1">
                <span className="font-bold text-purple-900 block">Why are future days locked?</span>
                <p>
                  Consistency is built incrementally. Skipping ahead overloads cognitive willpower. You must complete today's day to unlock tomorrow.
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1">
                <span className="font-bold text-purple-900 block">How does the Scratch Card work?</span>
                <p>
                  Each day has a hidden mystery tip and bonus checklist. Scratch the gold foil on Today's screen to reveal your actionable mission!
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1">
                <span className="font-bold text-purple-900 block">How do Penalties and Rewards work?</span>
                <p>
                  Use the Custom Penalty & Reward Manager to hold yourself accountable. If you miss a day, enforce your chosen commitment. When you complete days, claim your rewards with earned XP!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
