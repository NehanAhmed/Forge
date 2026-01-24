
export interface AIRequest {
  title: string
  description: string
  problemStatement: string
  targetUsers?: number | null
  teamSize?: number | null
  timelineWeeks?: number | null
  budgetRange?: string | null
}



// Base types for reusability
type PriorityLevel = 'P0' | 'P1' | 'P2';
type ComplexityLevel = 'Low' | 'Medium' | 'High';
type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low';
type RiskCategory = 'Technical' | 'Business' | 'Timeline' | 'Budget' | 'Team';
type AnalysisDepth = 'basic' | 'detailed' | 'comprehensive';
type RelationType = 'one-to-one' | 'one-to-many' | 'many-to-many';

// Database Schema Types
interface DatabaseColumn {
  name: string;
  type: string;
  nullable?: boolean;
  primaryKey?: boolean;
  foreignKey?: {
    table: string;
    column: string;
  };
}

interface DatabaseTable {
  name: string;
  columns: DatabaseColumn[];
}

interface DatabaseRelationship {
  from: string;
  to: string;
  type: RelationType;
}

interface DatabaseSchema {
  tables: DatabaseTable[];
  relationships: DatabaseRelationship[];
}

// Tech Stack
interface TechStack {
  frontend?: string[];
  backend?: string[];
  database?: string[];
  devops?: string[];
  rationale: string;
}

// Risks
interface Risk {
  title: string;
  description: string;
  severity: SeverityLevel;
  mitigation: string;
  category: RiskCategory;
}

// Roadmap
interface RoadmapPhase {
  name: string;
  duration: string;
  tasks: string[];
  deliverables: string[];
  skillsRequired: string[];
}

interface Roadmap {
  adjustedTimelineWeeks: number;
  phases: RoadmapPhase[];
}

// Key Features
interface KeyFeature {
  feature: string;
  description: string;
  priority: PriorityLevel;
  complexity: ComplexityLevel;
  estimatedDays: number;
}

// Metadata
interface PlanMetadata {
  confidenceScore: number; // 0-100
  analysisDepth: AnalysisDepth;
  generatedAt: string; // ISO 8601 timestamp
  adjustmentsMade: string[];
}

// Main AI Response Interface
export interface AIProjectPlanResponse {
  metadata: PlanMetadata;
  techStack: TechStack;
  databaseSchema: DatabaseSchema;
  risks: Risk[];
  roadmap: Roadmap;
  keyFeatures: KeyFeature[];
  executiveSummary: string;
}


// Optional: Type guard for runtime validation
export function isValidAIProjectPlanResponse(data: any): data is AIProjectPlanResponse {
  return (
    data &&
    typeof data === 'object' &&
    // Metadata checks
    data.metadata &&
    typeof data.metadata.confidenceScore === 'number' &&
    data.metadata.confidenceScore >= 0 &&
    data.metadata.confidenceScore <= 100 &&
    ['basic', 'detailed', 'comprehensive'].includes(data.metadata.analysisDepth) &&
    typeof data.metadata.generatedAt === 'string' &&
    Array.isArray(data.metadata.adjustmentsMade) &&
    // Tech Stack checks
    data.techStack &&
    typeof data.techStack.rationale === 'string' &&
    // Database Schema checks
    data.databaseSchema &&
    Array.isArray(data.databaseSchema.tables) &&
    Array.isArray(data.databaseSchema.relationships) &&
    // Risks checks
    Array.isArray(data.risks) &&
    data.risks.length > 0 &&
    // Roadmap checks
    data.roadmap &&
    typeof data.roadmap.adjustedTimelineWeeks === 'number' &&
    Array.isArray(data.roadmap.phases) &&
    data.roadmap.phases.length > 0 &&
    // Key Features checks
    Array.isArray(data.keyFeatures) &&
    data.keyFeatures.length > 0 &&
    // Executive Summary check
    typeof data.executiveSummary === 'string' &&
    data.executiveSummary.length > 0
  );
}

// Optional: Helper type for parsing and validation
export type ParsedProjectPlan =
  | { success: true; data: AIProjectPlanResponse }
  | { success: false; error: string };

// Optional: Safe parser function
export function parseAIResponse(jsonString: string): ParsedProjectPlan {
  try {
    const parsed = JSON.parse(jsonString);

    if (isValidAIProjectPlanResponse(parsed)) {
      return { success: true, data: parsed };
    }

    return {
      success: false,
      error: 'Invalid response structure from AI'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse JSON'
    };
  }
}