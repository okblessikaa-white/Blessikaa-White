import React from 'react';
import { AvatarConfig } from '../types';

interface AvatarViewProps {
  config: AvatarConfig;
  size?: number;
  className?: string;
}

export const AvatarView: React.FC<AvatarViewProps> = ({
  config,
  size = 72,
  className = '',
}) => {
  // Config fallbacks
  const skin = config?.skinColor || '#F5D0A9';
  const hairColor = config?.hairColor || '#3D2314';
  const clothesColor = config?.clothesColor || '#38BDF8';
  const eyeColor = config?.eyeColor || '#2D3748';
  const hairStyle = config?.hairStyle || 'short';
  const gender = config?.gender || 'Female';
  const facialHair = config?.facialHair || 'none';
  const accessory = config?.accessory || 'none';

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 shadow-sm ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: '#F3E8FF',
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Aura */}
        <circle cx="50" cy="50" r="48" fill="#EDE9FE" />

        {/* Neck */}
        <rect x="42" y="60" width="16" height="15" fill={skin} rx="4" />

        {/* Shoulders / Clothes */}
        <path
          d="M 22 100 Q 22 75 50 75 Q 78 75 78 100 Z"
          fill={clothesColor}
        />
        {/* Collar / Detail */}
        <path
          d="M 40 75 Q 50 84 60 75"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          fill="none"
        />

        {/* Ears */}
        <circle cx="28" cy="48" r="6" fill={skin} />
        <circle cx="72" cy="48" r="6" fill={skin} />

        {/* Head / Face */}
        <ellipse cx="50" cy="48" rx="22" ry="24" fill={skin} />

        {/* Eyes */}
        <ellipse cx="41" cy="47" rx="3.5" ry="4" fill={eyeColor} />
        <ellipse cx="59" cy="47" rx="3.5" ry="4" fill={eyeColor} />
        {/* Eye catchlights */}
        <circle cx="42" cy="45.5" r="1.2" fill="#FFFFFF" />
        <circle cx="60" cy="45.5" r="1.2" fill="#FFFFFF" />

        {/* Eyebrows */}
        <path
          d="M 36 41 Q 41 38 46 41"
          stroke={hairColor}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 54 41 Q 59 38 64 41"
          stroke={hairColor}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Nose */}
        <path
          d="M 50 48 Q 52 53 48 54"
          stroke="#D4A373"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Gentle Smile */}
        <path
          d="M 44 58 Q 50 64 56 58"
          stroke="#C85A5A"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Cheeks blush */}
        <ellipse cx="36" cy="53" rx="3.5" ry="2" fill="#F87171" opacity="0.35" />
        <ellipse cx="64" cy="53" rx="3.5" ry="2" fill="#F87171" opacity="0.35" />

        {/* Facial Hair for males */}
        {facialHair === 'beard' && (
          <path
            d="M 35 55 Q 50 74 65 55 Q 60 70 50 72 Q 40 70 35 55 Z"
            fill={hairColor}
            opacity="0.9"
          />
        )}
        {facialHair === 'mustache' && (
          <path
            d="M 42 56 Q 50 54 58 56 Q 50 58 42 56"
            fill={hairColor}
          />
        )}

        {/* Hair Styles */}
        {hairStyle === 'long' && (
          <>
            <path
              d="M 26 42 Q 22 68 28 82 Q 33 60 30 45"
              fill={hairColor}
            />
            <path
              d="M 74 42 Q 78 68 72 82 Q 67 60 70 45"
              fill={hairColor}
            />
            <path
              d="M 28 42 Q 28 22 50 22 Q 72 22 72 42 Q 50 30 28 42 Z"
              fill={hairColor}
            />
          </>
        )}
        {hairStyle === 'short' && (
          <path
            d="M 28 42 Q 27 24 50 24 Q 73 24 72 42 Q 60 28 50 28 Q 40 28 28 42 Z"
            fill={hairColor}
          />
        )}
        {hairStyle === 'curly' && (
          <path
            d="M 25 40 Q 20 20 40 18 Q 50 16 60 18 Q 80 20 75 40 Q 70 28 50 26 Q 30 28 25 40 Z"
            fill={hairColor}
          />
        )}
        {hairStyle === 'ponytail' && (
          <>
            <circle cx="73" cy="30" r="10" fill={hairColor} />
            <path
              d="M 28 42 Q 28 24 50 24 Q 72 24 72 42 Q 50 30 28 42 Z"
              fill={hairColor}
            />
          </>
        )}
        {hairStyle === 'bun' && (
          <>
            <circle cx="50" cy="18" r="9" fill={hairColor} />
            <path
              d="M 28 42 Q 28 24 50 24 Q 72 24 72 42 Q 50 30 28 42 Z"
              fill={hairColor}
            />
          </>
        )}

        {/* Accessories */}
        {accessory === 'glasses' && (
          <g stroke="#1F2937" strokeWidth="2" fill="none">
            <rect x="35" y="42" width="12" height="10" rx="2.5" />
            <rect x="53" y="42" width="12" height="10" rx="2.5" />
            <line x1="47" y1="47" x2="53" y2="47" />
          </g>
        )}
        {accessory === 'headband' && (
          <path
            d="M 27 34 Q 50 28 73 34"
            stroke="#EC4899"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
        )}
        {accessory === 'cap' && (
          <path
            d="M 25 35 Q 50 18 75 35 L 85 38 Q 50 33 25 35 Z"
            fill="#3B82F6"
          />
        )}
      </svg>
    </div>
  );
};
