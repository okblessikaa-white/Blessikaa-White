import { Challenge, DayPlan } from '../types';

export interface CommunityChallengeItem extends Challenge {
  creatorName: string;
  creatorAvatar: string;
  creatorRole: string;
  isVerifiedCreator?: boolean;
  participantCount: number;
  rating: number;
  reviewsCount: number;
  trendingBadge?: string;
  communityLikes: number;
}

const generate21Days = (
  theme: string,
  dailyVerb: string,
  taskTemplates: string[],
  psychologyNotes: string[]
): DayPlan[] => {
  return Array.from({ length: 21 }, (_, i) => {
    const dayNum = i + 1;
    const taskIdx = i % taskTemplates.length;
    const psychIdx = i % psychologyNotes.length;
    return {
      day: dayNum,
      title: `Day ${dayNum}: ${dailyVerb} - Level ${Math.ceil(dayNum / 7)}`,
      description: `Daily disciplined step to master ${theme}.`,
      tasks: [
        taskTemplates[taskIdx],
        dayNum % 3 === 0 ? 'Reflect in journal for 3 minutes on your momentum' : 'Take 3 deep grounding breaths before starting',
      ],
      tip: psychologyNotes[psychIdx],
      estimatedMinutes: 10 + (dayNum % 10),
      suggestedTimerMinutes: 10,
    };
  });
};

export const INITIAL_COMMUNITY_CHALLENGES: CommunityChallengeItem[] = [
  {
    id: 'comm_1',
    title: 'Dopamine Reset & Digital Detox',
    description: 'Reclaim your attention span, eliminate doomscrolling, and restore deep focus through scientific sensory fasting.',
    category: 'mental_health',
    intensity: 'medium',
    iconName: '🧠',
    tags: ['Mindset', 'Focus', 'Detox'],
    creatorName: 'Dr. Elena Rostova',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    creatorRole: 'Neuroscience Researcher',
    isVerifiedCreator: true,
    participantCount: 4280,
    rating: 4.95,
    reviewsCount: 312,
    trendingBadge: '🔥 #1 Trending',
    communityLikes: 890,
    createdAt: '2026-01-15T08:00:00.000Z',
    milestone7: 'Digital Awareness & Screen Limits',
    milestone14: 'Deep Boredom Tolerance Rebuilt',
    milestone21: 'Restored Neurochemical Balance',
    days: generate21Days(
      'Dopamine Detox',
      'Cognitive Fasting',
      [
        'No phone usage for the first 45 minutes after waking up.',
        'Convert screen to Grayscale mode for the entire workday.',
        'Delete or time-lock 2 most addictive social applications.',
        'Take a 30-minute tech-free walk with zero headphones or podcasts.',
        'Eat one meal in complete silence without screens or media.',
        'Replace evening screen time with 15 pages of physical book reading.',
        'Do a 20-minute boredom sitting meditation: observe thoughts without reacting.',
      ],
      [
        'Dopamine receptors upregulate when artificial hyper-stimulation is withheld for consecutive days.',
        'Replacing high-dopamine cues with low-friction calming habits builds deep neural plasticity.',
        'The urge to check notifications fades significantly after 7 consecutive days of friction.',
      ]
    ),
  },
  {
    id: 'comm_2',
    title: 'Cold Shower & High-Vibe Morning',
    description: 'Boost noradrenaline, elevate metabolic alertness, and conquer mental resistance with progressive cold hydrotherapy.',
    category: 'health',
    intensity: 'intense',
    iconName: '🚿',
    tags: ['Energy', 'Willpower', 'Physical'],
    creatorName: 'Marcus Vance',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    creatorRole: 'Somatic Breath & Habit Coach',
    isVerifiedCreator: true,
    participantCount: 3150,
    rating: 4.88,
    reviewsCount: 245,
    trendingBadge: '⚡ High Energy',
    communityLikes: 740,
    createdAt: '2026-02-01T08:00:00.000Z',
    milestone7: '30-Second Cold Shock Mastery',
    milestone14: '90-Second Calm Breath under Cold',
    milestone21: 'Unshakeable Morning Willpower',
    days: generate21Days(
      'Cold Thermogenesis',
      'Cold Exposure',
      [
        'Finish your normal shower with 30 seconds of pure cold water on chest and neck.',
        'Practice 4-4-4 box breathing before entering the cold spray.',
        'Extend cold finish to 45 seconds while maintaining steady diaphragmatic exhales.',
        'Splash face with ice cold water immediately upon waking.',
        '60-second full cold shower finish without flinching or gasping.',
        '75-second cold blast followed by 10 air squats.',
        'Full 2-minute cold shower finish with calm internal affirmations.',
      ],
      [
        'Cold shock triggers a sustained 250% increase in baseline dopamine and noradrenaline for hours.',
        'Overcoming physical discomfort first thing in the morning reduces anxiety towards daily stressors.',
        'Consistent thermal conditioning strengthens mitochondrial density and immune resilience.',
      ]
    ),
  },
  {
    id: 'comm_3',
    title: 'Deep Work 90-Min Focus Blocks',
    description: 'Eliminate task switching, enter effortless flow states, and accomplish high-value creative and professional milestones.',
    category: 'productivity',
    intensity: 'medium',
    iconName: '🎯',
    tags: ['Focus', 'Career', 'Productivity'],
    creatorName: 'Maya Chen',
    creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    creatorRole: 'Productivity Architect',
    isVerifiedCreator: true,
    participantCount: 5200,
    rating: 4.97,
    reviewsCount: 460,
    trendingBadge: '🏆 Community Choice',
    communityLikes: 1120,
    createdAt: '2026-01-10T08:00:00.000Z',
    milestone7: 'Single-Tasking Environmental Setup',
    milestone14: '60-Minute Uninterrupted Focus',
    milestone21: 'Autonomous 90-Minute Flow Architecture',
    days: generate21Days(
      'Deep Work',
      'Flow Activation',
      [
        'Select 1 high-impact project task and work on it for 45 minutes with zero open browser tabs.',
        'Set phone in Do-Not-Disturb and place it in another room during morning work.',
        'Complete two 45-minute focused work sprints separated by a 5-minute stretch.',
        'Identify and eliminate your top 3 work interruptions.',
        'Achieve a continuous 60-minute deep work block on your most challenging task.',
        'Practice the Pomodoro 50/10 rhythm for the first 3 hours of your day.',
        'Complete the full 90-minute unbroken deep flow session before noon.',
      ],
      [
        'Attention residue from switching tabs degrades cognitive output by up to 40%.',
        'Pre-committing your single focus item the night before eliminates morning decision fatigue.',
        'Deep flow triggers theta-alpha brainwave states that multiply creative throughput.',
      ]
    ),
  },
  {
    id: 'comm_4',
    title: '10,000 Daily Steps & Sunshine',
    description: 'Transform your daily metabolic baseline, enhance joint health, and reset circadian rhythm with daily outdoor walking.',
    category: 'fitness',
    intensity: 'gentle',
    iconName: '🚶',
    tags: ['Fitness', 'Longevity', 'Nature'],
    creatorName: 'Liam O’Connor',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    creatorRole: 'Holistic Movement Trainer',
    isVerifiedCreator: true,
    participantCount: 6400,
    rating: 4.92,
    reviewsCount: 510,
    trendingBadge: '🌿 High Longevity',
    communityLikes: 980,
    createdAt: '2026-01-20T08:00:00.000Z',
    milestone7: '7,500 Steps Baseline',
    milestone14: 'Consistent 10,000 Steps Daily',
    milestone21: 'Habitual Active Mobility Lifestyle',
    days: generate21Days(
      'Daily Walking',
      'Active Steps',
      [
        'Take a 15-minute walk outside within 1 hour of sunrise to capture optic flow.',
        'Park further away or walk one bus stop earlier to bank 2,000 extra steps.',
        'Conduct one phone meeting or brainstorming session while walking.',
        'Hit 8,000 total steps before sunset.',
        'Take a post-dinner 15-minute walk to optimize blood glucose regulation.',
        'Walk 10,000 steps with at least 20 minutes in a natural park or green trail.',
        'Celebrate day 21 with a scenic 12,000-step exploration walk.',
      ],
      [
        'Morning sunlight on retinas locks the master circadian clock for deeper sleep tonight.',
        'Low-intensity steady state movement (NEAT) accounts for the largest fraction of daily fat burn.',
        'Bilateral optic flow while walking soothes the amygdala and down-regulates cortisol.',
      ]
    ),
  },
  {
    id: 'comm_5',
    title: 'Micro-Journaling & Evening Reflection',
    description: 'Clear mental clutter, celebrate micro-wins, and end every day with calm gratitude using 3-minute prompts.',
    category: 'self_love',
    intensity: 'gentle',
    iconName: '📖',
    tags: ['Gratitude', 'Journal', 'Peace'],
    creatorName: 'Chloe Dubois',
    creatorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    creatorRole: 'Author & Mindful Guide',
    isVerifiedCreator: true,
    participantCount: 4800,
    rating: 4.99,
    reviewsCount: 380,
    trendingBadge: '✨ Best for Calm',
    communityLikes: 1350,
    createdAt: '2026-02-05T08:00:00.000Z',
    milestone7: 'Daily 3-Minute Evening Pen Ritual',
    milestone14: 'Reframing Daily Friction into Wisdom',
    milestone21: 'Deep Self-Understanding & Peace',
    days: generate21Days(
      'Micro-Journaling',
      'Reflective Writing',
      [
        'Write down 3 small wins from today, no matter how tiny.',
        'Write 1 sentence answering: "What gave me genuine peace today?"',
        'Identify 1 negative thought from today and write a compassionate reframe.',
        'List 3 people who made your life easier this week and why.',
        'Write down your top priority for tomorrow to empty your working memory.',
        'Describe a challenge you faced today and what strength you used to navigate it.',
        'Write a short letter of appreciation to your future self on completing 21 days.',
      ],
      [
        'Writing down thoughts externalizes cognitive load and stops late-night rumination.',
        'Actively searching for daily micro-wins re-tunes the brain’s reticular activating system.',
        'Self-compassionate journaling significantly reduces evening cortisol levels.',
      ]
    ),
  },
  {
    id: 'comm_6',
    title: 'Financial Fast & Intentional Spending',
    description: 'Stop impulsive micro-purchases, review subscription leaks, and build conscious money habits for 21 days.',
    category: 'lifestyle',
    intensity: 'medium',
    iconName: '💰',
    tags: ['Money', 'Mindfulness', 'Savings'],
    creatorName: 'David Kim',
    creatorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    creatorRole: 'Wealth & Minimalist Strategist',
    isVerifiedCreator: true,
    participantCount: 2900,
    rating: 4.86,
    reviewsCount: 190,
    trendingBadge: '💎 Smart Money',
    communityLikes: 610,
    createdAt: '2026-01-28T08:00:00.000Z',
    milestone7: 'No Non-Essential Purchases Week',
    milestone14: 'Subscription & Recurring Waste Audit',
    milestone21: 'Conscious Money Autopilot',
    days: generate21Days(
      'Financial Fast',
      'Money Discipline',
      [
        'Declare today a Zero-Discretionary-Spend day (only groceries and essentials).',
        'Audit bank statements from last month and cancel 1 unused subscription.',
        'Cook all meals at home today and tally the money saved.',
        'Implement the 72-Hour Rule: add any desired purchase to a wishlist instead of buying.',
        'Pack your own coffee, water, and lunch for the day.',
        'Sell or donate 3 items in your home that you haven’t used in 6 months.',
        'Calculate your total 21-day savings and allocate it directly to your emergency fund.',
      ],
      [
        'Friction between desire and purchase resets hedonic adaptation.',
        'Tracking micro-spending brings hidden subconscious habits into conscious awareness.',
        'Financial clarity creates psychological calmness and reduced chronic baseline stress.',
      ]
    ),
  },
];
