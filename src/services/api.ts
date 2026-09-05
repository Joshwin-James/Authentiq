/**
 * @fileoverview API service for the Authentiq media investigation pipeline.
 * Handles stage-by-stage progress animation and communication with the backend.
 */

/** Possible verdicts returned by the forensic analysis engine. */
export type VerdictType = 'LIKELY_AUTHENTIC' | 'REQUIRES_VERIFICATION' | 'LIKELY_MANIPULATED';

/** Severity level of an individual forensic finding. */
export type SeverityType = 'high' | 'medium' | 'low';

/** Type of media being analyzed. */
export type MediaType = 'image' | 'video' | 'audio' | 'url';

/** A single forensic finding produced by the AI analysis engine. */
export interface Finding {
  id: string;
  title: string;
  category: 'AI Analysis' | 'Visual/Technical Inconsistencies' | 'Source/Context Investigation';
  severity: SeverityType;
  /** Confidence score for this specific finding (0–100). */
  confidence: number;
  explanation: string;
  evidence: string;
  limitations: string;
}

/** Probability scores across four forensic dimensions (0–100 each). */
export interface TechnicalIndicators {
  /** Probability that the media was AI-generated. */
  aiGeneration: number;
  /** Probability of manual editing or Photoshop manipulation. */
  manipulation: number;
  /** Reliability score of the source context. */
  sourceReliability: number;
  /** Consistency of the media content with its claimed context. */
  contextConsistency: number;
}

/** A matching or related source discovered during investigation. */
export interface SourceItem {
  id: string;
  name: string;
  date: string;
  relationship: 'Same image' | 'Similar image' | 'Same claim' | 'Different context' | string;
  relevance: string;
  link?: string;
}

/** A timestamped event in the media's provenance timeline. */
export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  /** Whether this event represents a factual or contextual discrepancy. */
  isDiscrepancy: boolean;
}

/** Details about the earliest known appearance of the media online. */
export interface EarliestAppearance {
  date: string;
  source: string;
  thumbnailUrl: string;
  description: string;
  confidence: number;
}

/** Comparison between the current claimed context and the earliest known source context. */
export interface ContextComparison {
  currentClaim: string;
  earlierSource: string;
  differenceHighlight: string;
}

/** File or URL metadata extracted during investigation. */
export interface MediaMetadata {
  extracted: boolean;
  properties: Record<string, string>;
}

/** Full investigation result returned by the backend. */
export interface InvestigationResult {
  mediaType: MediaType;
  verdict: VerdictType;
  /** Overall confidence in the verdict (0–100). */
  confidence: number;
  explanation: string;
  findings: Finding[];
  technicalIndicators: TechnicalIndicators;
  metadata: MediaMetadata;
  sources: SourceItem[];
  timeline: TimelineEvent[];
  earliestAppearance: EarliestAppearance;
  contextComparison: ContextComparison;
}

/** Payload describing the media to investigate. */
export interface MediaPayload {
  type: 'file' | 'url';
  value: string;
  fileType?: string;
  file?: File;
}

/** Creates a typed error for investigation-specific failures. */
export const createInvestigationError = (message: string, statusCode?: number): Error & { statusCode?: number } => {
  const err = new Error(message) as Error & { statusCode?: number };
  err.name = 'InvestigationError';
  err.statusCode = statusCode;
  return err;
};

const STAGE_COUNT = 8;
const DELAY_PER_STAGE_MS = 250;

/**
 * Runs the full investigation pipeline for the given media.
 *
 * Fires `onProgress` with stage indices 0–STAGE_COUNT so the UI can animate
 * each step. Resolves with the full {@link InvestigationResult} on success.
 *
 * @param mediaData - The media file or URL to investigate.
 * @param onProgress - Callback invoked with the current stage index.
 * @throws {InvestigationError} If the backend returns a non-OK response.
 */
export const runInvestigation = async (
  mediaData: MediaPayload,
  onProgress: (stageIndex: number) => void
): Promise<InvestigationResult> => {
  // Animate first half of stages while the API call is in flight
  for (let i = 0; i < 4; i++) {
    onProgress(i);
    await new Promise<void>(resolve => setTimeout(resolve, DELAY_PER_STAGE_MS));
  }

  const formData = new FormData();
  if (mediaData.file) {
    formData.append('media', mediaData.file);
  } else {
    formData.append('url', mediaData.value);
  }

  const response = await fetch('/api/investigate', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw createInvestigationError(
      `Investigation request failed (HTTP ${response.status})`,
      response.status
    );
  }

  const result: InvestigationResult = await response.json();

  // Animate remaining stages once data is received
  for (let i = 4; i <= STAGE_COUNT; i++) {
    onProgress(i);
    await new Promise<void>(resolve => setTimeout(resolve, DELAY_PER_STAGE_MS / 2));
  }

  return result;
};
