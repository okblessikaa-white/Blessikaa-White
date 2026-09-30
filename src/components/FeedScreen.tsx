import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Send,
  Sparkles,
  Flame,
  CheckCircle2,
  Award,
  MoreVertical,
  Plus,
  Smile,
  ShieldAlert,
  X,
  Filter,
} from 'lucide-react';
import { CommunityPost, CommunityComment } from '../types';
import { soundManager } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface FeedScreenProps {
  userName: string;
  activeChallengeTitle?: string;
  currentDay?: number;
  streakCount: number;
}

export const FeedScreen: React.FC<FeedScreenProps> = ({
  userName,
  activeChallengeTitle,
  currentDay = 1,
  streakCount = 1,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [newPostTag, setNewPostTag] = useState('Celebration');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Community Posts local state
  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    try {
      const saved = localStorage.getItem('blessikaa_community_posts');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'post_1',
        authorName: 'Aria Chen',
        authorAvatar: '🌸',
        authorBadge: '21-Day Master',
        timestamp: '15m ago',
        challengeTitle: '21-Day Dopamine Reset & Deep Focus',
        challengeDay: 14,
        content:
          'Just hit Day 14! The screen time reduction went from feeling like torture to pure psychological peace. My morning coffee without scrolling is now the highlight of my day. Keep going everyone! ✨🙏',
        likesCount: 28,
        isLiked: false,
        commentsCount: 4,
        tag: 'Milestone',
        isPinned: true,
        comments: [
          {
            id: 'c1',
            authorName: 'David K.',
            authorAvatar: '⚡',
            timestamp: '10m ago',
            text: 'Huge congratulations Aria! Morning phone-free was a game changer for me too.',
            likesCount: 3,
          },
          {
            id: 'c2',
            authorName: 'Elena Rostova',
            authorAvatar: '🦋',
            timestamp: '5m ago',
            text: 'Day 14 milestone is huge! You got this!',
            likesCount: 1,
          },
        ],
      },
      {
        id: 'post_2',
        authorName: 'Marcus Vance',
        authorAvatar: '🦁',
        authorBadge: 'Streak Legend (18d)',
        timestamp: '1h ago',
        challengeTitle: '21-Day 10,000 Daily Steps & Mobility',
        challengeDay: 8,
        content:
          'Taking walking meetings during work calls has literally unlocked an effortless 11,500 steps today. Blood pressure down, brain fog zero. Blessikaa matrix tracking keeps me hyper-accountable! 👟🔥',
        likesCount: 19,
        isLiked: true,
        commentsCount: 2,
        tag: 'Transformation',
        comments: [
          {
            id: 'c3',
            authorName: 'Sarah Jenkins',
            authorAvatar: '🌿',
            timestamp: '35m ago',
            text: 'I started doing phone walks too! Best productivity hack ever.',
            likesCount: 2,
          },
        ],
      },
      {
        id: 'post_3',
        authorName: 'Zoe Thorne',
        authorAvatar: '🧘',
        authorBadge: 'Zen Seeker',
        timestamp: '3h ago',
        challengeTitle: '21-Day Happiness & Joy Generator',
        challengeDay: 21,
        content:
          '🎉 DAY 21 COMPLETE! I officially finished the Happiness & Joy Generator challenge! My baseline optimism has genuinely transformed. Generated my completion certificate and feeling so blessed. Starting Gratitude Alchemy tomorrow!',
        likesCount: 64,
        isLiked: false,
        commentsCount: 9,
        tag: 'Celebration',
        comments: [],
      },
      {
        id: 'post_4',
        authorName: 'Liam O’Connor',
        authorAvatar: '🛡️',
        authorBadge: 'Stoic Warrior',
        timestamp: '5h ago',
        challengeTitle: '21-Day Stoic Mental Toughness',
        challengeDay: 5,
        content:
          'Practiced the "View from Above" meditation today during a chaotic commute. It instantly turned irritation into empathy. Remembering how small our daily gripes are gives so much mental freedom.',
        likesCount: 15,
        isLiked: false,
        commentsCount: 1,
        tag: 'Reflection',
        comments: [],
      },
    ];
  });

  const tags = ['All', 'Celebration', 'Milestone', 'Transformation', 'Reflection', 'Questions'];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleLike = (postId: string) => {
    soundManager.playTick();
    triggerHaptic('light');
    const updated = posts.map((p) => {
      if (p.id === postId) {
        const nextLiked = !p.isLiked;
        return {
          ...p,
          isLiked: nextLiked,
          likesCount: nextLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
        };
      }
      return p;
    });
    setPosts(updated);
    localStorage.setItem('blessikaa_community_posts', JSON.stringify(updated));
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    soundManager.playSuccess();
    triggerHaptic('medium');

    const newComment: CommunityComment = {
      id: `c_${Date.now()}`,
      authorName: userName || 'Seeker',
      authorAvatar: '✨',
      timestamp: 'Just now',
      text,
      likesCount: 0,
    };

    const updated = posts.map((p) => {
      if (p.id === postId) {
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [...(p.comments || []), newComment],
        };
      }
      return p;
    });

    setPosts(updated);
    localStorage.setItem('blessikaa_community_posts', JSON.stringify(updated));
    setCommentInputs({ ...commentInputs, [postId]: '' });
    showToast('Comment published! 💬');
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    soundManager.playSuccess();
    triggerHaptic('heavy');

    const newPost: CommunityPost = {
      id: `post_${Date.now()}`,
      authorName: userName || 'Blessed Seeker',
      authorAvatar: '✨',
      authorBadge: `${streakCount}d Streak`,
      timestamp: 'Just now',
      challengeTitle: activeChallengeTitle || 'Blessikaa Journey',
      challengeDay: currentDay,
      content: newPostText.trim(),
      likesCount: 1,
      isLiked: true,
      commentsCount: 0,
      tag: newPostTag,
      comments: [],
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem('blessikaa_community_posts', JSON.stringify(updated));
    setNewPostText('');
    setShowCreateModal(false);
    showToast('Your reflection has been shared with the community! 🌟');
  };

  const filteredPosts = posts.filter((p) => {
    if (selectedTag === 'All') return true;
    return p.tag?.toLowerCase() === selectedTag.toLowerCase();
  });

  return (
    <div className="space-y-6 pb-12 max-w-2xl mx-auto">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-purple-900 text-white text-xs font-bold shadow-xl border border-purple-400/30 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Community Feed
            </h1>
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#EEE8FF] text-[#6C3FE8] border border-[#E6E0F2]">
              Blessed Circle
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Share reflections, celebrate streaks & support fellow seekers
          </p>
        </div>

        <button
          onClick={() => {
            soundManager.playTick();
            setShowCreateModal(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#6C3FE8] hover:bg-[#4B22B8] text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Share Reflection</span>
        </button>
      </div>

      {/* Share Prompt Banner */}
      <div
        onClick={() => setShowCreateModal(true)}
        className="p-4 rounded-3xl bg-white border border-[#E6E0F2] shadow-xs cursor-pointer hover:border-[#8F67F5] transition-all flex items-center gap-3 group"
      >
        <div className="w-10 h-10 rounded-2xl bg-[#EEE8FF] text-[#6C3FE8] flex items-center justify-center text-lg font-black group-hover:scale-105 transition-transform">
          ✨
        </div>
        <div className="flex-1 bg-[#F8F5FF] px-4 py-2.5 rounded-2xl text-xs text-slate-400 font-medium">
          How did your Day {currentDay} challenge feel today, {userName || 'Seeker'}?
        </div>
        <button className="px-3.5 py-2 rounded-xl bg-[#EEE8FF] text-[#6C3FE8] font-bold text-xs group-hover:bg-[#6C3FE8] group-hover:text-white transition-colors">
          Post
        </button>
      </div>

      {/* Category Tag Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {tags.map((tag) => {
          const isSelected = selectedTag === tag;
          return (
            <button
              key={tag}
              onClick={() => {
                setSelectedTag(tag);
                soundManager.playTick();
              }}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-[#6C3FE8] text-white shadow-xs'
                  : 'bg-white border border-[#E6E0F2] text-slate-700 hover:bg-[#F8F5FF]'
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const showComments = activeCommentPostId === post.id;
          return (
            <div
              key={post.id}
              className="rounded-3xl bg-white border border-[#E6E0F2] p-5 shadow-xs hover:border-[#8F67F5]/50 transition-all space-y-3.5"
            >
              {/* Post Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#EEE8FF] text-[#6C3FE8] flex items-center justify-center text-xl shadow-xs">
                    {post.authorAvatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-slate-900">
                        {post.authorName}
                      </span>
                      {post.authorBadge && (
                        <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-50 text-[#6C3FE8] border border-purple-200">
                          {post.authorBadge}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400">{post.timestamp}</p>
                  </div>
                </div>

                {post.tag && (
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-xl bg-[#F8F5FF] text-[#6C3FE8] border border-[#E6E0F2]">
                    #{post.tag}
                  </span>
                )}
              </div>

              {/* Challenge Banner if linked */}
              {post.challengeTitle && (
                <div className="p-2.5 rounded-2xl bg-[#F8F5FF] border border-[#E6E0F2]/80 flex items-center justify-between text-xs">
                  <span className="font-bold text-[#6C3FE8] flex items-center gap-1.5 truncate">
                    <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                    <span className="truncate">{post.challengeTitle}</span>
                  </span>
                  {post.challengeDay && (
                    <span className="shrink-0 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white text-purple-900 border border-[#E6E0F2]">
                      Day {post.challengeDay}
                    </span>
                  )}
                </div>
              )}

              {/* Post Content */}
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {post.content}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-[#F8F5FF]">
                <div className="flex items-center gap-3">
                  {/* Like Button */}
                  <button
                    onClick={() => handleToggleLike(post.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      post.isLiked
                        ? 'bg-rose-50 text-rose-600 scale-105'
                        : 'bg-[#F8F5FF] text-slate-600 hover:bg-rose-50 hover:text-rose-600'
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        post.isLiked ? 'fill-rose-600 text-rose-600' : 'text-slate-500'
                      }`}
                    />
                    <span>{post.likesCount}</span>
                  </button>

                  {/* Comment Button */}
                  <button
                    onClick={() => {
                      soundManager.playTick();
                      setActiveCommentPostId(showComments ? null : post.id);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      showComments
                        ? 'bg-[#EEE8FF] text-[#6C3FE8]'
                        : 'bg-[#F8F5FF] text-slate-600 hover:bg-[#EEE8FF] hover:text-[#6C3FE8]'
                    }`}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{post.commentsCount || (post.comments ? post.comments.length : 0)}</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    soundManager.playTick();
                    if (navigator.share) {
                      navigator
                        .share({
                          title: 'Blessikaa Community Reflection',
                          text: `"${post.content}" - ${post.authorName} on Blessikaa`,
                        })
                        .catch(() => {});
                    } else {
                      navigator.clipboard?.writeText(post.content);
                      showToast('Reflection copied to clipboard! 📋');
                    }
                  }}
                  className="p-2 rounded-xl bg-[#F8F5FF] hover:bg-[#EEE8FF] text-slate-500 hover:text-[#6C3FE8] transition-colors"
                  title="Share"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Comments Section */}
              {showComments && (
                <div className="pt-3 border-t border-[#F8F5FF] space-y-3">
                  {/* Existing Comments */}
                  {post.comments && post.comments.length > 0 ? (
                    <div className="space-y-2">
                      {post.comments.map((c) => (
                        <div
                          key={c.id}
                          className="p-3 rounded-2xl bg-[#F8F5FF] text-xs space-y-1"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-900 flex items-center gap-1">
                              <span>{c.authorAvatar}</span>
                              <span>{c.authorName}</span>
                            </span>
                            <span className="text-[10px] text-slate-400">{c.timestamp}</span>
                          </div>
                          <p className="text-slate-700">{c.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 text-center py-1">
                      No comments yet. Be the first to encourage {post.authorName}!
                    </p>
                  )}

                  {/* Input Box */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Write an encouraging response..."
                      value={commentInputs[post.id] || ''}
                      onChange={(e) =>
                        setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddComment(post.id);
                      }}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-[#F8F5FF] border border-[#E6E0F2] text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-[#6C3FE8]"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="p-2 rounded-xl bg-[#6C3FE8] hover:bg-[#4B22B8] text-white shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-[#E6E0F2] space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#EEE8FF] text-[#6C3FE8] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Share with Blessed Circle</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Tag Category
                </label>
                <div className="flex gap-2 flex-wrap">
                  {['Celebration', 'Milestone', 'Transformation', 'Reflection', 'Questions'].map(
                    (tag) => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => setNewPostTag(tag)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          newPostTag === tag
                            ? 'bg-[#6C3FE8] text-white shadow-xs'
                            : 'bg-[#F8F5FF] text-slate-700 hover:bg-[#EEE8FF]'
                        }`}
                      >
                        #{tag}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Your Reflection or Milestone
                </label>
                <textarea
                  rows={4}
                  placeholder="What breakthroughs, insights, or micro-victories did you experience today? Share with the community..."
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-[#F8F5FF] border border-[#E6E0F2] text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#6C3FE8] focus:bg-white resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#6C3FE8] hover:bg-[#4B22B8] text-white text-xs font-bold shadow-md shadow-purple-600/20 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Reflection</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
