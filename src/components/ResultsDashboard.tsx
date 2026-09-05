import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VerdictBadge } from './VerdictBadge';
import { AlertCircle, ChevronDown, Activity, Globe, Scale, Fingerprint, CalendarClock, ExternalLink, Info, AlertTriangle } from 'lucide-react';
import type { InvestigationResult, Finding, SeverityType } from '../services/api';

interface ResultsDashboardProps {
  onReset: () => void;
  result: InvestigationResult;
}

const SeverityBadge = ({ severity }: { severity: SeverityType }) => {
  const styles = {
    high: { bg: 'rgba(255, 107, 107, 0.05)', color: 'var(--verdict-manipulated)', border: 'var(--verdict-manipulated-border)' },
    medium: { bg: 'rgba(252, 196, 25, 0.05)', color: 'var(--verdict-verify)', border: 'var(--verdict-verify-border)' },
    low: { bg: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-primary)', border: 'var(--glass-border)' }
  };
  const current = styles[severity];
  
  return (
    <span style={{ 
      backgroundColor: current.bg, color: current.color, border: `1px solid ${current.border}`,
      padding: '0.25rem 0.75rem', borderRadius: '0px', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em'
    }}>
      {severity} Severity
    </span>
  );
};

const FindingCard = ({ item }: { item: Finding }) => {
  const [expanded, setExpanded] = useState(false);

  const getIcon = () => {
    switch (item.category) {
      case 'AI Analysis': return <Fingerprint size={16} className="text-accent" style={{ color: 'var(--text-primary)' }} />;
      case 'Visual/Technical Inconsistencies': return <Activity size={16} style={{ color: 'var(--verdict-verify)' }} />;
      case 'Source/Context Investigation': return <Globe size={16} style={{ color: 'var(--text-secondary)' }} />;
    }
  };

  return (
    <div style={{ backgroundColor: 'transparent', borderRadius: '0', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem' }}>
        <div className="flex justify-between items-start" style={{ marginBottom: '1.5rem' }}>
          <div className="flex items-center gap-3">
            <div style={{ padding: '0.5rem', border: '1px solid var(--border-subtle)', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '0' }}>
              {getIcon()}
            </div>
            <div>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.category}</p>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: '0.25rem' }}>{item.title}</h4>
            </div>
          </div>
          <SeverityBadge severity={item.severity} />
        </div>
        
        <p style={{ color: 'var(--text-primary)', lineHeight: 1.6, fontSize: '0.875rem' }}>{item.explanation}</p>
      </div>

      <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between" 
          style={{ width: '100%', padding: '1rem 1.5rem', backgroundColor: 'transparent' }}
        >
          <span className="flex items-center gap-2" style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
            <Info size={14} /> Explain this
          </span>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }}><ChevronDown size={14} /></motion.div>
        </button>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div className="flex flex-col gap-6" style={{ padding: '0 1.5rem 1.5rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ marginTop: '1rem' }}>
                  <p style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>WHAT WE FOUND</p>
                  <p style={{ color: 'var(--text-primary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{item.explanation}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>WHY IT MATTERS</p>
                  <p style={{ color: 'var(--text-primary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{item.evidence}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>HOW STRONG THE EVIDENCE IS</p>
                  <p style={{ color: 'var(--text-primary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{item.confidence}% confidence. {item.severity === 'high' ? 'Strong' : 'Moderate'} indicator.</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--verdict-manipulated)', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>WHAT IT DOES NOT PROVE</p>
                  <p style={{ color: 'var(--text-primary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{item.limitations}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const IndicatorBar = ({ label, value, type }: { label: string, value: number, type: 'danger' | 'warning' | 'safe' | 'neutral' }) => {
  const getColor = () => {
    if (type === 'danger') return 'var(--verdict-manipulated)';
    if (type === 'warning') return 'var(--verdict-verify)';
    if (type === 'safe') return 'var(--text-secondary)';
    return 'var(--text-primary)';
  };
  
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between" style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span className="text-mono" style={{ letterSpacing: '0' }}>{value}%</span>
      </div>
      <div style={{ width: '100%', height: '2px', backgroundColor: 'var(--border-subtle)', overflow: 'hidden' }}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{ height: '100%', backgroundColor: getColor() }}
        />
      </div>
    </div>
  );
};

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ onReset, result }) => {
  return (
    <div className="container" style={{ padding: '2rem 0 6rem 0' }}>
      
      {/* Top Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center text-center" 
        style={{ padding: '4rem 2rem', marginBottom: '3rem', position: 'relative', border: '1px solid var(--border-subtle)' }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', backgroundColor: 'var(--text-primary)' }}></div>
        
        <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.75rem', marginBottom: '2rem', fontWeight: 600 }}>
          Final Assessment
        </p>
        
        <div className="flex items-center gap-6" style={{ marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ transform: 'scale(1.2)' }}>
            <VerdictBadge verdict={result.verdict} />
          </div>
          <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--border-subtle)' }} className="hidden md:block"></div>
          <div className="text-mono flex flex-col items-start" style={{ textAlign: 'left' }}>
            <span style={{ fontSize: '3.5rem', fontWeight: 300, lineHeight: 1, color: 'var(--text-primary)' }}>{result.confidence}%</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.5rem', fontWeight: 600 }}>Overall Confidence</span>
          </div>
        </div>

        <p style={{ fontSize: '1.1rem', maxWidth: '800px', lineHeight: 1.8, color: 'var(--text-primary)', fontWeight: 600, fontFamily: 'var(--font-primary)' }}>
          "{result.explanation}"
        </p>
      </motion.div>

      <div className="flex gap-12" style={{ flexWrap: 'wrap' }}>
        
        {/* Main Content Column */}
        <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          
          {/* Evidence Summary */}
          <section>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '2rem', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Scale size={20} style={{ color: 'var(--text-primary)' }} /> 
              Evidence Summary
            </h3>
            <div className="flex flex-col gap-6">
              {result.findings.map(item => (
                <FindingCard key={item.id} item={item} />
              ))}
            </div>
          </section>

          {/* Source Investigation */}
          <section>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '2rem', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Globe size={20} style={{ color: 'var(--text-primary)' }} /> 
              Source Investigation
            </h3>

            {/* Earliest Known Appearance */}
            <div style={{ padding: '2rem', marginBottom: '2rem', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
                Earliest Known Appearance
              </h4>
              <div className="flex gap-6 items-center" style={{ flexWrap: 'wrap' }}>
                <img src={result.earliestAppearance.thumbnailUrl} alt="Thumbnail" style={{ width: '160px', height: '100px', objectFit: 'cover', borderRadius: '0', border: '1px solid var(--border-subtle)' }} />
                <div className="flex flex-col justify-center flex-1">
                  <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                    <span className="text-mono" style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>{result.earliestAppearance.date}</span>
                    <span className="text-mono" style={{ fontSize: '0.65rem', border: '1px solid var(--border-subtle)', padding: '0.25rem 0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      {result.earliestAppearance.confidence}% Match
                    </span>
                  </div>
                  <h5 style={{ fontWeight: 600, fontSize: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{result.earliestAppearance.source}</h5>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{result.earliestAppearance.description}</p>
                </div>
              </div>
            </div>

            {/* Context Comparison */}
            <h4 style={{ fontSize: '1rem', marginBottom: '1.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Context Comparison</h4>
            <div className="flex" style={{ border: '1px solid var(--border-subtle)', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 250px', padding: '2rem', borderRight: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>CURRENT CLAIM</span>
                <p style={{ marginTop: '1rem', color: 'var(--text-primary)', lineHeight: 1.6, fontStyle: 'italic', fontFamily: 'var(--font-heading)' }}>"{result.contextComparison.currentClaim}"</p>
              </div>
              <div style={{ flex: '1 1 250px', padding: '2rem', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.1em' }}>EARLIER SOURCE</span>
                <p style={{ marginTop: '1rem', color: 'var(--text-primary)', lineHeight: 1.6, fontStyle: 'italic', fontFamily: 'var(--font-heading)' }}>"{result.contextComparison.earlierSource}"</p>
              </div>
            </div>
            
            <div style={{ padding: '1.5rem', backgroundColor: 'rgba(255,107,107,0.05)', borderLeft: '2px solid var(--verdict-manipulated)', marginBottom: '4rem' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--verdict-manipulated)', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem' }}>
                <AlertTriangle size={12} style={{ display: 'inline', marginRight: '6px', position: 'relative', top: '-1px' }}/> DISCREPANCY DETECTED
              </span>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>{result.contextComparison.differenceHighlight}</p>
            </div>

            {/* Timeline */}
            <h4 style={{ fontSize: '1rem', marginBottom: '2rem', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CalendarClock size={16} style={{ color: 'var(--text-primary)' }} /> Source Timeline
            </h4>
            
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.15 } }
              }}
              style={{ padding: '2rem', border: '1px solid var(--border-subtle)' }}>
              <div style={{ position: 'relative', paddingLeft: '2rem', borderLeft: '1px solid var(--border-subtle)', marginLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                
                {result.timeline.map((event) => (
                  <motion.div 
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
                    }}
                    key={event.id} style={{ position: 'relative' }}>
                    <div style={{ 
                      position: 'absolute', left: '-2.35rem', top: '0', width: '10px', height: '10px', 
                      border: '1px solid var(--bg-primary)',
                      backgroundColor: event.isDiscrepancy ? 'var(--verdict-manipulated)' : 'var(--text-primary)' 
                    }}></div>
                    
                    <p className="text-mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>{event.date}</p>
                    <h4 style={{ fontWeight: 600, fontSize: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {event.title}
                      {event.isDiscrepancy && <AlertCircle size={14} style={{ color: 'var(--verdict-manipulated)' }} />}
                    </h4>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.875rem' }}>{event.description}</p>
                  </motion.div>
                ))}
                
              </div>
            </motion.div>
          </section>

        </div>

        {/* Sidebar Column */}
        <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          
          {/* Analysis Breakdown */}
          <section>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '2rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Analysis Breakdown</h3>
            <div className="flex-col gap-8" style={{ padding: '2rem', display: 'flex', border: '1px solid var(--border-subtle)' }}>
              <IndicatorBar label="AI Generation Indicators" value={result.technicalIndicators.aiGeneration} type={result.technicalIndicators.aiGeneration > 50 ? 'danger' : 'safe'} />
              <IndicatorBar label="Manipulation Indicators" value={result.technicalIndicators.manipulation} type={result.technicalIndicators.manipulation > 50 ? 'danger' : 'safe'} />
              <IndicatorBar label="Context Consistency" value={result.technicalIndicators.contextConsistency} type={result.technicalIndicators.contextConsistency < 50 ? 'warning' : 'safe'} />
              <IndicatorBar label="Source Reliability" value={result.technicalIndicators.sourceReliability} type={result.technicalIndicators.sourceReliability < 50 ? 'warning' : 'safe'} />
            </div>
          </section>

        </div>
      </div>

      {/* Bottom Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex flex-col items-center text-center" 
        style={{ padding: '4rem 2rem', marginTop: '6rem' }}
      >
        <AlertTriangle size={24} style={{ color: 'var(--text-primary)', marginBottom: '1.5rem' }} />
        <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Make your own decision</h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '3rem', fontSize: '0.875rem', lineHeight: 1.6 }}>
          Authentiq provides evidence and probability-based analysis. It does not guarantee authenticity. Review the evidence carefully before trusting or sharing this media.
        </p>
        <div className="flex gap-6">
          <button className="btn-primary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ borderRadius: '0', padding: '0.75rem 1.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.65rem' }}>
            Review Evidence Above
          </button>
          <button className="btn-secondary" onClick={onReset} style={{ borderRadius: '0', padding: '0.75rem 1.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.65rem' }}>
            Investigate Another
          </button>
        </div>
      </motion.div>

    </div>
  );
};

