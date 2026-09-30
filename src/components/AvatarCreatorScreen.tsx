import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Check, Lock, Sparkles, Coins, RefreshCw } from 'lucide-react';
import { AvatarConfig, GenderType } from '../types';
import { AvatarView } from './AvatarView';
import { soundManager } from '../utils/audio';

interface AvatarCreatorScreenProps {
  currentAvatar: AvatarConfig;
  userCoins: number;
  unlockedItems: string[];
  onSave: (avatar: AvatarConfig, remainingCoins: number, newUnlockedItems: string[]) => void;
  onBack: () => void;
}

const SKIN_TONES = [
  { id: 'skin_1', label: 'Fair Glow', value: '#FFE0BD', free: true },
  { id: 'skin_2', label: 'Peach Cream', value: '#F5D0A9', free: true },
  { id: 'skin_3', label: 'Sun Honey', value: '#E8B98A', free: true },
  { id: 'skin_4', label: 'Golden Bronze', value: '#D0925B', cost: 1 },
  { id: 'skin_5', label: 'Warm Chestnut', value: '#8D5524', cost: 1 },
  { id: 'skin_6', label: 'Deep Espresso', value: '#503319', cost: 1 },
];

const HAIR_STYLES = [
  { id: 'short', label: 'Natural Short', free: true },
  { id: 'long', label: 'Flowing Locks', free: true },
  { id: 'curly', label: 'Voluminous Curly', cost: 2 },
  { id: 'ponytail', label: 'Active Ponytail', cost: 1 },
  { id: 'bun', label: 'Zen Topknot', cost: 2 },
];

const HAIR_COLORS = [
  { id: 'hair_black', label: 'Obsidian Black', value: '#1A1A1A', free: true },
  { id: 'hair_brown', label: 'Chocolate Brown', value: '#3D2314', free: true },
  { id: 'hair_blonde', label: 'Golden Honey', value: '#E6BE8A', cost: 1 },
  { id: 'hair_auburn', label: 'Auburn Sunset', value: '#9A3324', cost: 1 },
  { id: 'hair_purple', label: 'Master Lavender', value: '#7C3AED', cost: 2 },
  { id: 'hair_silver', label: 'Starlight Silver', value: '#94A3B8', cost: 2 },
];

const CLOTHES_COLORS = [
  { id: 'c_sky', label: 'Sky Azure', value: '#38BDF8', free: true },
  { id: 'c_purple', label: 'Blessikaa Purple', value: '#8B5CF6', free: true },
  { id: 'c_emerald', label: 'Zen Emerald', value: '#10B981', cost: 1 },
  { id: 'c_coral', label: 'Warm Coral', value: '#F43F5E', cost: 1 },
  { id: 'c_amber', label: 'Golden Amber', value: '#F59E0B', cost: 1 },
  { id: 'c_midnight', label: 'Midnight Navy', value: '#1E293B', cost: 1 },
];

const ACCESSORIES = [
  { id: 'none', label: 'None', free: true },
  { id: 'glasses', label: 'Scholar Glasses', cost: 2 },
  { id: 'headband', label: 'Yoga Headband', cost: 1 },
  { id: 'cap', label: 'Sporty Cap', cost: 2 },
];

const FACIAL_HAIR = [
  { id: 'none', label: 'Clean Shaven', free: true },
  { id: 'mustache', label: 'Groomed Mustache', cost: 1 },
  { id: 'beard', label: 'Full Stubble Beard', cost: 2 },
];

export const AvatarCreatorScreen: React.FC<AvatarCreatorScreenProps> = ({
  currentAvatar,
  userCoins,
  unlockedItems,
  onSave,
  onBack,
}) => {
  const [avatar, setAvatar] = useState<AvatarConfig>({ ...currentAvatar });
  const [coins, setCoins] = useState<number>(userCoins);
  const [unlocked, setUnlocked] = useState<string[]>([...unlockedItems]);
  const [activeTab, setActiveTab] = useState<'hair' | 'skin' | 'clothes' | 'face' | 'accessories'>('hair');
  const [notification, setNotification] = useState<string | null>(null);

  const handleSelectItem = (category: keyof AvatarConfig, itemId: string, cost?: number, value?: string) => {
    soundManager.playTick();
    const isUnlocked = !cost || unlocked.includes(itemId);

    if (!isUnlocked && cost) {
      if (coins < cost) {
        setNotification(`Not enough coins! Need ${cost} 🪙 to unlock.`);
        setTimeout(() => setNotification(null), 2500);
        return;
      }
      // Purchase item
      const remaining = coins - cost;
      const newUnlocked = [...unlocked, itemId];
      setCoins(remaining);
      setUnlocked(newUnlocked);
      soundManager.playStreakChime();
      setNotification(`Unlocked for ${cost} 🪙!`);
      setTimeout(() => setNotification(null), 2000);
    }

    setAvatar((prev) => ({
      ...prev,
      [category]: value || itemId,
    }));
  };

  const handleRandomize = () => {
    soundManager.playTick();
    const randomSkin = SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)].value;
    const randomHair = HAIR_STYLES[Math.floor(Math.random() * HAIR_STYLES.length)].id;
    const randomHairColor = HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)].value;
    const randomClothesColor = CLOTHES_COLORS[Math.floor(Math.random() * CLOTHES_COLORS.length)].value;
    setAvatar((prev) => ({
      ...prev,
      skinColor: randomSkin,
      hairStyle: randomHair,
      hairColor: randomHairColor,
      clothesColor: randomClothesColor,
    }));
  };

  const handleSave = () => {
    soundManager.playSuccess();
    onSave(avatar, coins, unlocked);
    onBack();
  };

  return (
    <div className="w-full max-w-xl mx-auto py-2 px-3 sm:px-4 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onBack}
          className="p-2.5 rounded-2xl bg-white dark:bg-[#1E1A3D] text-[#6C3FE8] dark:text-[#C4B5FD] border border-[#E9E1FC] dark:border-[#352F63] hover:bg-[#F6F2FF] transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-lg sm:text-xl font-bold text-[#17142B] dark:text-white">
          Avatar Creator
        </h1>

        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF9E6] dark:bg-[#2A2412] text-amber-600 dark:text-amber-300 rounded-2xl text-xs font-bold border border-amber-200 dark:border-amber-800/50 shadow-xs">
          <Coins className="w-4 h-4 text-amber-500" />
          <span>{coins}</span>
        </div>
      </div>

      {/* Center Avatar Preview Display */}
      <div className="bg-gradient-to-b from-[#FAF7FF] to-white dark:from-[#201C40] dark:to-[#171430] border-2 border-[#E9E1FC] dark:border-[#352F63] rounded-3xl p-6 text-center relative shadow-md mb-5 overflow-hidden">
        {notification && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-[#6C3FE8] text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg z-20 animate-bounce">
            {notification}
          </div>
        )}

        <div className="relative inline-block my-2">
          <div className="p-2 border-3 border-dashed border-[#8F67F5]/50 rounded-full">
            <AvatarView config={avatar} size={110} />
          </div>
        </div>

        <p className="text-xs text-[#7A7398] dark:text-[#A8A0C7] mt-1 font-medium">
          {avatar.gender} Avatar • Active Style
        </p>

        {/* Quick Gender switch & randomize */}
        <div className="flex items-center justify-center gap-2 mt-3">
          {(['Female', 'Male', 'Other'] as GenderType[]).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setAvatar((prev) => ({ ...prev, gender: g }))}
              className={`px-3 py-1 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                avatar.gender === g
                  ? 'bg-[#6C3FE8] text-white shadow-xs'
                  : 'bg-[#EDE7F6] dark:bg-[#2E2858] text-[#554E75] dark:text-[#C5BEDE]'
              }`}
            >
              {g}
            </button>
          ))}
          <button
            type="button"
            onClick={handleRandomize}
            className="p-1.5 text-xs bg-[#EDE7F6] dark:bg-[#2E2858] text-[#6C3FE8] dark:text-[#C4B5FD] rounded-xl hover:bg-[#E2D8FA] transition-all cursor-pointer ml-1"
            title="Randomize style"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {[
          { id: 'hair', label: 'Hair & Color' },
          { id: 'skin', label: 'Skin Tone' },
          { id: 'clothes', label: 'Outfits' },
          { id: 'face', label: 'Facial Details' },
          { id: 'accessories', label: 'Accessories' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#6C3FE8] text-white shadow-md shadow-[#6C3FE8]/25'
                : 'bg-white dark:bg-[#1E1A3D] text-[#574F77] dark:text-[#C2BAE0] border border-[#E9E1FC] dark:border-[#352F63]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Options Content */}
      <div className="bg-white dark:bg-[#1E1A3D] border border-[#E9E1FC] dark:border-[#352F63] rounded-3xl p-4 sm:p-5 shadow-xs mb-6 min-h-[220px]">
        {activeTab === 'hair' && (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-[#6C3FE8] dark:text-[#A78BFA] uppercase tracking-wider mb-2">
                Hair Style
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {HAIR_STYLES.map((style) => {
                  const isSelected = avatar.hairStyle === style.id;
                  const isUnlocked = style.free || unlocked.includes(style.id);
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => handleSelectItem('hairStyle', style.id, style.cost)}
                      className={`p-3 rounded-2xl border-2 text-left font-medium text-xs flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#6C3FE8] bg-[#F8F4FF] dark:bg-[#2B2357] text-[#6C3FE8] dark:text-white'
                          : 'border-[#EDE7F6] dark:border-[#332D61] text-[#474163] dark:text-[#C5BEDE]'
                      }`}
                    >
                      <span>{style.label}</span>
                      {!isUnlocked ? (
                        <span className="flex items-center gap-0.5 text-[10px] bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded-full font-bold">
                          <Lock className="w-2.5 h-2.5" />
                          <span>{style.cost}🪙</span>
                        </span>
                      ) : isSelected ? (
                        <Check className="w-3.5 h-3.5 text-[#6C3FE8]" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-[#6C3FE8] dark:text-[#A78BFA] uppercase tracking-wider mb-2">
                Hair Color
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {HAIR_COLORS.map((c) => {
                  const isSelected = avatar.hairColor === c.value;
                  const isUnlocked = c.free || unlocked.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectItem('hairColor', c.id, c.cost, c.value)}
                      className={`p-2.5 rounded-2xl border-2 flex flex-col items-center gap-1 cursor-pointer transition-all ${
                        isSelected ? 'border-[#6C3FE8] scale-105 shadow-xs' : 'border-[#EDE7F6] dark:border-[#332D61]'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full border border-black/10" style={{ backgroundColor: c.value }} />
                      <span className="text-[10px] text-[#554E75] dark:text-[#C5BEDE] truncate max-w-full">{c.label.split(' ')[0]}</span>
                      {!isUnlocked && (
                        <span className="text-[9px] text-amber-600 font-bold">{c.cost}🪙</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skin' && (
          <div>
            <p className="text-xs font-bold text-[#6C3FE8] dark:text-[#A78BFA] uppercase tracking-wider mb-2">
              Skin Complexion
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {SKIN_TONES.map((tone) => {
                const isSelected = avatar.skinColor === tone.value;
                const isUnlocked = tone.free || unlocked.includes(tone.id);
                return (
                  <button
                    key={tone.id}
                    type="button"
                    onClick={() => handleSelectItem('skinColor', tone.id, tone.cost, tone.value)}
                    className={`p-3 rounded-2xl border-2 flex items-center gap-2.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#6C3FE8] bg-[#F8F4FF] dark:bg-[#2B2357]'
                        : 'border-[#EDE7F6] dark:border-[#332D61]'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full border border-black/15 shrink-0" style={{ backgroundColor: tone.value }} />
                    <div className="flex-1 text-left">
                      <p className="text-xs font-bold text-[#3B345D] dark:text-[#C8C0E6]">{tone.label}</p>
                      {!isUnlocked ? (
                        <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">{tone.cost} 🪙</p>
                      ) : (
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Unlocked</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'clothes' && (
          <div>
            <p className="text-xs font-bold text-[#6C3FE8] dark:text-[#A78BFA] uppercase tracking-wider mb-2">
              Outfit Color Palette
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {CLOTHES_COLORS.map((c) => {
                const isSelected = avatar.clothesColor === c.value;
                const isUnlocked = c.free || unlocked.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectItem('clothesColor', c.id, c.cost, c.value)}
                    className={`p-3 rounded-2xl border-2 flex items-center gap-2.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#6C3FE8] bg-[#F8F4FF] dark:bg-[#2B2357]'
                        : 'border-[#EDE7F6] dark:border-[#332D61]'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full border border-black/15 shrink-0" style={{ backgroundColor: c.value }} />
                    <div className="flex-1 text-left">
                      <p className="text-xs font-bold text-[#3B345D] dark:text-[#C8C0E6]">{c.label}</p>
                      {!isUnlocked ? (
                        <p className="text-[10px] text-amber-600 font-bold">{c.cost} 🪙</p>
                      ) : (
                        <p className="text-[10px] text-emerald-600 font-semibold">Ready</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'face' && (
          <div>
            <p className="text-xs font-bold text-[#6C3FE8] dark:text-[#A78BFA] uppercase tracking-wider mb-2">
              Facial Hair / Style
            </p>
            <div className="grid grid-cols-3 gap-2">
              {FACIAL_HAIR.map((f) => {
                const isSelected = avatar.facialHair === f.id;
                const isUnlocked = f.free || unlocked.includes(f.id);
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handleSelectItem('facialHair', f.id, f.cost)}
                    className={`p-3 rounded-2xl border-2 text-center font-medium text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#6C3FE8] bg-[#F8F4FF] dark:bg-[#2B2357] text-[#6C3FE8] dark:text-white'
                        : 'border-[#EDE7F6] dark:border-[#332D61] text-[#474163] dark:text-[#C5BEDE]'
                    }`}
                  >
                    <p className="font-bold">{f.label}</p>
                    {!isUnlocked ? (
                      <span className="text-[10px] text-amber-600 font-bold">{f.cost} 🪙</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'accessories' && (
          <div>
            <p className="text-xs font-bold text-[#6C3FE8] dark:text-[#A78BFA] uppercase tracking-wider mb-2">
              Accessories & Headwear
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {ACCESSORIES.map((acc) => {
                const isSelected = avatar.accessory === acc.id;
                const isUnlocked = acc.free || unlocked.includes(acc.id);
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleSelectItem('accessory', acc.id, acc.cost)}
                    className={`p-3 rounded-2xl border-2 text-center cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#6C3FE8] bg-[#F8F4FF] dark:bg-[#2B2357] text-[#6C3FE8] dark:text-white'
                        : 'border-[#EDE7F6] dark:border-[#332D61] text-[#474163] dark:text-[#C5BEDE]'
                    }`}
                  >
                    <p className="text-xs font-bold">{acc.label}</p>
                    {!isUnlocked ? (
                      <span className="text-[10px] text-amber-600 font-bold">{acc.cost} 🪙</span>
                    ) : (
                      <span className="text-[10px] text-emerald-600 font-semibold">Unlocked</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <button
        type="button"
        onClick={handleSave}
        className="w-full py-4 bg-gradient-to-r from-[#6C3FE8] to-[#8F67F5] text-white font-bold text-base rounded-2xl shadow-lg shadow-[#6C3FE8]/30 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] transition-all"
      >
        <Sparkles className="w-5 h-5 text-amber-300" />
        <span>Save Avatar & Look</span>
      </button>
    </div>
  );
};
