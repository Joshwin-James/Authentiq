export type VerdictType = 'LIKELY_AUTHENTIC' | 'REQUIRES_VERIFICATION' | 'LIKELY_MANIPULATED';
export type SeverityType = 'high' | 'medium' | 'low';
export type MediaType = 'image' | 'video' | 'audio' | 'url';

export interface Finding {
  id: string;
  title: string;
  category: 'AI Analysis' | 'Visual/Technical Inconsistencies' | 'Source/Context Investigation';
  severity: SeverityType;
  confidence: number;
  explanation: string;
  evidence: string;
  limitations: string;
}

export interface TechnicalIndicators {
  aiGeneration: number; // 0-100 probability
  manipulation: number;
  sourceReliability: number;
  contextConsistency: number;
}

export interface SourceItem {
  id: string;
  name: string;
  date: string;
  relationship: 'Same image' | 'Similar image' | 'Same claim' | 'Different context' | string;
  relevance: string;
  link?: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  isDiscrepancy: boolean;
}

export interface EarliestAppearance {
  date: string;
  source: string;
  thumbnailUrl: string; // mock
  description: string;
  confidence: number;
}

export interface ContextComparison {
  currentClaim: string;
  earlierSource: string;
  differenceHighlight: string;
}

export interface Metadata {
  date: string;
  camera: string;
  location: string;
}

export interface InvestigationResult {
  mediaType: MediaType;
  verdict: VerdictType;
  confidence: number;
  explanation: string;
  findings: Finding[];
  technicalIndicators: TechnicalIndicators;
  metadata: Metadata;
  sources: SourceItem[];
  timeline: TimelineEvent[];
  earliestAppearance: EarliestAppearance;
  contextComparison: ContextComparison;
}

export const runInvestigation = async (
  mediaData: { type: 'file' | 'url'; value: string; fileType?: string; file?: File },
  onProgress: (stageIndex: number) => void
): Promise<InvestigationResult> => {
  console.log("Starting investigation for:", mediaData.value);
  const STAGE_COUNT = 8;
  const DELAY_PER_STAGE = 250; // Massively reduced delay to speed up the investigation process

  // Start progress animation
  for (let i = 0; i < 4; i++) {
    onProgress(i);
    await new Promise(resolve => setTimeout(resolve, DELAY_PER_STAGE));
  }

  // Make the actual API call
  try {
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
      throw new Error(`API Error: ${response.statusText}`);
    }

    const result = await response.json();

    // Finish progress animation
    for (let i = 4; i <= STAGE_COUNT; i++) {
      onProgress(i);
      await new Promise(resolve => setTimeout(resolve, DELAY_PER_STAGE / 2));
    }

    return result as InvestigationResult;
  } catch (error) {
    console.error("Investigation failed", error);
    throw error;
  }
};
