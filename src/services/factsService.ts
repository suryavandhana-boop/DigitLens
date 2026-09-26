/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LearningFact {
  id: string;
  badge: string;
  fact: string;
  tip?: string;
}

// 1. Movie-style learning facts for Slide 1
export const MOVIE_STYLE_FACTS: LearningFact[] = [
  {
    id: 'movie-1',
    badge: 'Did You Know? 🎬',
    fact: 'In sci-fi movies, computers read numbers instantly. In real life, post offices use computer vision to sort 30,000 handwritten letters every hour!',
    tip: 'Movie magic inspired real handwriting technology.',
  },
  {
    id: 'movie-2',
    badge: 'Did You Know? 🎬',
    fact: 'In Hollywood spy films, secret agents crack safe codes. In reality, early digit scanners were created so banks could read paper checks!',
    tip: 'Banks still use digit scanners every day.',
  },
  {
    id: 'movie-3',
    badge: 'Did You Know? 🎬',
    fact: 'Movie animation studios convert hand-drawn pencil sketches into digital pixels, just like computers turn your drawings into numbers!',
    tip: 'Every stroke you draw becomes digital pixels.',
  },
  {
    id: 'movie-4',
    badge: 'Did You Know? 🎬',
    fact: 'In retro sci-fi movies, computers made loud beeps when reading text. Real computers quietly recognize handwritten numbers in a fraction of a second!',
    tip: 'Faster than the blink of an eye.',
  },
  {
    id: 'movie-5',
    badge: 'Did You Know? 🎬',
    fact: 'In superhero films, futuristic suits scan symbols in real time, using visual pattern reading just like this handwriting board!',
    tip: 'Pattern recognition powers futuristic gadgets.',
  },
  {
    id: 'movie-6',
    badge: 'Did You Know? 🎬',
    fact: 'In crime movies, detectives study handwriting quirks. Computers look at curves, loops, and angles to read anyone\'s handwriting!',
    tip: 'No two people write a number exactly the same.',
  },
];

// 2. Slide 2 Initial Facts (Before prediction, different from Slide 1)
export const SLIDE2_INITIAL_FACTS: LearningFact[] = [
  {
    id: 'slide2-init-1',
    badge: 'Did You Know? ✍️',
    fact: 'The digit "8" is the only single number you can draw in one continuous loop without lifting your pen!',
    tip: 'Try drawing your 8 in one smooth loop.',
  },
  {
    id: 'slide2-init-2',
    badge: 'Did You Know? ✍️',
    fact: 'In 1989, researchers taught computers to read handwriting using real postal addresses and zip codes!',
    tip: 'Postal zip codes helped computers learn human writing.',
  },
  {
    id: 'slide2-init-3',
    badge: 'Did You Know? ✍️',
    fact: 'The number "0" was invented thousands of years after 1 to 9, originally as a placeholder dot in ancient math!',
    tip: 'Zero started as an empty place marker.',
  },
  {
    id: 'slide2-init-4',
    badge: 'Did You Know? ✍️',
    fact: 'Even if two people write the number "5" completely differently, the overall shape and curves remain recognizable!',
    tip: 'Computers look for shapes, not exact carbon copies.',
  },
  {
    id: 'slide2-init-5',
    badge: 'Did You Know? ✍️',
    fact: 'Before computers, large teams of people manually sorted millions of handwritten tax and census papers every week!',
    tip: 'Now digital scanners do the same work in milliseconds.',
  },
  {
    id: 'slide2-init-6',
    badge: 'Did You Know? ✍️',
    fact: 'Your hand makes tiny unique movements when writing that are as distinctive as your own voice!',
    tip: 'Clear, smooth strokes make numbers easier to read.',
  },
];

// 3. Slide 2 Post-Prediction Facts (Triggered after prediction, different from other slides)
export const SLIDE2_POST_PREDICTION_FACTS: LearningFact[] = [
  {
    id: 'slide2-post-1',
    badge: 'Did You Know? 💡',
    fact: 'When you tap "Show the Answer", the computer breaks your drawing into tiny grid squares to spot the shape of your number!',
    tip: 'Each tiny square helps identify your drawing.',
  },
  {
    id: 'slide2-post-2',
    badge: 'Did You Know? 💡',
    fact: 'Computers don\'t see ink colors — they simply check which parts of the paper are dark and which parts are white!',
    tip: 'Dark strokes stand out clearly against the white sheet.',
  },
  {
    id: 'slide2-post-3',
    badge: 'Did You Know? 💡',
    fact: 'The computer compared your drawing against thousands of handwritten samples in a fraction of a second!',
    tip: 'Both your brain and computers spot patterns instantly.',
  },
  {
    id: 'slide2-post-4',
    badge: 'Did You Know? 💡',
    fact: 'The famous handwritten digit collection used here has helped students and scientists learn computer vision worldwide!',
    tip: 'It is one of the most famous computer learning exercises in history.',
  },
  {
    id: 'slide2-post-5',
    badge: 'Did You Know? 💡',
    fact: 'People around the world write numbers differently — like crossing the 7 or looping the 2 — and computers learn to recognize both!',
    tip: 'Try drawing a crossed 7 to test how it reads.',
  },
  {
    id: 'slide2-post-6',
    badge: 'Did You Know? 💡',
    fact: 'Notice how fast the answer appeared? The computer made its decision in less time than it takes to snap your fingers!',
    tip: 'The entire recognition runs right inside your browser.',
  },
];

// 4. Slide 3 Facts (Challenge & Scoreboard, different from Slides 1 and 2)
export const SLIDE3_FACTS: LearningFact[] = [
  {
    id: 'slide3-1',
    badge: 'Did You Know? 🎯',
    fact: 'A computer doesn\'t just guess one number — it checks how likely your drawing looks like each number from 0 to 9!',
    tip: 'Check the bar chart on the right to see the scores for all 10 digits.',
  },
  {
    id: 'slide3-2',
    badge: 'Did You Know? 🎯',
    fact: 'The numbers 4 and 9 are often the trickiest for computers to tell apart because their top shapes can look so similar!',
    tip: 'A clean, closed top loop helps distinguish a 9 from a 4.',
  },
  {
    id: 'slide3-3',
    badge: 'Did You Know? 🎯',
    fact: 'Traffic cameras and highway speed signs use this exact same pattern reading to recognize numbers on moving vehicles!',
    tip: 'Reading numbers accurately is a vital safety tool.',
  },
  {
    id: 'slide3-4',
    badge: 'Did You Know? 🎯',
    fact: 'Human eyes and brains can recognize a handwritten digit in about 100 milliseconds — almost the exact same speed as this computer!',
    tip: 'Both humans and computers look for loops, stems, and curves.',
  },
  {
    id: 'slide3-5',
    badge: 'Did You Know? 🎯',
    fact: 'When the confidence score reaches 95% or higher, it means the drawing strongly matches the pattern of that digit!',
    tip: 'Drawing centered and clearly boosts confidence.',
  },
  {
    id: 'slide3-6',
    badge: 'Did You Know? 🎯',
    fact: 'Handwritten digit recognition was one of the very first real-world computer vision systems ever built!',
    tip: 'It opened the door to modern phone cameras and photo scanning.',
  },
];

const PREVIOUS_FACT_STORAGE_KEY = 'digitlens_previous_fact_ids';

export interface QuietSessionFacts {
  slide1: LearningFact;
  slide2Initial: LearningFact;
  slide2Post: LearningFact;
  slide3: LearningFact;
}

/**
 * Quietly selects a different set of simple facts for each fresh visit or refresh.
 * When the user leaves and opens the site again, it avoids the facts seen on the
 * previous visit, keeping the experience fresh without displaying or mentioning
 * that facts are being varied.
 */
export function selectQuietFreshFacts(): QuietSessionFacts {
  let previousIds: string[] = [];
  try {
    const stored = localStorage.getItem(PREVIOUS_FACT_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        previousIds = parsed;
      }
    }
  } catch {
    // Quietly ignore storage errors
  }

  const pickFact = (pool: LearningFact[], excludeIds: string[]): LearningFact => {
    const candidates = pool.filter((item) => !excludeIds.includes(item.id));
    const finalPool = candidates.length > 0 ? candidates : pool;
    const randomIndex = Math.floor(Math.random() * finalPool.length);
    return finalPool[randomIndex];
  };

  const usedInSession: string[] = [...previousIds];

  const slide1 = pickFact(MOVIE_STYLE_FACTS, usedInSession);
  usedInSession.push(slide1.id);

  const slide2Initial = pickFact(SLIDE2_INITIAL_FACTS, usedInSession);
  usedInSession.push(slide2Initial.id);

  const slide2Post = pickFact(SLIDE2_POST_PREDICTION_FACTS, usedInSession);
  usedInSession.push(slide2Post.id);

  const slide3 = pickFact(SLIDE3_FACTS, usedInSession);

  // Quietly store the newly selected fact IDs for next visit
  try {
    const currentSessionIds = [slide1.id, slide2Initial.id, slide2Post.id, slide3.id];
    localStorage.setItem(PREVIOUS_FACT_STORAGE_KEY, JSON.stringify(currentSessionIds));
  } catch {
    // Quietly ignore storage errors
  }

  return {
    slide1,
    slide2Initial,
    slide2Post,
    slide3,
  };
}
