import React, { useState, useRef } from 'react';
import { FileText, Link as LinkIcon, Upload, X, File as FileIcon } from 'lucide-react';
import { InputMode } from '../types';
import api from '../utils/api';


interface InputSectionProps {
  course_id: number;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ course_id, isLoading }) => {
  const [mode, setMode] = useState<InputMode>('text');
  const [textContent, setTextContent] = useState('');
  const [urlContent, setUrlContent] = useState('');
  const [urlYoutube, setUrlYoutube] = useState('');
  const [file, setFile] = useState<{ name: string; type: string; base64: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFile = e.target.files?.[0];
  if (selectedFile) {
    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = (reader.result as string).split(',')[1];
      setFile({ 
        name: selectedFile.name, 
        type: selectedFile.type, 
        base64: base64Data 
      });
    };
    reader.readAsDataURL(selectedFile);
    }
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Course ID:', course_id);


    if (isLoading) return;
    
    try {
      let contentToSend ='';
      let typetosend = ''
      
      if (mode === 'text' && textContent.trim()) {
        contentToSend = textContent;
        typetosend = 'txt';
      } else if (mode === 'url' && urlContent.trim()) {
        contentToSend = urlContent;
        typetosend = 'site';
      } else if (mode === 'yt' && urlYoutube.trim()) {
        contentToSend = urlYoutube;
        typetosend = 'yt';
      } else if (mode === 'file' && file) {
        contentToSend = file.name.split('.')[0];
        
        if (file.type.includes('pdf')) {
          typetosend = 'pdf';
        } else if (file.name.endsWith('.docx')) {
          typetosend = 'docx';
        } else {
          typetosend = 'txt';
        }
      } else {
        alert('Please enter content');
        return;
      }
      console.log("content: ", contentToSend)
      console.log("source: ", typetosend)

      const response = await api.post('/add-source', {
        course_id: Number(course_id),
        source: String(contentToSend),
        type: String(typetosend),
      });

      console.log('Source added:', response.data || response);
      
      setTextContent('');
      setUrlContent('');
      setUrlYoutube('');
      setFile(null);
      
    } catch (error) {
      console.error('Failed to add source:', error);
      alert('Failed to add source');
    }
  };

  return (
    <div style={{background: 'rgba(0,0,0,0.2)', borderRadius: '1rem', overflow: 'hidden'}}>
      <div className="tabs-header">
        <button onClick={() => setMode('text')} className={`tab-btn ${mode === 'text' ? 'active' : ''}`}><FileText size={18}/> Paste Text</button>
        <button onClick={() => setMode('file')} className={`tab-btn ${mode === 'file' ? 'active' : ''}`}><Upload size={18}/> Upload File</button>
        <button onClick={() => setMode('url')} className={`tab-btn ${mode === 'url' ? 'active' : ''}`}><LinkIcon size={18}/> Website URL</button>
        <button onClick={() => setMode('yt')} className={`tab-btn ${mode === 'yt' ? 'active' : ''}`}><LinkIcon size={18}/> Youtube Video</button>
      </div>

      <div style={{padding: '1.5rem'}}>
        <form onSubmit={handleSubmit}>
          {mode === 'text' && <textarea style={{width: '100%', height: '200px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: '1rem', padding: '1rem', color: '#fff', outline: 'none', resize: 'none'}} placeholder="Enter text notes..." value={textContent} onChange={(e) => setTextContent(e.target.value)} />}
          {mode === 'url' && <input style={{width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: '1rem', color: '#fff', outline: 'none'}} type="url" placeholder="https://..." value={urlContent} onChange={(e) => setUrlContent(e.target.value)} />}
          {mode === 'yt' && <input style={{width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: '1rem', color: '#fff', outline: 'none'}} type="url" placeholder="https://www.youtube.com/watch?v=..." value={urlYoutube} onChange={(e) => setUrlYoutube(e.target.value)} />}
          {mode === 'file' && (
            <div onClick={() => !file && fileInputRef.current?.click()} style={{border: '2px dashed var(--border)', borderRadius: '1rem', padding: '3rem', textAlign: 'center', background: 'rgba(0,0,0,0.1)', cursor: file ? 'default' : 'pointer'}}>
              {!file ? (
                <>
                  <Upload size={32} color="var(--accent)" style={{marginBottom: '1rem'}}/>
                  <p style={{fontSize: '0.875rem', fontWeight: '500'}}>Click to select file</p>
                  <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,image/*" onChange={handleFileChange} />
                </>
              ) : (
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem'}}>
                  <FileIcon size={24} color="var(--accent)"/>
                  <span style={{fontSize: '0.875rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis'}}>{file.name}</span>
                  <button onClick={(e) => { e.stopPropagation(); setFile(null); }} style={{color: '#f87171'}}><X size={20}/></button>
                </div>
              )}
            </div>
          )}
          <div style={{marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end'}}>
            <button type="submit" disabled={isLoading} className="primary-button" style={{width: 'auto', padding: '0.75rem 2rem'}}>
              {isLoading ? 'Adding...' : 'Add Source'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputSection;