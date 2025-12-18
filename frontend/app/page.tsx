'use client';
import api from './utils/api';
import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CourseDetail from './components/CourseDetail';
import StudyView from './components/StudyView';
import AuthPage from './components/AuthPage';
import { generateStudyMaterial } from './services/geminiService';
import { 
  StudyGuide, 
  GenerationStatus, 
  InputMode, 
  Course, 
  StudyMaterial,
  ViewState 
} from './types';

const MOCK_COURSES: Course[] = [
  /*
  {
    id: 14,
    user_id: 14,
    name: 'Introduction to Psychology',
    color: '#6366f1',
    icon: '🧠',
    date_created: new Date('2023-10-15')
  },
  {
    id: 14,
    user_id: 14,
    name: 'Modern Art History',
    color: '#f43f5e',
    icon: '🎨',
    date_created: new Date('2026-11-02')
  }
    */
];

const MOCK_MATERIALS: StudyMaterial[] = [
  {
    id: 'm1',
    courseId: 14,
    type: 'text',
    originalSource: 'Lecture 1 Notes',
    createdAt: new Date('2023-10-15'),
    data: {
      title: 'Cognitive Behavioral Basics',
      summary: "Cognitive Behavioral Therapy (CBT) assumes that cognitive patterns (thoughts) influence emotions and behaviors. By identifying and challenging negative automatic thoughts, individuals can alter their emotional responses and behavioral patterns.",
      flashcards: [
        { front: "What is the core premise of CBT?", back: "Thoughts influence feelings and behaviors." },
        { front: "Define Cognitive Restructuring", back: "The process of identifying and disputing irrational or maladaptive thoughts." }
      ],
      quiz: [
         { question: "CBT focuses primarily on:", options: ["Past trauma", "Current thought patterns", "Dream analysis", "Medication"], answer: "Current thought patterns" }
      ]
    }
  }
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState('1');
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [view, setView] = useState<ViewState>({ name: 'dashboard' });
  const [status, setStatus] = useState<GenerationStatus>({ state: 'idle' });





  const handleLogin = (userId: number) => {
    setIsAuthenticated(true);
    setUserId(userId);
    console.log('Logged in user ID:', userId);
  }

  const handleLogout = () => {
    setIsAuthenticated(false);
    setView({ name: 'dashboard' });
  };


  const handleCreateCourse = async () => {
    try {
   
      const response = await api.post<Course>('/create-course', {
        user_id: userId,
      });
      
      
      const createdCourse = response.data;

      const newCourse: Course = {
        id: createdCourse.id,
        user_id: createdCourse.user_id,
        name: createdCourse.name,
        date_created: createdCourse.date_created,
        color: '#' + Math.floor(Math.random()*16777215).toString(16),
        icon: '📚'
      };
      
      setCourses([newCourse, ...courses]);
      setView({ name: 'course', courseId: newCourse.id });
      
    } catch (error) {
      console.error('Failed to create course:', error);
    }
    };

  
  const handleSelectMaterial = async (courseId: number) => {
  setStatus({ state: 'loading', message: 'Generating study materials...' });
  console.log('Generating study materials for course ID:', courseId);
  try {
    const response = await api.post('/generate-content', {
      course_id: courseId
    });

    console.log('Generation response:', response);
    

    const generatedData = response.data || response;
    
    setView({ 
      name: 'study' as const,
      courseId: courseId
    });
    
    setStatus({ state: 'success' });
    
  } catch (error) {
    console.error('Error generating content:', error);
    setStatus({ 
      state: 'error', 
      message: 'Failed to generate study materials' 
    });
  }
}; 

  if (!isAuthenticated) return <AuthPage onLogin={handleLogin} />;

  const renderContent = () => {
    switch (view.name) {
      case 'dashboard':
        return <Dashboard courses={courses} onSelectCourse={(id) => setView({ name: 'course', courseId: id })} onCreateCourse={handleCreateCourse} />;
      case 'course':
        const c = courses.find(item => item.id === view.courseId);
        if (!c) return null;
        return <CourseDetail course={c} onSelectMaterial={handleSelectMaterial} onBack={() => setView({ name: 'dashboard' })} isLoading={status.state === 'loading'} error={status.state === 'error' ? status.message : undefined} />;
      case 'study':
        return <StudyView course_id={view.courseId } onBack={() => setView({ name: 'course', courseId: view.courseId })} />;
      default: return null;
    }
  };

  return (
    <div className="app-container">
      <Sidebar currentView={view} courses={courses} onChangeView={setView} onCreateCourse={handleCreateCourse} onLogout={handleLogout} />
      <main className="main-content">
        <div className="content-inner">
           {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;