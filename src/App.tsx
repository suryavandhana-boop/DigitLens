/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Slide1Explore } from './components/Slide1Explore';
import { Slide2WritingBoard } from './components/Slide2WritingBoard';
import { Slide3ChallengeScoreboard } from './components/Slide3ChallengeScoreboard';
import { Footer } from './components/Footer';
import { selectQuietFreshFacts } from './services/factsService';

export default function App() {
  const [currentSlide, setCurrentSlide] = useState<number>(1);

  // Quietly selects a different set of simple facts for each fresh visit or refresh
  const [sessionFacts] = useState(() => selectQuietFreshFacts());

  const handleSelectSlide = (slide: number) => {
    setCurrentSlide(slide);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-orange-100 selection:text-orange-900">
      {/* Navigation Header for 3 Slides */}
      <Header
        currentSlide={currentSlide}
        onSelectSlide={handleSelectSlide}
      />

      <main className="flex-1">
        {/* Slide 1: Explore (Welcome, Start Exploring, Did You Know? card) */}
        {currentSlide === 1 && (
          <Slide1Explore
            onStartExploring={() => handleSelectSlide(2)}
            fact={sessionFacts.slide1}
          />
        )}

        {/* Slide 2: Writing Board (Clean canvas, tools, recognition & Did You Know facts) */}
        {currentSlide === 2 && (
          <Slide2WritingBoard
            onGoToChallenge={() => handleSelectSlide(3)}
            initialFact={sessionFacts.slide2Initial}
            postPredictionFact={sessionFacts.slide2Post}
          />
        )}

        {/* Slide 3: Challenge & Scoreboard (Target digit, score tracking, live probabilities & Did You Know) */}
        {currentSlide === 3 && (
          <Slide3ChallengeScoreboard
            onBackToBoard={() => handleSelectSlide(2)}
            fact={sessionFacts.slide3}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
