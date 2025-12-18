import React from 'react';
import { Course } from '../types';
import { Plus, Book, Clock, ArrowRight } from 'lucide-react';

interface DashboardProps {
  courses: Course[];
  onSelectCourse: (courseId: number) => void;
  onCreateCourse: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ courses, onSelectCourse, onCreateCourse }) => {
  return (
    <div className="animate-fade-in">
      <div className="dashboard-header">
        <div>
          <h2 style={{fontSize: '2rem', fontWeight: 'bold', letterSpacing: '-0.025em'}}>Welcome back</h2>
          <p style={{color: 'var(--text-secondary)', marginTop: '0.5rem'}}>Heres an overview of your study progress.</p>
        </div>
        <button onClick={onCreateCourse} className="primary-button" style={{width: 'auto', padding: '0.75rem 1.5rem'}}>
          <Plus size={20} />
          New Course
        </button>
      </div>

      <div className="course-grid">
        <button
          onClick={onCreateCourse}
          className="glass-card"
          style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', minHeight: '220px'}}
        >
          <div style={{width: '56px', height: '56px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem'}}>
            <Plus size={24} color="var(--accent)" />
          </div>
          <span style={{color: 'var(--text-secondary)', fontWeight: '500'}}>Create New Course</span>
        </button>

        {courses.map((course) => (
          <div key={course.id} onClick={() => onSelectCourse(course.id)} className="glass-card" style={{cursor: 'pointer'}}>
            <div style={{position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: course.color, opacity: 0.8}}></div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem'}}>
              <div style={{width: '48px', height: '48px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'}}>
                {course.icon}
              </div>
              <div style={{padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '50%'}}>
                <ArrowRight size={18} color="var(--text-secondary)" />
              </div>
            </div>
            
            <h3 style={{fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.5rem'}}>{course.name}</h3>
                        
            <div style={{display: 'flex', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--text-secondary)'}}>
                <Clock size={14} />
                <span>{new Date(course.date_created).toLocaleDateString()}</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--text-secondary)'}}>
                <Book size={14} />
                <span>Materials</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;