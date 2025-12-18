import React, { useState } from 'react';
import { BookOpen, Copy, Check } from 'lucide-react';

interface SummarySectionProps {
  summary: string;
}

const SummarySection: React.FC<SummarySectionProps> = ({ summary }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{maxWidth: '800px', margin: '0 auto'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <h3 style={{fontSize: '1.25rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
          <BookOpen color="var(--accent)"/> Key Summary
        </h3>
        <button onClick={handleCopy} style={{padding: '0.5rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)'}}>
          {copied ? <Check size={18}/> : <Copy size={18}/>}
        </button>
      </div>
      <div style={{lineHeight: '1.8', fontSize: '1.125rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border)'}}>
        {summary.split('\n').map((para, i) => <p key={i} style={{marginBottom: '1rem'}}>{para}</p>)}
      </div>
    </div>
  );
};

export default SummarySection;