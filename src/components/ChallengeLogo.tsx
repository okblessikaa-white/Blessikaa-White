import React from 'react';
import {
  Sprout,
  Compass,
  RefreshCw,
  Heart,
  ShieldCheck,
  Award,
  Zap,
  HeartHandshake,
  BookOpen,
  Target,
  Flower2,
  Footprints,
  Apple,
  Sparkles,
  Activity,
  HeartPulse,
  UserCheck,
  Dumbbell,
  Moon,
  Ban,
  GraduationCap,
  Languages,
  UtensilsCrossed,
  Brain,
  Lightbulb,
  Palette,
  Smartphone,
  Clock,
  Camera,
  Sun,
  MoonStar,
  Coffee,
  TreePine,
  Trees,
  Ghost,
  Timer,
  Box,
  CalendarCheck,
  Calendar,
  CheckSquare,
  Minimize2,
  TrendingUp,
  Flag,
  Feather,
  SmilePlus,
  MessageCircle,
  MessageSquare,
  MessagesSquare,
  Users,
  Share2,
  DoorOpen,
  Mail,
  Star,
  Gift,
  Mountain,
  Plane,
  MapPin,
  Car,
  Smile,
  LucideIcon,
} from 'lucide-react';

export interface ChallengeLogoProps {
  challengeId?: string;
  challengeTitle?: string;
  category?: string;
  iconName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// Complete mapping of all 69+ challenges to Lucide icons (Purple thematic icons, NO pictures/emojis)
export const CHALLENGE_ICON_MAP: Record<string, LucideIcon> = {
  // 1. PERSONAL GROWTH
  'Self-growth': Sprout,
  'Self discovery': Compass,
  'Swap bad habits for good ones': RefreshCw,
  'Gratitude part 2': Heart,
  'Confidence': ShieldCheck,
  'Empowerment challenge': Award,
  'Get out of your comfort zone': Zap,
  'Kindness': HeartHandshake,
  'Daily Journaling': BookOpen,
  'Intentional Living': Target,

  // 2. HEALTH
  'Yoga': Flower2,
  'Walking': Footprints,
  'Healthy Snacking': Apple,
  'Stress Relief': Sparkles,
  'Stretching challenge': Activity,
  'Healthier You': HeartPulse,
  'Improve Posture': UserCheck,
  'Home workout': Dumbbell,
  'Fix your sleep schedule': Moon,
  'No Junk Food': Ban,

  // 3. LEARNING
  'Study': GraduationCap,
  'Language': Languages,
  'Cooking': UtensilsCrossed,
  'Brain Upgrade': Brain,
  'Life Hacks': Lightbulb,
  'Creativity': Palette,
  'Digital Declutter': Smartphone,
  'Productivity': Clock,
  'Capture the Season': Camera,
  'Self care': Sparkles,

  // 4. LIFESTYLE
  'Morning Routine': Sun,
  'Night Routine': MoonStar,
  'Fall Recipes': Coffee,
  'Fall cozy activities': TreePine,
  'Beauty Tips': Sparkles,
  'Doable Summer Challenge': Sun,
  'Make the most of your summer/holidays': Compass,
  'Spring Cleaning & Reset': Sparkles,
  'Spooky Season': Ghost,
  'Cozy Season': Coffee,

  // 5. PRODUCTIVITY
  'Focus Booster': Target,
  'Time Management': Timer,
  'Declutter': Box,
  'Study Plan': CalendarCheck,
  'Daily Planner': Calendar,
  'Organize Your Day': CheckSquare,
  'Minimalism': Minimize2,
  'Habit Tracker': TrendingUp,
  'Goal Setting': Flag,

  // 6. MENTAL HEALTH
  'Meditation': Brain,
  'Mindfulness challenge': Feather,
  'Mental wellness': Heart,
  'Social Anxiety': ShieldCheck,
  'Feel good': SmilePlus,
  'Find Inner Peace': Sun,
  'Social Anxiety Affirmations': MessageCircle,
  'Positive Affirmations part 2': MessageSquare,
  'Positive Mindset': Sparkles,
  'Optimism Challenge': Sun,

  // 7. RELATIONSHIPS
  'Meaningful Conversations': MessagesSquare,
  'Solo Dates': Coffee,
  'Family Time': Users,
  'Quality Time': Heart,
  'Date-night ideas': Heart,
  'Couples edition': HeartHandshake,
  'Social Connection': Share2,
  'Escape Loneliness': DoorOpen,
  'Communication Challenge': Mail,
  'Forgiveness Challenge': Heart,

  // 8. SELF LOVE
  'Self Love': Heart,
  'Pamper yourself': Sparkles,
  'Self Confidence': Star,
  'Body Positivity': HeartPulse,
  'You Time': Coffee,
  'Treat Yourself': Gift,
  'Mirror Talk': Sparkles,
  'Gratitude Practice': Heart,
  'Love Yourself Challenge': Heart,

  // 9. POSITIVITY
  'Positive affirmations': Sparkles,
  'Gratitude': Heart,
  'Kindness Challenge': HeartHandshake,
  'Joy Challenge': Smile,
  'Happy Mindset': SmilePlus,
  'Thankfulness': Heart,
  'Positive Vibes': Sparkles,
  'Be Present': Compass,
  'Appreciation Challenge': Heart,
  'Gratitude Jar': Gift,

  // 10. ADVENTURE
  'Adventurous Spirit': Compass,
  'Hiking Challenge': Mountain,
  'Travel More': Plane,
  'Explore Nature': Trees,
  'Try Something New': Sparkles,
  'Step Out Challenge': Footprints,
  'Weekend Adventure': Compass,
  'Mini Adventure': MapPin,
  'Bucket List': CheckSquare,
  'Road Trip Challenge': Car,
};

export const getChallengeLucideIcon = (title: string = '', category?: string): LucideIcon => {
  const cleanTitle = title.replace(/^21-Day\s+/i, '').trim();

  if (CHALLENGE_ICON_MAP[cleanTitle]) {
    return CHALLENGE_ICON_MAP[cleanTitle];
  }

  const foundKey = Object.keys(CHALLENGE_ICON_MAP).find((k) =>
    cleanTitle.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(cleanTitle.toLowerCase())
  );
  if (foundKey) {
    return CHALLENGE_ICON_MAP[foundKey];
  }

  // Fallback by category
  switch (category) {
    case 'health':
    case 'fitness':
      return Activity;
    case 'learning':
      return GraduationCap;
    case 'lifestyle':
      return Sun;
    case 'productivity':
      return Clock;
    case 'mental_health':
    case 'mental-health':
      return Brain;
    case 'relationships':
      return Users;
    case 'self_love':
    case 'self-love':
      return Heart;
    case 'positivity':
      return Sparkles;
    case 'adventure':
      return Mountain;
    case 'finance':
      return TrendingUp;
    default:
      return Sprout;
  }
};

export const getChallengeLogo = (title: string = '', category?: string) => {
  const Icon = getChallengeLucideIcon(title, category);
  return {
    icon: Icon,
    emoji: '',
    bg: 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white',
    border: 'border-purple-300',
  };
};

export const ChallengeLogo: React.FC<ChallengeLogoProps> = ({
  challengeTitle = '',
  category,
  size = 'md',
  className = '',
}) => {
  const Icon = getChallengeLucideIcon(challengeTitle, category);

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-10 h-10 rounded-2xl',
    lg: 'w-12 h-12 rounded-2xl',
    xl: 'w-14 h-14 rounded-2xl',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  };

  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/20 shrink-0 ${sizeClasses[size]} ${className}`}
    >
      <Icon className={`${iconSizes[size]} text-white`} />
    </div>
  );
};
