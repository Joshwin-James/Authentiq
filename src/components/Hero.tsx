import React from 'react';
import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
  return (
    <section className="flex flex-col items-center justify-center text-center" style={{ padding: '8rem 0', minHeight: '70vh' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          I am
        </div>
        <h1 style={{ fontSize: '7rem', marginBottom: '4rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', lineHeight: 1 }}>
          Authentiq
        </h1>
        <div className="flex items-center justify-center gap-4" style={{ marginBottom: '4rem' }}>
          <button className="btn-primary" onClick={() => document.getElementById('uploader')?.scrollIntoView({ behavior: 'smooth' })} style={{ borderRadius: '2px', padding: '1rem 2rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.75rem' }}>
            Investigate Media
          </button>
        </div>
      </motion.div>
    </section>
  );
};
