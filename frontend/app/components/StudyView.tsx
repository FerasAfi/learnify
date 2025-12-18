import React, { useEffect, useState } from 'react';
import { StudyMaterial } from '../types';
import SummarySection from './SummarySection';
import FlashcardSection from './FlashcardSection';
import QuizSection from './QuizSection';
import { ArrowLeft, Book, LayoutGrid, BrainCircuit, Download } from 'lucide-react';
import api from '../utils/api';

interface StudyViewProps {
  course_id: number;
  onBack: () => void;
}

const StudyView: React.FC<StudyViewProps> = ({ course_id, onBack }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'flashcards' | 'quiz'>('summary');
  const [summary, setSummary] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [quiz, setQuiz] = useState('');
  const [question, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

 
  
const fetchSummary = async () => {
  try {
    const response = await api.get('/get-summary', {
      params: { q: course_id }
    });
    console.log('Summary response:', response);
    setSummary(response.data?.content || '');
  } catch (error) {
    console.error('Failed to fetch summary:', error);
  }
};

const fetchFlashcards = async () => {
  try {
    const response = await api.get('/get-flashcard', { 
      params: { q: course_id }
    });
    console.log('Flashcards response:', response);
    setFlashcards(response.data || []);
  } catch (error) {
    console.error('Failed to fetch flashcards:', error);
  }
};

const fetchQuiz = async () => {
  try {
    const response = await api.get('/get-quiz', {
      params: { q: course_id }
    });
    console.log('Quiz response:', response);
    setQuiz(response.data || []);
  } catch (error) {
    console.error('Failed to fetch quiz:', error);
  }
};

const fetchQuestions = async (quiz_id: number) => {
  try {
    const quizRes = await api.get('/get-quiz-id', { params: { course_id } });
    console.log('Quiz response:', quizRes);
    
    const quizId = quizRes.data?.id;
    const response = await api.get('/get-questions', {
      params: { quiz_id: quiz_id }
    });
    console.log('Questions response:', response);
    return response.data || response;
  } catch (error) {
    console.error('Failed to fetch questions:', error);
    return [];
  }
};



useEffect(() => {
  console.log('=== STUDYVIEW MOUNTED ===');
  console.log('Course ID:', course_id);
  
  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([
      fetchSummary(),
      fetchFlashcards(), 
      fetchQuiz()
    ]);
    setLoading(false);
  };
  
  fetchAll();
}, [course_id]);

  if (loading) return <div>Loading...</div>;


    return (
    <div className="animate-fade-in" style={{height: 'calc(100vh - 4rem)', display: 'flex', flexDirection: 'column'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
          <button onClick={onBack} style={{padding: '0.5rem', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)'}}>
            <ArrowLeft size={20}/>
          </button>
          <div>
            <h2 style={{fontSize: '1.5rem', fontWeight: 'bold'}}>{course_id} - Study Materials</h2>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>
              {flashcards.length} flashcards • {quiz.length} quiz questions
            </p>
          </div>
        </div>
        <button style={{padding: '0.5rem 1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
          <Download size={16}/> Export
        </button>
      </div>

      <div style={{flex: 1, background: 'var(--panel-bg)', backdropFilter: 'blur(20px)', borderRadius: '1.5rem', border: '1px solid var(--border)', display: 'flex', overflow: 'hidden'}}>
        <div style={{width: '240px', background: 'rgba(0,0,0,0.2)', borderRight: '1px solid var(--border)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
          <button onClick={() => setActiveTab('summary')} className={`nav-item ${activeTab === 'summary' ? 'active' : ''}`} style={{width: '100%', margin: 0}}>
            <Book size={18}/> Summary
          </button>
          <button onClick={() => setActiveTab('flashcards')} className={`nav-item ${activeTab === 'flashcards' ? 'active' : ''}`} style={{width: '100%', margin: 0}}>
            <LayoutGrid size={18}/> Flashcards ({flashcards.length})
          </button>
          <button onClick={() => setActiveTab('quiz')} className={`nav-item ${activeTab === 'quiz' ? 'active' : ''}`} style={{width: '100%', margin: 0}}>
            <BrainCircuit size={18}/> Quiz ({quiz.length})
          </button>
        </div>
        
        <div style={{flex: 1, padding: '2rem', overflowY: 'auto'}}>
          {activeTab === 'summary' && <SummarySection summary={summary} />}
          {activeTab === 'flashcards' && <FlashcardSection cards={flashcards} />}
          {activeTab === 'quiz' && <QuizSection questions={quiz} />}
        </div>
      </div>
    </div>
  );
};

export default StudyView;