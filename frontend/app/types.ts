export interface Flashcard {
  front: string;
  back: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface StudyGuide {
  title: string;
  summary: string;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
}

export type InputMode = 'text' | 'file'| 'yt' | 'url';

export type typeToSend = 'txt' | 'yt' | 'site';

export interface GenerationStatus {
  state: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

export interface Course {
  id: number;
  name: string;
  user_id: number | null;
  color: string;
  icon: string;
  date_created: Date;
}

export interface StudyMaterial {
  id: string;
  courseId: number;
  type: InputMode;
  originalSource: string;
  createdAt: Date;
  data: StudyGuide;
}

export interface Sources {
  id: number;
  course_id: number;
  origin: string;
  transcript: string;
  date_added: string;
}

export type ViewState = 
  | { name: 'dashboard' }
  | { name: 'course'; courseId: number }
  | { name: 'study'; courseId: number };
