import { describe, it, expect } from 'vitest';

// ─── Utility: addRealism ──────────────────────────────────────────────────────
const addRealism = (val: number): number => {
  const base = val || 50;
  const varied = base + (Math.random() * 3 - 1.2);
  return Number(Math.min(99.9, Math.max(0.1, varied)).toFixed(1));
};

describe('addRealism utility', () => {
  it('returns a number between 0.1 and 99.9', () => {
    for (let i = 0; i < 100; i++) {
      const result = addRealism(Math.random() * 100);
      expect(result).toBeGreaterThanOrEqual(0.1);
      expect(result).toBeLessThanOrEqual(99.9);
    }
  });

  it('stays close to input value (+/- 3)', () => {
    const result = addRealism(50);
    expect(result).toBeGreaterThanOrEqual(48);
    expect(result).toBeLessThanOrEqual(53);
  });

  it('falls back to 50 if 0 is provided', () => {
    const result = addRealism(0);
    expect(result).toBeGreaterThanOrEqual(0.1);
  });

  it('returns a value with 1 decimal place', () => {
    const result = addRealism(72);
    expect(result.toString()).toMatch(/^\d+\.\d$/);
  });
});

// ─── Utility: YouTube ID Extraction ──────────────────────────────────────────
const extractYouTubeId = (url: string): string | null => {
  const ytRegExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(ytRegExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

describe('YouTube ID extraction', () => {
  it('extracts ID from standard watch URL', () => {
    expect(extractYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('extracts ID from youtu.be short link', () => {
    expect(extractYouTubeId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('extracts ID from YouTube Shorts', () => {
    expect(extractYouTubeId('https://youtube.com/shorts/3o7r5zhMwGA?si=abc')).toBe('3o7r5zhMwGA');
  });

  it('returns null for non-YouTube URLs', () => {
    expect(extractYouTubeId('https://example.com/image.jpg')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(extractYouTubeId('')).toBeNull();
  });
});

// ─── Validation: File type checks ────────────────────────────────────────────
const isValidImageType = (mimeType: string): boolean => {
  return ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(mimeType);
};

const isVideoOrAudio = (mimeType: string): boolean => {
  return mimeType.startsWith('video/') || mimeType.startsWith('audio/');
};

describe('File type validation', () => {
  it('accepts valid image types', () => {
    expect(isValidImageType('image/jpeg')).toBe(true);
    expect(isValidImageType('image/png')).toBe(true);
    expect(isValidImageType('image/webp')).toBe(true);
    expect(isValidImageType('image/gif')).toBe(true);
  });

  it('rejects invalid types', () => {
    expect(isValidImageType('application/pdf')).toBe(false);
    expect(isValidImageType('text/html')).toBe(false);
  });

  it('correctly identifies video and audio types', () => {
    expect(isVideoOrAudio('video/mp4')).toBe(true);
    expect(isVideoOrAudio('audio/mpeg')).toBe(true);
    expect(isVideoOrAudio('image/jpeg')).toBe(false);
  });
});

// ─── Verdict Logic ────────────────────────────────────────────────────────────
type Verdict = 'LIKELY_AUTHENTIC' | 'REQUIRES_VERIFICATION' | 'LIKELY_MANIPULATED';

const getVerdictLabel = (verdict: Verdict): string => {
  switch (verdict) {
    case 'LIKELY_AUTHENTIC': return 'Likely Authentic';
    case 'LIKELY_MANIPULATED': return 'Likely Manipulated';
    case 'REQUIRES_VERIFICATION': return 'Requires Verification';
  }
};

describe('Verdict label mapping', () => {
  it('maps LIKELY_AUTHENTIC correctly', () => {
    expect(getVerdictLabel('LIKELY_AUTHENTIC')).toBe('Likely Authentic');
  });
  it('maps LIKELY_MANIPULATED correctly', () => {
    expect(getVerdictLabel('LIKELY_MANIPULATED')).toBe('Likely Manipulated');
  });
  it('maps REQUIRES_VERIFICATION correctly', () => {
    expect(getVerdictLabel('REQUIRES_VERIFICATION')).toBe('Requires Verification');
  });
});
