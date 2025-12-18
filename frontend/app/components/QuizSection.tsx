import React, { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { QuizQuestion } from '../types';

interface QuizSectionProps {
  questions: QuizQuestion[];
}

const QuizSection: React.FC<QuizSectionProps> = ({ questions }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => { if (selectedAnswers[idx] === q.answer) correct++; });
    return correct;
  };

  if (!questions.length) return null;

  return (
    <div style={{maxWidth: '800px', margin: '0 auto'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <h3 style={{fontSize: '1.25rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.75rem'}}><HelpCircle color="var(--accent)"/> Knowledge Check</h3>
        {showResults && <span style={{padding: '0.5rem 1rem', background: 'rgba(99,102,241,0.1)', color: 'var(--accent)', borderRadius: '99px', fontWeight: 'bold'}}>Score: {calculateScore()} / {questions.length}</span>}
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: '2.5rem'}}>
        {questions.map((q, qIdx) => (
          <div key={qIdx}>
            <p style={{fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.25rem'}}><span style={{color: 'var(--accent)', marginRight: '0.5rem'}}>{qIdx + 1}.</span> {q.question}</p>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
              {q.options.map((opt, oIdx) => {
                const isSelected = selectedAnswers[qIdx] === opt;
                const isCorrect = opt === q.answer;
                let colorStyle = {};
                if (showResults) {
                  if (isCorrect) colorStyle = {borderColor: '#10b981', background: 'rgba(16,185,129,0.1)', color: '#fff'};
                  else if (isSelected) colorStyle = {borderColor: '#ef4444', background: 'rgba(239,68,68,0.1)', color: '#fff'};
                }

                return (
                  <button
                    key={oIdx}
                    onClick={() => !showResults && setSelectedAnswers({...selectedAnswers, [qIdx]: opt})}
                    className={`quiz-option ${isSelected ? 'selected' : ''}`}
                    style={colorStyle}
                  >
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      {opt}
                      {showResults && isCorrect && <CheckCircle size={18} color="#10b981" />}
                      {showResults && isSelected && !isCorrect && <XCircle size={18} color="#ef4444" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)'}}>
        {!showResults ? (
          <button onClick={() => setShowResults(true)} disabled={Object.keys(selectedAnswers).length < questions.length} className="primary-button">Submit Answers</button>
        ) : (
          <button onClick={() => { setShowResults(false); setSelectedAnswers({}); }} className="primary-button" style={{background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)'}}>
            <RefreshCw size={18}/> Retake Quiz
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizSection;