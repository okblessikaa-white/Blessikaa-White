import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Resilient helper to call Gemini with multi-model fallback and automatic retry
async function generateWithFallback(
  prompt: string,
  config: any,
  modelsToTry: string[] = ['gemini-3.7-flash', 'gemini-flash-latest']
): Promise<string | null> {
  const ai = getGeminiClient();
  if (!ai) return null;

  for (const model of modelsToTry) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config,
        });
        if (response?.text) {
          return response.text;
        }
      } catch (err: any) {
        const isTransient =
          err?.status === 503 ||
          err?.status === 429 ||
          err?.message?.includes('503') ||
          err?.message?.includes('demand') ||
          err?.message?.includes('UNAVAILABLE');

        console.warn(
          `Gemini [${model}] attempt ${attempt + 1} issue (${err?.status || err?.message}). ${
            isTransient ? 'Retrying/Switching model...' : ''
          }`
        );

        if (attempt === 0 && isTransient) {
          // brief pause before retry
          await new Promise((r) => setTimeout(r, 400));
        }
      }
    }
  }
  return null;
}

// Domain-Specific Fallback Generators
function generateMotivationFallback(
  challengeTitle: string,
  currentDay: number,
  streak: number,
  completedTasksCount: number,
  mood: string
) {
  const quotes = [
    'Small daily disciplines repeated with consistency lead to monumental transformations.',
    'You do not rise to the level of your goals. You fall to the level of your systems.',
    'The secret of getting ahead is getting started. Small steps compound every single day.',
    'Every positive action you take is a vote for the version of you that achieves greatness.',
    'Consistency is what transforms average into excellence. Day by day, brick by brick.',
    'Discipline is the bridge between goals and accomplishment. Stay steadfast on your path.',
    'Focus all your energy not on fighting the old, but on building the new.',
  ];

  const randomQuote = quotes[(currentDay - 1) % quotes.length];
  const dayPhase = currentDay <= 7 ? 'Foundation' : currentDay <= 14 ? 'Momentum' : 'Mastery';

  return {
    quote: randomQuote,
    message: `You are on Day ${currentDay} of 21 (${dayPhase} Phase) with a ${streak}-day active streak in "${challengeTitle}". You have completed ${completedTasksCount} micro-actions. Your commitment today is creating lasting neuroplastic change!`,
    actionableNudge:
      currentDay <= 7
        ? 'Anchor your habit right after your morning routine to make execution effortless.'
        : currentDay <= 14
        ? 'Push through any mid-challenge resistance. This is where real identity transformation occurs.'
        : 'Lock in your mastery. Celebrate how far you have come and finish strong today.',
    affirmation: `Today on Day ${currentDay}, I show up with clarity, energy, and unwavering determination.`,
  };
}

function generateChallengeFallback(
  goal: string,
  category: string,
  intensity: string,
  focusArea: string
) {
  const fallbackDays = Array.from({ length: 21 }, (_, i) => {
    const dayNum = i + 1;
    const phaseName =
      dayNum <= 7
        ? 'Foundation & Cue Establishment'
        : dayNum <= 14
        ? 'Momentum & Overcoming Resistance'
        : 'Integration & Habit Mastery';

    const focusTips = [
      'Focus on the 2-minute rule: make the starting threshold as frictionless as possible.',
      'Prepare your environment the evening before to eliminate decision fatigue.',
      'Pair this habit immediately after a well-established existing anchor.',
      'Track your progress immediately after finishing to trigger the dopamine completion loop.',
      'If you feel resistance today, commit to just 5 focused minutes.',
      'Reflect on the compounding benefit this habit brings to your future self.',
      'Celebrate this milestone! Consistent execution is rewiring your baseline neural habits.',
    ];

    const tip = focusTips[(dayNum - 1) % focusTips.length];
    const baseMinutes = intensity === 'intense' ? 30 : intensity === 'medium' ? 20 : 15;

    return {
      day: dayNum,
      title: `Day ${dayNum}: ${phaseName} Step`,
      description: `Execute your daily focused habit for "${goal}". Maintain consistency and log your reflection.`,
      tasks: [
        `Execute dedicated ${baseMinutes}-min session for ${goal}`,
        `Log reflection note & mood in your 21-Day progress tracker`,
        `Set up cues and materials for Day ${dayNum + 1}`,
      ],
      tip,
      estimatedMinutes: baseMinutes,
    };
  });

  return {
    title: `21 Days to ${goal}`,
    description: `A scientifically-structured 21-day neuroplasticity blueprint to conquer ${goal} with daily micro-habits, momentum tracking, and milestone unlocks.`,
    category: category || 'personal-growth',
    intensity: intensity || 'medium',
    focusArea: focusArea || 'Daily Consistency & Habit Mastery',
    colorScheme: 'purple-peach',
    milestone7: 'Habit Spark (7-Day Consistency Milestone)',
    milestone14: 'Momentum Builder (14-Day Midway Transformation)',
    milestone21: 'Habit Mastery & Transformation Graduate',
    days: fallbackDays,
  };
}

function generateCoachChatFallback(question: string, challengeContext: any) {
  const qLower = question.toLowerCase();
  let answer = `When building a 21-day habit for "${challengeContext?.title || 'your goal'}", consistency is far more powerful than intensity.`;
  let tips = [
    'Lower the activation barrier: Make the starting step take less than 2 minutes.',
    'Habit Stack: Attach this action immediately after your morning coffee or evening wind-down.',
    'Never miss twice: If life disrupts your schedule today, do a mini-version to keep the streak alive.',
  ];

  if (qLower.includes('lazy') || qLower.includes('tired') || qLower.includes('motivation') || qLower.includes('hard')) {
    answer = `It is completely normal to experience motivation dips, especially around Days 5-10. Motivation is an emotion, but habits are systems. Reduce today's task to a micro-step so you maintain momentum without overwhelm.`;
    tips = [
      'Do a "Micro-Rep": Commit to just 3 minutes instead of the full duration.',
      'Change your physiology: Take 5 deep breaths or drink a glass of water before starting.',
      'Remember your "Why": Visualize how accomplished you will feel at Day 21.',
    ];
  } else if (qLower.includes('time') || qLower.includes('busy') || qLower.includes('schedule')) {
    answer = `When time is tight, schedule a dedicated non-negotiable 10-minute focus block rather than trying to find spare time. Treat it like a vital appointment with yourself.`;
    tips = [
      'Timebox your session directly into your morning or lunch window.',
      'Eliminate phone distractions for 15 focused minutes.',
      'Prepare all necessary items in advance so you can start instantly.',
    ];
  }

  return { answer, practicalTips: tips };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // AI Generate 21 Days Challenge
  app.post('/api/ai/generate-challenge', async (req, res) => {
    const { goal, category, intensity, focusArea } = req.body;
    if (!goal) {
      return res.status(400).json({ error: 'Goal prompt is required' });
    }

    try {
      const prompt = `Generate a comprehensive, scientifically-backed, inspiring 21-day habit transformation challenge for the following goal: "${goal}".
Category: ${category || 'General Self Improvement'}
Intensity Level: ${intensity || 'Medium'}
Focus Area: ${focusArea || 'Consistency & Transformation'}

Ensure the 21 days have progressive difficulty:
- Days 1-7: Foundation & Micro-Habits (Low barrier to entry)
- Days 8-14: Building Momentum & Resistance Overcoming (Moderate challenge)
- Days 15-21: Habit Solidification, Integration & Mastery (Full routine)

Each day MUST include:
- day: number (1 to 21)
- title: clear, punchy day title
- description: 1-2 sentence actionable description
- tasks: array of 2 to 4 specific checkbox action items
- tip: 1 practical habit psychology or motivational tip
- estimatedMinutes: number between 10 and 45`;

      const responseText = await generateWithFallback(prompt, {
        systemInstruction:
          'You are an elite behavioral scientist and peak performance habit coach specializing in the 21-day neuroplasticity habit formation method. Create motivating, practical, and highly engaging daily steps.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Title of the 21-day challenge' },
            description: { type: Type.STRING, description: 'Overview and transformative benefit of this challenge' },
            category: { type: Type.STRING },
            intensity: { type: Type.STRING },
            focusArea: { type: Type.STRING },
            milestone7: { type: Type.STRING, description: 'Reward or accomplishment after 7 days' },
            milestone14: { type: Type.STRING, description: 'Reward or accomplishment after 14 days' },
            milestone21: { type: Type.STRING, description: 'Final mastery reward after 21 days' },
            days: {
              type: Type.ARRAY,
              description: 'Exactly 21 days of structured daily guidance',
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  tasks: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  tip: { type: Type.STRING },
                  estimatedMinutes: { type: Type.INTEGER },
                },
                required: ['day', 'title', 'description', 'tasks', 'tip', 'estimatedMinutes'],
              },
            },
          },
          required: ['title', 'description', 'category', 'milestone7', 'milestone14', 'milestone21', 'days'],
        },
      });

      if (responseText) {
        const parsed = JSON.parse(responseText);
        return res.json(parsed);
      }
    } catch (error: any) {
      console.warn('AI challenge generation falling back gracefully:', error?.message);
    }

    // Graceful reliable fallback
    return res.json(generateChallengeFallback(goal, category, intensity, focusArea));
  });

  // AI Daily Motivational Boost & Micro-Coach
  app.post('/api/ai/daily-motivation', async (req, res) => {
    const { challengeTitle, currentDay, streak, completedTasksCount, mood } = req.body;
    const curDay = Number(currentDay) || 1;
    const curStreak = Number(streak) || 0;
    const tasksCount = Number(completedTasksCount) || 0;
    const userMood = mood || 'Determined';
    const title = challengeTitle || 'Habit Transformation';

    try {
      const prompt = `Give a high-impact, energizing, psychologically empowering daily motivational booster and coach tip for a user who is on Day ${curDay} of 21 in their challenge "${title}".
Current streak: ${curStreak} days.
Completed tasks: ${tasksCount}.
Current mood / reflection: ${userMood}.

Provide:
1. Inspiring quote (famous or crafted)
2. Personalized coaching message celebrating their exact Day ${curDay} progress
3. Quick 1-minute actionable mental nudge
4. Daily empowering affirmation`;

      const responseText = await generateWithFallback(prompt, {
        systemInstruction:
          'You are an inspiring, warm, and hyper-encouraging habit coach who makes people feel unstoppable.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quote: { type: Type.STRING },
            message: { type: Type.STRING },
            actionableNudge: { type: Type.STRING },
            affirmation: { type: Type.STRING },
          },
          required: ['quote', 'message', 'actionableNudge', 'affirmation'],
        },
      });

      if (responseText) {
        const parsed = JSON.parse(responseText);
        return res.json(parsed);
      }
    } catch (error: any) {
      console.warn('Motivation generation falling back gracefully:', error?.message);
    }

    // Always deliver a high-quality motivating response even during API demand spikes
    return res.json(
      generateMotivationFallback(title, curDay, curStreak, tasksCount, userMood)
    );
  });

  // AI Habit Assistant / Coach Q&A
  app.post('/api/ai/coach-chat', async (req, res) => {
    const { question, challengeContext } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    try {
      const responseText = await generateWithFallback(
        `User habit coaching question: "${question}".
Active Challenge Context: ${JSON.stringify(challengeContext || {})}

Provide clear, empathetic, science-backed guidance with practical bullet points.`,
        {
          systemInstruction:
            'You are a warm, certified habit coach specializing in James Clear habit loops, micro-habits, and neuroplasticity.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              answer: { type: Type.STRING },
              practicalTips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['answer', 'practicalTips'],
          },
        }
      );

      if (responseText) {
        const parsed = JSON.parse(responseText);
        return res.json(parsed);
      }
    } catch (error: any) {
      console.warn('AI Coach Chat falling back gracefully:', error?.message);
    }

    return res.json(generateCoachChatFallback(question, challengeContext));
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`21 Days Challenge App server running on http://localhost:${PORT}`);
  });
}

startServer();
