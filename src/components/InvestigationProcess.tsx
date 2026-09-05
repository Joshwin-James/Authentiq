import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

interface InvestigationProcessProps {
  currentStage: number;
}

export const InvestigationProcess: React.FC<InvestigationProcessProps> = ({ currentStage }) => {
  const stages = [
    "Media received",
    "Extracting media metadata",
    "Analyzing visual/audio/video patterns",
    "Detecting possible synthetic or manipulation indicators",
    "Investigating source information",
    "Searching for contextual inconsistencies",
    "Comparing discovered evidence",
    "Generating the final assessment"
  ];

  return (
    <div className="container flex flex-col items-center justify-center" style={{ minHeight: '70vh', padding: '4rem 0' }}>
      
      <div style={{ padding: '4rem', width: '100%', maxWidth: '700px', border: '1px solid var(--border-subtle)' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '3rem', textAlign: 'center', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Conducting Investigation
        </h2>
        
        <div className="flex flex-col gap-6">
          <AnimatePresence>
            {stages.map((stage, index) => {
              const isCompleted = currentStage > index;
              const isProcessing = currentStage === index;
              const isPending = currentStage < index;
              
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: isPending ? 0.3 : 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-6"
                  style={{ 
                    padding: '1rem', 
                    border: isProcessing ? '1px solid var(--border-subtle)' : '1px solid transparent',
                    backgroundColor: isProcessing ? 'rgba(255,255,255,0.02)' : 'transparent'
                  }}
                >
                  <div style={{ width: '24px', display: 'flex', justifyContent: 'center' }}>
                    {isCompleted && <CheckCircle2 size={16} style={{ color: 'var(--text-primary)' }} />}
                    {isProcessing && <Loader2 size={16} className="animate-spin" style={{ color: 'var(--text-primary)' }} />}
                    {isPending && <Circle size={16} style={{ color: 'var(--text-muted)' }} />}
                  </div>
                  
                  <span style={{ 
                    fontSize: '0.75rem', 
                    color: isCompleted ? 'var(--text-secondary)' : isProcessing ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontWeight: isProcessing ? 600 : 400,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase'
                  }}>
                    {stage}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
      
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .animate-spin { animation: spin 2s linear infinite; }
      `}</style>
    </div>
  );
};
