import React, { useEffect, useState } from 'react';
import { Course, Sources, InputMode } from '../types';
import InputSection from './InputSection';
import { FileText, Link, File, ArrowLeft, MoreHorizontal, Calendar, BrainCircuit } from 'lucide-react';
import api from '../utils/api';

interface CourseDetailProps {
  course: Course;
  onBack: () => void;
  onSelectMaterial: (CourseID: number) => void;
  isLoading: boolean;
  error?: string;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ course, onSelectMaterial, onBack, isLoading, error }) => {
  const [showInput, setShowInput] = useState(false);
  const [showRename, setShowRename] = useState(false);
  const [newTitle, setNewTitle] = useState(course.name);

  const getIcon = (type: InputMode) => {
    switch(type) {
      case 'text': return <FileText size={18} color="#60a5fa" />;
      case 'url': return <Link size={18} color="#34d399" />;
      case 'file': return <File size={18} color="#fb923c" />;
      case 'yt': return <Link size={18} color="#fv623c" />;
    }
  };

  const handleRename = async () => {
  try {
    await api.post('/uupdate-course-title', {
      course_id: course.id,
      name: newTitle
    });
    setShowRename(false);
  } catch (error) {
    console.error('Failed to rename course:', error);
  }
};

  const [sources, setSources] = useState<Sources[]>([]);

  const fetchSources = async () => {
      console.log('Fetching sources for course ID:', course.id);
      try {
        const response = await api.get('/get-sources', {
          params: { course_id: course.id }
        });
        

        const data = response.data || response;

        if (Array.isArray(data)) {
          setSources(data as Sources[]);
        } else {
          console.error('Expected array but got:', data);
          setSources([]);
        }
        
      } catch (error) {
        console.error('Failed to fetch sources:', error);
      }
  };

   useEffect(() => {
      const loadSources = async () => {
        await fetchSources();
      };
      
      if (course.id) {
        loadSources();
      }
    }, [course.id]); 

  return (
    <div className="animate-fade-in" style={{maxWidth: '1000px', margin: '0 auto'}}>
      <button onClick={onBack} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem'}}>
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem'}}>
        <div style={{display: 'flex', gap: '1.5rem', alignItems: 'center'}}>
          <div style={{width: '80px', height: '80px', borderRadius: '1.5rem', background: `${course.color}20`, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)'}}>
            {course.icon}
          </div>
          <div>
            <h1 style={{fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.025em'}}>{course.name}</h1>
          </div>
        </div>
        <button 
          onClick={() => setShowRename(true)}
          style={{padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)'}}
        >
          <MoreHorizontal size={24} color="var(--text-secondary)" />
        </button>

        {showRename && (
          <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  }}>
    <div style={{
      background: 'rgba(30, 41, 59, 0.95)',
      padding: '2rem',
      borderRadius: '1.5rem',
      width: '400px',
      border: '1px solid var(--border)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
    }}>
              <h3 style={{fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', color: '#fff'}}>Rename Course</h3>
              <input
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        style={{
          width: '100%',
          marginBottom: '1.5rem',
          padding: '0.875rem 1rem',
          background: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid var(--border)',
          borderRadius: '0.75rem',
          color: '#fff',
          outline: 'none',
          fontSize: '1rem'
        }}
        autoFocus
      />
              <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
        <button 
          onClick={() => setShowRename(false)}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border)',
            borderRadius: '0.75rem',
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
        <button 
          onClick={handleRename}
          className="primary-button"
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '0.875rem'
          }}
        >
          Save Changes
        </button>
      </div>
          </div>
      </div> )}
      </div>

      <div style={{background: 'var(--panel-bg)', borderRadius: '2rem', border: '1px solid var(--border)', padding: '0.25rem', marginBottom: '1.5rem', overflow: 'hidden'}}>
        {!showInput ? (
          <div style={{padding: '3rem', textAlign: 'center'}}>
            <div style={{width: '72px', height: '72px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'}}>
              <BrainCircuit size={36} color="var(--accent)" />
            </div>
            <h3 style={{fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem'}}>Add Study Material</h3>
            <p style={{color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 2rem', lineHeight: '1.6'}}>Upload documents, paste links or notes. Well generate study tools for you.</p>
            <button onClick={() => setShowInput(true)} className="primary-button" style={{width: 'auto', padding: '0.875rem 2.5rem', margin: '0 auto'}}>
              Create New Source
            </button>
          </div>
        ) : (
          <div style={{padding: '1.5rem'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 1rem 1rem', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem'}}>
              <span style={{fontWeight: '600'}}>New Source</span>
              <button onClick={() => setShowInput(false)} style={{fontSize: '0.875rem', color: 'var(--text-secondary)'}}>Cancel</button>
            </div>
            <InputSection course_id={course.id} isLoading={isLoading} />
            {error && <div style={{marginTop: '1rem', padding: '1rem', background: 'rgba(239,68,68,0.1)', color: '#f87171', borderRadius: '0.75rem', border: '1px solid rgba(239,68,68,0.2)'}}>{error}</div>}
          </div>
        )}
      </div>

      

      <div>
        <button onClick={() => onSelectMaterial(course.id)} className="primary-button" style={{width: 'auto', padding: '0.875rem 2.5rem', margin: '0 auto', marginBottom: '1.5rem'}}>
        See Generated Materials        
      </button>
        <h3 style={{fontSize: '1.25rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem'}}>
          Your Sources <span style={{fontSize: '0.75rem', padding: '0.25rem 0.625rem', background: 'rgba(255,255,255,0.05)', borderRadius: '99px', border: '1px solid var(--border)'}}>{sources.length}</span>
        </h3>
        {sources.length === 0 ? (
          <div style={{textAlign: 'center', padding: '4rem', border: '1px dashed var(--border)', borderRadius: '1.5rem', color: 'var(--text-secondary)'}}>No sources yet.</div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            {sources.map((s) => (
              <div key={s.id} className="glass-card" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'}}>
                <div style={{display: 'flex', gap: '1.25rem', alignItems: 'center'}}>
                  <div style={{width: '56px', height: '56px', borderRadius: '1rem', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)'}}>
                      <h4 style={{fontSize: '1.125rem', fontWeight: '700'}}>{s.origin}</h4>
                  </div>
                  <div>
                    <h4 style={{fontSize: '1.125rem', fontWeight: '700'}}>{s.origin}</h4>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem'}}>
                      <span style={{width: '3px', height: '3px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%'}}></span>
                      <span style={{textTransform: 'uppercase'}}>{s.origin}</span>
                    </div>
                  </div>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '2rem'}}>
                            <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}><Calendar size={12}/>{new Date(s.date_added).toLocaleDateString()}</span>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;