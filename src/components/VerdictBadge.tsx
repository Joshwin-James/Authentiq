import React, { memo } from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import type { VerdictType } from '../services/api';

interface VerdictBadgeProps {
  verdict: VerdictType;
  showIcon?: boolean;
}

/** Maps a verdict string to a human-readable label. */
export const getVerdictLabel = (verdict: VerdictType): string => {
  switch (verdict) {
    case 'LIKELY_AUTHENTIC': return 'Likely Authentic';
    case 'REQUIRES_VERIFICATION': return 'Requires Verification';
    case 'LIKELY_MANIPULATED': return 'Likely Manipulated';
  }
};

/**
 * Displays a colour-coded badge representing the AI's forensic verdict.
 * Uses memo to avoid unnecessary re-renders when parent state changes.
 */
export const VerdictBadge: React.FC<VerdictBadgeProps> = memo(({ verdict, showIcon = true }) => {
  const getStyles = () => {
    switch (verdict) {
      case 'LIKELY_AUTHENTIC':
        return {
          color: 'var(--verdict-authentic)',
          backgroundColor: 'var(--verdict-authentic-bg)',
          borderColor: 'var(--verdict-authentic-border)',
          icon: <CheckCircle size={16} aria-hidden="true" />
        };
      case 'REQUIRES_VERIFICATION':
        return {
          color: 'var(--verdict-verify)',
          backgroundColor: 'var(--verdict-verify-bg)',
          borderColor: 'var(--verdict-verify-border)',
          icon: <AlertTriangle size={16} aria-hidden="true" />
        };
      case 'LIKELY_MANIPULATED':
        return {
          color: 'var(--verdict-manipulated)',
          backgroundColor: 'var(--verdict-manipulated-bg)',
          borderColor: 'var(--verdict-manipulated-border)',
          icon: <XCircle size={16} aria-hidden="true" />
        };
    }
  };

  const styles = getStyles();
  const label = getVerdictLabel(verdict);

  return (
    <div
      role="status"
      aria-label={`Verdict: ${label}`}
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
      <span>{label}</span>
    </div>
  );
});

VerdictBadge.displayName = 'VerdictBadge';
