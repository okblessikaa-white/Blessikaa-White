import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Heart,
  Activity,
  Zap,
  Coffee,
  Dumbbell,
  CheckCircle2,
  Check,
  Calendar,
  ChevronRight,
  Info,
} from 'lucide-react';
import { CyclePhase } from '../../types/menstrual';
import { soundManager } from '../../utils/audio';
import { triggerHaptic } from '../../utils/haptics';

interface PhaseDetail {
  id: CyclePhase;
  name: string;
  emoji: string;
  color: string;
  badgeBg: string;
  textColor: string;
  borderColor: string;
  dayRange: string;
  tagline: string;
  hormones: string;
  whatHappens: string;
  bodySignals: string[];
  nutrition: string[];
  movement: string[];
  wellnessTips: string[];
}

const PERIOD_DETAIL: PhaseDetail = {
  id: 'period',
  name: 'Menstrual Phase (Period)',
  emoji: '🩸',
  color: 'from-rose-500 to-pink-600',
  badgeBg: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200',
  textColor: 'text-rose-700 dark:text-rose-300',
  borderColor: 'border-rose-200 dark:border-rose-800',
  dayRange: 'Days 1 – 5',
  tagline: 'Restoration, renewal, and gentle replenishment',
  hormones: 'Estrogen and Progesterone are at their lowest baseline levels.',
  whatHappens:
    'The thickened uterine lining (endometrium) sheds because pregnancy did not occur. The uterus gently contracts to expel the tissue, which may cause mild to moderate cramping.',
  bodySignals: [
    'Menstrual bleeding (light, medium, or heavy)',
    'Pelvic cramping or lower back aching',
    'Lower physical energy and desire for inward focus',
    'Increased intuition and reflective mindset',
  ],
  nutrition: [
    'Iron-rich foods: Spinach, lentils, grass-fed beef, beans',
    'Magnesium: Dark chocolate (>70%), pumpkin seeds to ease muscle cramps',
    'Hydration: Warm bone broth, chamomile and ginger herbal teas',
    'Anti-inflammatory: Turmeric, blueberries, omega-3 fatty acids',
  ],
  movement: [
    'Restorative Yin yoga and deep pelvic stretches',
    'Gentle 20-30 min walking in fresh air',
    'Diaphragmatic breathing and guided meditation',
    'Avoid high-intensity workouts on heavy flow days (Days 1–2)',
  ],
  wellnessTips: [
    'Use a warm heating pad across lower abdomen or lumbar region.',
    'Prioritize 8–9 hours of quality sleep to support tissue renewal.',
    'Allow yourself to slow down and postpone non-urgent taxing tasks.',
  ],
};

const PHASE_DETAILS: Record<CyclePhase, PhaseDetail> = {
  period: PERIOD_DETAIL,
  menstrual: { ...PERIOD_DETAIL, id: 'menstrual' },
  follicular: {
    id: 'follicular',
    name: 'Follicular Phase',
    emoji: '💜',
    color: 'from-purple-500 to-indigo-600',
    badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-200',
    textColor: 'text-purple-700 dark:text-purple-300',
    borderColor: 'border-purple-200 dark:border-purple-800',
    dayRange: 'Days 6 – 13',
    tagline: 'Rising energy, sharp mental clarity, and new beginnings',
    hormones: 'FSH (Follicle-Stimulating Hormone) and Estrogen rise steadily.',
    whatHappens:
      'Ovaries prepare ovarian follicles containing maturing eggs. Rising estrogen stimulates the uterine lining to thicken and rebuild rich vascular tissue in anticipation of ovulation.',
    bodySignals: [
      'Increasing physical stamina and alertness',
      'Skin glows with increased collagen and blood flow',
      'Mental sharpness, optimism, and high creative drive',
      'Cervical mucus transitions from dry to creamy / lotion-like',
    ],
    nutrition: [
      'Fermented foods: Kimchi, sauerkraut, kefir for estrogen metabolism',
      'Cruciferous vegetables: Broccoli, Brussels sprouts, kale',
      'Sprouted seeds: Flaxseeds and pumpkin seeds (seed cycling phase 1)',
      'Lean proteins: Chicken, wild salmon, tofu, quinoa',
    ],
    movement: [
      'Strength training and progressive resistance lifting',
      'High-Intensity Interval Training (HIIT) and cardio circuits',
      'Dynamic Vinyasa yoga and cycling classes',
      'Great window to learn new complex athletic choreography',
    ],
    wellnessTips: [
      'Ideal time for strategic planning, brainstorming, and new projects.',
      'Schedule high-stakes presentations or important social meetings.',
      'Your metabolism runs slightly slower; focus on fresh, vibrant meals.',
    ],
  },
  ovulation: {
    id: 'ovulation',
    name: 'Ovulation Window',
    emoji: '⭐',
    color: 'from-amber-500 to-orange-600',
    badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200',
    textColor: 'text-amber-700 dark:text-amber-300',
    borderColor: 'border-amber-200 dark:border-amber-800',
    dayRange: 'Days 14 – 16',
    tagline: 'Peak fertility, charisma, peak confidence, and vitality',
    hormones: 'Luteinizing Hormone (LH) surge triggers egg release; Estrogen peaks.',
    whatHappens:
      'A dominant follicle ruptures, releasing a mature egg into the fallopian tube. The egg remains viable for 12–24 hours. Sperm can survive up to 5 days, making this the peak fertile window.',
    bodySignals: [
      'Egg-white, clear, stretchy cervical mucus (fertile fluid)',
      'Mild one-sided twinge or sensation (Mittelschmerz)',
      'Heightened libido, sensitivity, and verbal confidence',
      'Subtle increase in basal body temperature (~0.3–0.5°C) post-surge',
    ],
    nutrition: [
      'Antioxidant powerhouses: Berries, bell peppers, dark leafy greens',
      'Liver-supporting foods: Artichokes, lemon water, asparagus',
      'Zinc and Vitamin E: Sesame seeds, almonds, sunflower seeds',
      'Light, cooling fiber-rich bowls to support smooth digestion',
    ],
    movement: [
      'Peak strength PRs: Go for personal bests in weight training',
      'Vigorous dance, kickboxing, or sprint workouts',
      'Group fitness classes and high-energy sports',
      'Maintain proper warm-up as joint laxity slightly increases with estrogen',
    ],
    wellnessTips: [
      'Prime communication window for negotiations and deep social bonds.',
      'Track cervical fluid and LH test strips if trying to conceive or avoid pregnancy.',
      'Stay well-hydrated to support optimal electrolyte balance.',
    ],
  },
  luteal: {
    id: 'luteal',
    name: 'Luteal Phase',
    emoji: '🌙',
    color: 'from-indigo-600 to-purple-800',
    badgeBg: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-200',
    textColor: 'text-indigo-700 dark:text-indigo-300',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
    dayRange: 'Days 17 – 28',
    tagline: 'Nesting, detail orientation, and mindful PMS support',
    hormones: 'Progesterone peaks to nurture the uterine lining, then drops if no pregnancy.',
    whatHappens:
      'The empty follicle becomes the corpus luteum, producing progesterone. Body basal temperature stays elevated and resting metabolic rate increases by ~100–300 calories per day.',
    bodySignals: [
      'Appetite increase due to boosted metabolic burn',
      'Possible water retention, mild bloating, or breast tenderness',
      'Desire to organize, declutter, and complete pending tasks',
      'Mild mood shifts or irritability as progesterone drops before next cycle',
    ],
    nutrition: [
      'Complex carbs: Sweet potatoes, brown rice, rolled oats (stabilize serotonin)',
      'Vitamin B6 & Magnesium: Bananas, chickpeas, walnuts, dark leafy greens',
      'Seed cycling phase 2: Sunflower and sesame seeds',
      'Reduce excess sodium and caffeine to minimize fluid retention',
    ],
    movement: [
      'Pilates, bodyweight resistance, and barre conditioning',
      'Steady-state incline walking and moderate swimming',
      'Calming yoga flow focused on lower back and hips',
      'Listen to your body: scale back intensity as day 28 approaches',
    ],
    wellnessTips: [
      'Excellent phase for administrative focus, editing, and decluttering.',
      'Journal your thoughts and practice evening wind-down rituals.',
      'Have healthy snacks on hand to maintain steady blood glucose levels.',
    ],
  },
};

interface MenstrualPhaseInfoModalProps {
  phase?: CyclePhase;
  initialPhase?: CyclePhase;
  onClose: () => void;
}

export const MenstrualPhaseInfoModal: React.FC<MenstrualPhaseInfoModalProps> = ({
  phase: incomingPhase,
  initialPhase = 'follicular',
  onClose,
}) => {
  const [selectedPhase, setSelectedPhase] = useState<CyclePhase>(
    incomingPhase || initialPhase
  );
  const phase = PHASE_DETAILS[selectedPhase] || PHASE_DETAILS.follicular;

  const handleSelectPhase = (p: CyclePhase) => {
    soundManager.playTick();
    triggerHaptic('light');
    setSelectedPhase(p);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="w-full max-w-lg max-h-[90vh] bg-[#FAF8FD] dark:bg-[#15112E] rounded-3xl shadow-2xl border-2 border-purple-200/80 dark:border-[#383068] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 bg-white dark:bg-[#1E1A3D] border-b border-purple-100 dark:border-[#383068] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-xl shadow-md shadow-purple-600/20">
              🌸
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Cycle Phase Science & Guide
              </h3>
              <p className="text-xs text-purple-700 dark:text-purple-300 font-semibold">
                Hormonal biology, nutrition & body synergy
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Phase Selector Tabs */}
        <div className="p-3 bg-purple-50/50 dark:bg-[#15112E] border-b border-purple-100 dark:border-[#383068]">
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: 'period' as CyclePhase, label: 'Period', emoji: '🩸' },
              { id: 'follicular' as CyclePhase, label: 'Follicular', emoji: '💜' },
              { id: 'ovulation' as CyclePhase, label: 'Ovulation', emoji: '⭐' },
              { id: 'luteal' as CyclePhase, label: 'Luteal', emoji: '🌙' },
            ].map((p) => {
              const isCurrent =
                selectedPhase === p.id ||
                (p.id === 'period' && selectedPhase === 'menstrual');
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPhase(p.id)}
                  className={`py-2 px-1 rounded-2xl text-xs font-bold transition-all flex flex-col items-center gap-0.5 cursor-pointer border-2 ${
                    isCurrent
                      ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/20 scale-102 font-black'
                      : 'bg-white dark:bg-[#1E1A3D] text-slate-700 dark:text-slate-300 hover:bg-purple-100/60 dark:hover:bg-[#282154] border-purple-200/80 dark:border-[#383068]'
                  }`}
                >
                  <span className="text-base">{p.emoji}</span>
                  <span className="text-[10px] leading-tight truncate">{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
          {/* Phase Banner */}
          <div
            className={`rounded-3xl bg-gradient-to-r ${phase.color} p-5 text-white shadow-lg space-y-2`}
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-white/20 text-white text-[10px] font-black tracking-wider uppercase backdrop-blur-xs">
                {phase.dayRange}
              </span>
              <span className="text-2xl">{phase.emoji}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black">{phase.name}</h2>
            <p className="text-xs text-white/90 font-medium leading-relaxed">{phase.tagline}</p>
          </div>

          {/* Biological Hormone Dynamics */}
          <div className="bg-white dark:bg-[#1E1A3D] rounded-3xl p-4 border-2 border-purple-200/80 dark:border-[#383068] shadow-md space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Hormonal Landscape
              </h4>
            </div>
            <p className="text-xs text-purple-900 dark:text-purple-300 font-bold bg-purple-50 dark:bg-purple-950/40 p-2.5 rounded-xl border border-purple-100 dark:border-[#383068]">
              {phase.hormones}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {phase.whatHappens}
            </p>
          </div>

          {/* Body Signals */}
          <div className="bg-white dark:bg-[#1E1A3D] rounded-3xl p-4 border-2 border-purple-200/80 dark:border-[#383068] shadow-md space-y-2.5">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Key Body Signals & Symptoms
              </h4>
            </div>
            <div className="space-y-1.5">
              {phase.bodySignals.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nutrition & Fuel */}
          <div className="bg-white dark:bg-[#1E1A3D] rounded-3xl p-4 border-2 border-purple-200/80 dark:border-[#383068] shadow-md space-y-2.5">
            <div className="flex items-center gap-2">
              <Coffee className="w-4 h-4 text-amber-600" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Nutritional Synergy & Foods
              </h4>
            </div>
            <div className="space-y-1.5">
              {phase.nutrition.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Movement & Workouts */}
          <div className="bg-white dark:bg-[#1E1A3D] rounded-3xl p-4 border-2 border-purple-200/80 dark:border-[#383068] shadow-md space-y-2.5">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Optimal Movement & Exercise
              </h4>
            </div>
            <div className="space-y-1.5">
              {phase.movement.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lifestyle Tips */}
          <div className="bg-white dark:bg-[#1E1A3D] rounded-3xl p-4 border-2 border-purple-200/80 dark:border-[#383068] shadow-md space-y-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Mindfulness & Lifestyle Guidance
              </h4>
            </div>
            <div className="space-y-1.5">
              {phase.wellnessTips.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                  <span className="text-purple-500 font-bold">✨</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Bottom Action */}
        <div className="p-4 bg-white dark:bg-[#1E1A3D] border-t border-purple-100 dark:border-[#383068]">
          <button
            type="button"
            onClick={onClose}
            className="w-full group rounded-3xl p-3.5 sm:p-4 bg-white dark:bg-[#1E1A3D] border-2 border-purple-200/80 dark:border-[#383068] shadow-md hover:shadow-lg transition-all flex items-center justify-between cursor-pointer active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-600/30">
                <Check className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="block font-black text-slate-900 dark:text-white text-xs sm:text-sm tracking-wide">
                  GOT IT • BACK TO TRACKER
                </span>
                <span className="block text-[10px] text-purple-600 dark:text-purple-300 font-medium">
                  Close phase guidance and resume cycle tracking
                </span>
              </div>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/50 border border-purple-200 dark:border-purple-700/60 text-purple-700 dark:text-purple-300 font-black text-[10px] uppercase tracking-wider group-hover:bg-purple-600 group-hover:text-white transition-colors">
              Done
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
