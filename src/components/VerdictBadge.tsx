import React from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import type { VerdictType } from '../services/api';

interface VerdictBadgeProps {
  verdict: VerdictType;
  showIcon?: boolean;
}

export const VerdictBadge: React.FC<VerdictBadgeProps> = ({ verdict, showIcon = true }) => {
  const getStyles = () => {
    switch (verdict) {
      case 'LIKELY_AUTHENTIC':
        return {
          color: 'var(--verdict-authentic)',
          backgroundColor: 'var(--verdict-authentic-bg)',
          borderColor: 'var(--verdict-authentic-border)',
          icon: <CheckCircle size={16} />
        };
      case 'REQUIRES_VERIFICATION':
        return {
          color: 'var(--verdict-verify)',
          backgroundColor: 'var(--verdict-verify-bg)',
          borderColor: 'var(--verdict-verify-border)',
          icon: <AlertTriangle size={16} />
        };
      case 'LIKELY_MANIPULATED':
        return {
          color: 'var(--verdict-manipulated)',
          backgroundColor: 'var(--verdict-manipulated-bg)',
          borderColor: 'var(--verdict-manipulated-border)',
          icon: <XCircle size={16} />
        };
    }
  };

  const styles = getStyles();

  return (
    <div 
      className="flex items-center gap-2" 
      style={{
        display: 'inline-flex',
        padding: '0.5rem 1rem',
        borderRadius: '0px',
        border: `1px solid ${styles.borderColor}`,
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        fontWeight: 600,
        fontSize: '0.75rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase'
      }}
    >
      {showIcon && styles.icon}
      <span>
        {verdict === 'LIKELY_AUTHENTIC' && 'Likely Authentic'}
        {verdict === 'REQUIRES_VERIFICATION' && 'Requires Verification'}
        {verdict === 'LIKELY_MANIPULATED' && 'Likely Manipulated'}
      </span>
    </div>
  );
};
