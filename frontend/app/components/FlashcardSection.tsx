import React, { useState } from 'react';
import { Layers, ChevronLeft, ChevronRight, RotateCw, Sparkles } from 'lucide-react';
import { Flashcard } from '../types';

interface FlashcardSectionProps {
  cards: Flashcard[];
}

const FlashcardSection: React.FC<FlashcardSectionProps> = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((prev) => (prev + 1) % cards.length), 300);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length), 300);
  };

  if (!cards.length) return null;

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem'}}>
      <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h3 style={{fontSize: '1.125rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Layers color="var(--accent)" size={20}/> Flashcards</h3>
        <span style={{fontSize: '0.875rem', padding: '0.25rem 0.75rem', borderRadius: '99px', background: 'rgba(99,102,241,0.1)', color: 'var(--accent)', border: '1px solid rgba(99,102,241,0.2)'}}>
          {currentIndex + 1} / {cards.length}
        </span>
      </div>

      <div className="flashcard-container">
        <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={() => setIsFlipped(!isFlipped)}>
          <div className="card-face face-front">
            <div style={{width: '48px', height: '48px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', fontSize: '1.25rem', fontWeight: 'bold'}}>Q</div>
            <p style={{fontSize: '1.5rem', fontWeight: '500', lineHeight: '1.5'}}>{cards[currentIndex].front}</p>
            <div style={{position: 'absolute', bottom: '1.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><RotateCw size={14}/> Click to reveal</div>
          </div>
          <div className="card-face face-back">
            <Sparkles size={32} color="rgba(255,255,255,0.2)" style={{marginBottom: '1.5rem'}}/>
            <p style={{fontSize: '1.25rem', fontWeight: '500', lineHeight: '1.5'}}>{cards[currentIndex].back}</p>
          </div>
        </div>
      </div>

      <div style={{display: 'flex', gap: '1.5rem', alignItems: 'center'}}>
        <button onClick={handlePrev} style={{padding: '1rem', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)'}}><ChevronLeft/></button>
        <button onClick={() => setIsFlipped(!isFlipped)} className="primary-button" style={{width: 'auto', padding: '0.75rem 2rem', borderRadius: '99px', fontSize: '0.875rem'}}>Flip Card</button>
        <button onClick={handleNext} style={{padding: '1rem', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)'}}><ChevronRight/></button>
      </div>
    </div>
  );
};

export default FlashcardSection;