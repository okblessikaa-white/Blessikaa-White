import React from 'react';
import {
  Flower2,
  Stethoscope,
  Smile,
  Pill,
  Brain,
  Apple,
  Activity,
  Eye,
  Microscope,
  Coins,
  Building2,
  TrendingUp,
  Bitcoin,
  Receipt,
  ShieldCheck,
  Home,
  Wallet,
  CreditCard,
  Hourglass,
  Briefcase,
  Scale,
  Users,
  Megaphone,
  BadgePercent,
  ShoppingCart,
  GraduationCap,
  Truck,
  Code,
  Sparkles,
  Lock,
  Cloud,
  BarChart3,
  Wifi,
  Plane,
  Hotel,
  UtensilsCrossed,
  Car,
  Calendar,
  Shirt,
  Armchair,
  ShoppingBag,
  BookOpen,
  Compass,
  Languages,
  Library,
  Lightbulb,
  Atom,
  Zap,
  Feather,
  Landmark,
  FileText,
  PawPrint,
  HeartHandshake,
  Globe,
  AlertTriangle,
  Leaf,
  Camera,
  Video,
  Music,
  PenTool,
  Palette,
  Dumbbell,
  Gamepad2,
  Scissors,
  Sprout,
  Baby,
  Repeat,
  Flame,
  Layers,
  LucideIcon,
} from 'lucide-react';

export const SERVICE_ICON_MAP: Record<string, LucideIcon> = {
  // Health & Medical
  menstrual_cycle: Flower2,
  medical: Stethoscope,
  dental: Smile,
  pharmacy: Pill,
  mental_health: Brain,
  nutrition: Apple,
  physio: Activity,
  optometry: Eye,
  diagnostics: Microscope,
  fitness: Flame,

  // Wealth & Finance
  finance: Coins,
  banking: Building2,
  investment: TrendingUp,
  crypto: Bitcoin,
  tax: Receipt,
  insurance: ShieldCheck,
  realestate: Home,
  wealth_mgmt: Wallet,
  loans: CreditCard,
  pension: Hourglass,
  subscriptions: Repeat,

  // Enterprise & Career
  business: Briefcase,
  legal: Scale,
  hr: Users,
  marketing: Megaphone,
  sales: BadgePercent,
  procurement: ShoppingCart,
  career: GraduationCap,
  logistics: Truck,

  // Technology & AI
  software: Code,
  ai_suite: Sparkles,
  cybersecurity: Lock,
  cloud: Cloud,
  data_analytics: BarChart3,
  iot: Wifi,

  // Lifestyle & Travel
  travel: Plane,
  hospitality: Hotel,
  dining: UtensilsCrossed,
  automotive: Car,
  events: Calendar,
  fashion: Shirt,
  interior: Armchair,
  retail: ShoppingBag,
  gardening: Sprout,

  // Education & Mastery
  education: BookOpen,
  challenges: Compass,
  languages: Languages,
  books: Library,
  philosophy: Lightbulb,
  science: Atom,
  skills: Zap,
  meditation: Feather,

  // Civic & Family
  government: Landmark,
  documents: FileText,
  family: Users,
  parenting: Baby,
  pets: PawPrint,
  seniors: HeartHandshake,
  community: Globe,
  emergency: AlertTriangle,
  environment: Leaf,

  // Creative & Media
  photography: Camera,
  video: Video,
  music: Music,
  writing: PenTool,
  graphic_design: Palette,
  sports: Dumbbell,
  gaming: Gamepad2,
  crafts: Scissors,
};

export const getServiceLucideIcon = (serviceId: string, category?: string): LucideIcon => {
  if (SERVICE_ICON_MAP[serviceId]) {
    return SERVICE_ICON_MAP[serviceId];
  }

  // Category fallback
  switch (category) {
    case 'Health & Wellness':
      return HeartPulseFallback;
    case 'Wealth & Finance':
      return Coins;
    case 'Enterprise & Career':
      return Briefcase;
    case 'Technology & AI':
      return Code;
    case 'Lifestyle & Travel':
      return Plane;
    case 'Education & Mastery':
      return BookOpen;
    case 'Civic & Family':
      return Users;
    case 'Creative & Media':
      return Palette;
    default:
      return Layers;
  }
};

const HeartPulseFallback = Activity;

interface ServiceIconProps {
  serviceId: string;
  category?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ServiceIcon: React.FC<ServiceIconProps> = ({
  serviceId,
  category,
  size = 'xl',
  className = '',
}) => {
  const Icon = getServiceLucideIcon(serviceId, category);

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
      className={`bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20 group-hover:scale-110 transition-transform shrink-0 ${sizeClasses[size]} ${className}`}
    >
      <Icon className={`${iconSizes[size]} text-white`} />
    </div>
  );
};
