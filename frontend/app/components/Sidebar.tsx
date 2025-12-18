import React from 'react';
import { LayoutDashboard, Plus, Settings, LogOut, GraduationCap } from 'lucide-react';
import { ViewState, Course } from '../types';

interface SidebarProps {
  currentView: ViewState;
  courses: Course[];
  onChangeView: (view: ViewState) => void;
  onCreateCourse: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, courses, onChangeView, onCreateCourse, onLogout }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">
          <GraduationCap size={20} color="white" />
        </div>
        <span className="logo-text">Learnify</span>
      </div>

      <div style={{padding: '0 1rem'}}>
        <button
          onClick={() => onChangeView({ name: 'dashboard' })}
          className={`nav-item ${currentView.name === 'dashboard' ? 'active' : ''}`}
          style={{width: 'calc(100% - 2rem)'}}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </button>
      </div>

      <div className="sidebar-section-title">
        <span>My Courses</span>
        <button onClick={onCreateCourse} style={{color: 'inherit'}}>
          <Plus size={16} />
        </button>
      </div>

      <div style={{flex: 1, overflowY: 'auto', padding: '0 0.5rem'}}>
        {courses.map((course) => (
          <button
            key={course.id}
            onClick={() => onChangeView({ name: 'course', courseId: course.id })}
            className={`nav-item ${currentView.name === 'course' && currentView.courseId === course.id ? 'active' : ''}`}
            style={{width: 'calc(100% - 1rem)', margin: '0.25rem 0.5rem'}}
          >
            <span style={{width: '8px', height: '8px', borderRadius: '50%', backgroundColor: course.color, boxShadow: '0 0 8px rgba(255,255,255,0.2)'}}></span>
            <span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{course.name}</span>
          </button>
        ))}
      </div>

      <div className="sidebar-footer">
        <button className="nav-item" style={{width: '100%', margin: '0 0 0.5rem'}}>
          <Settings size={18} />
          Settings
        </button>
        <button onClick={onLogout} className="nav-item" style={{width: '100%', margin: 0}}>
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;