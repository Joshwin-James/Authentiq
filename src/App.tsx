import { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { MediaUploader } from './components/MediaUploader';
import { InvestigationProcess } from './components/InvestigationProcess';
import { ResultsDashboard } from './components/ResultsDashboard';
import { motion, AnimatePresence } from 'framer-motion';
import { runInvestigation } from './services/api';
import type { InvestigationResult } from './services/api';

function App() {
  const [appState, setAppState] = useState<'idle' | 'investigating' | 'results'>('idle');
  const [mediaData, setMediaData] = useState<{type: 'file'|'url', value: string, file?: File} | null>(null);
  const [investigationStage, setInvestigationStage] = useState(0);
  const [result, setResult] = useState<InvestigationResult | null>(null);
  
  const handleInvestigate = (data: {type: 'file'|'url', value: string, file?: File}) => {
    setMediaData(data);
    setAppState('investigating');
    setInvestigationStage(0);
  };

  useEffect(() => {
    if (appState === 'investigating' && mediaData) {
      let isSubscribed = true;
      runInvestigation(mediaData, (stage) => {
        if (isSubscribed) setInvestigationStage(stage);
      }).then((investigationResult) => {
        if (isSubscribed) {
          setResult(investigationResult);
          setAppState('results');
        }
      }).catch((error) => {
        console.error(error);
        if (isSubscribed) {
          alert('Investigation failed. Please check the console and try again.');
          setAppState('idle');
          setMediaData(null);
        }
      });
      return () => { isSubscribed = false; };
    }
  }, [appState, mediaData]);

  const handleReset = () => {
    setAppState('idle');
    setMediaData(null);
    setResult(null);
    setInvestigationStage(0);
  };

  return (
    <>
      <header style={{ 
        position: 'sticky', top: 0, zIndex: 10, 
        backgroundColor: 'rgba(5, 5, 5, 0.8)', 
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '1rem 0'
      }}>
        <div className="container flex justify-between items-center">
          <div 
            className="flex items-center gap-2" 
            style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '0.05em', cursor: 'pointer', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}
            onClick={handleReset}
          >
            Authentiq
          </div>
          <nav className="flex gap-8" style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
            <button onClick={handleReset} style={{ color: 'var(--text-primary)', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600 }} className="hover:text-primary transition-colors">Home</button>
          </nav>
        </div>
      </header>

      <main>
        <AnimatePresence mode="wait">
          {appState === 'idle' && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Hero />
              <MediaUploader onInvestigate={handleInvestigate} />
            </motion.div>
          )}

          {appState === 'investigating' && (
            <motion.div 
              key="investigating"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <InvestigationProcess 
                currentStage={investigationStage}
              />
            </motion.div>
          )}

          {appState === 'results' && result && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ResultsDashboard onReset={handleReset} result={result} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}

export default App;
