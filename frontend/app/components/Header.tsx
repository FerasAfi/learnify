import React from 'react';
import { Sparkles, Github } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Sparkles className="text-white h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">NoteGenius</h1>
        </div>
        
        <nav className="flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
            How it Works
          </a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
            Pricing
          </a>
          <div className="h-6 w-px bg-slate-200"></div>
          <a href="#" className="text-slate-500 hover:text-slate-800 transition-colors">
            <Github size={20} />
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
