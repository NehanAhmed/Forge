
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
type RelationType = 'one-to-one' | 'one-to-many' | 'many-to-many' | 'many-to-one'; // Added many-to-one

// Database Schema Types
interface ForeignKey {
  table: string;
  column: string;
}

interface DatabaseColumn {
  name: string;
  type: string;
  nullable: boolean; // Made required (always present in AI response)
  primaryKey?: boolean;
  foreignKey?: ForeignKey;
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

// Input interface for the project data
export interface AIRequest {
  title: string;
  description: string;
  problemStatement: string;
  targetUsers?: number | null;
  teamSize?: number | null;
  timelineWeeks?: number | null;
  budgetRange?: string | null;
}

// Enhanced type guard with detailed validation
export function isValidAIProjectPlanResponse(data: any): data is AIProjectPlanResponse {
  try {
    // Metadata validation
    if (!data.metadata || typeof data.metadata !== 'object') return false;
    if (typeof data.metadata.confidenceScore !== 'number' || 
        data.metadata.confidenceScore < 0 || 
        data.metadata.confidenceScore > 100) return false;
    if (!['basic', 'detailed', 'comprehensive'].includes(data.metadata.analysisDepth)) return false;
    if (typeof data.metadata.generatedAt !== 'string') return false;
    if (!Array.isArray(data.metadata.adjustmentsMade)) return false;

    // Tech Stack validation
    if (!data.techStack || typeof data.techStack !== 'object') return false;
    if (typeof data.techStack.rationale !== 'string') return false;

    // Database Schema validation
    if (!data.databaseSchema || typeof data.databaseSchema !== 'object') return false;
    if (!Array.isArray(data.databaseSchema.tables)) return false;
    if (!Array.isArray(data.databaseSchema.relationships)) return false;

    // Validate tables structure
    for (const table of data.databaseSchema.tables) {
      if (!table.name || !Array.isArray(table.columns)) return false;
      for (const column of table.columns) {
        if (!column.name || !column.type || typeof column.nullable !== 'boolean') return false;
      }
    }

    // Risks validation
    if (!Array.isArray(data.risks) || data.risks.length === 0) return false;
    for (const risk of data.risks) {
      if (!risk.title || !risk.description || !risk.severity || !risk.mitigation || !risk.category) return false;
    }

    // Roadmap validation
    if (!data.roadmap || typeof data.roadmap !== 'object') return false;
    if (typeof data.roadmap.adjustedTimelineWeeks !== 'number') return false;
    if (!Array.isArray(data.roadmap.phases) || data.roadmap.phases.length === 0) return false;
    for (const phase of data.roadmap.phases) {
      if (!phase.name || !phase.duration || !Array.isArray(phase.tasks) || 
          !Array.isArray(phase.deliverables) || !Array.isArray(phase.skillsRequired)) return false;
    }

    // Key Features validation
    if (!Array.isArray(data.keyFeatures) || data.keyFeatures.length === 0) return false;
    for (const feature of data.keyFeatures) {
      if (!feature.feature || !feature.description || !feature.priority || 
          !feature.complexity || typeof feature.estimatedDays !== 'number') return false;
    }

    // Executive Summary validation
    if (typeof data.executiveSummary !== 'string' || data.executiveSummary.length === 0) return false;

    return true;
  } catch (error) {
    return false;
  }
}

// Result type for parsing
export type ParsedProjectPlan = 
  | { success: true; data: AIProjectPlanResponse }
  | { success: false; error: string };

// Safe parser function with detailed error messages
export function parseAIResponse(jsonString: string): ParsedProjectPlan {
  try {
    // First, try to parse the JSON
    const parsed = JSON.parse(jsonString);
    
    // Then validate the structure
    if (isValidAIProjectPlanResponse(parsed)) {
      return { success: true, data: parsed };
    }
    
    // If validation fails, provide details about what's missing
    const missingFields: string[] = [];
    
    if (!parsed.metadata) missingFields.push('metadata');
    if (!parsed.techStack) missingFields.push('techStack');
    if (!parsed.databaseSchema) missingFields.push('databaseSchema');
    if (!parsed.risks || !Array.isArray(parsed.risks)) missingFields.push('risks');
    if (!parsed.roadmap) missingFields.push('roadmap');
    if (!parsed.keyFeatures || !Array.isArray(parsed.keyFeatures)) missingFields.push('keyFeatures');
    if (!parsed.executiveSummary) missingFields.push('executiveSummary');
    
    return { 
      success: false, 
      error: `Invalid response structure. Missing or invalid fields: ${missingFields.join(', ')}` 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? `JSON Parse Error: ${error.message}` : 'Failed to parse JSON' 
    };
  }
}

// Utility functions for working with the response
export const AIResponseUtils = {
  // Get total estimated development days
  getTotalEstimatedDays: (plan: AIProjectPlanResponse): number => {
    return plan.keyFeatures.reduce((total, feature) => total + feature.estimatedDays, 0);
  },

  // Get features by priority
  getFeaturesByPriority: (plan: AIProjectPlanResponse, priority: PriorityLevel): KeyFeature[] => {
    return plan.keyFeatures.filter(f => f.priority === priority);
  },

  // Get risks by severity
  getRisksBySeverity: (plan: AIProjectPlanResponse, severity: SeverityLevel): Risk[] => {
    return plan.risks.filter(r => r.severity === severity);
  },

  // Get critical and high severity risks
  getCriticalRisks: (plan: AIProjectPlanResponse): Risk[] => {
    return plan.risks.filter(r => r.severity === 'Critical' || r.severity === 'High');
  },

  // Get risks by category
  getRisksByCategory: (plan: AIProjectPlanResponse, category: RiskCategory): Risk[] => {
    return plan.risks.filter(r => r.category === category);
  },

  // Get total weeks from all phases
  getTotalPhaseWeeks: (plan: AIProjectPlanResponse): number => {
    return plan.roadmap.phases.reduce((total, phase) => {
      const weeks = parseInt(phase.duration.match(/\d+/)?.[0] || '0');
      return total + weeks;
    }, 0);
  },

  // Check if adjustments were made
  hasAdjustments: (plan: AIProjectPlanResponse): boolean => {
    return plan.metadata.adjustmentsMade.length > 0;
  },

  // Get confidence level as a string
  getConfidenceLevel: (plan: AIProjectPlanResponse): 'Excellent' | 'Good' | 'Fair' | 'Poor' => {
    const score = plan.metadata.confidenceScore;
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  },

  // Format for database insertion
  formatForDatabase: (plan: AIProjectPlanResponse) => {
    return {
      techStack: plan.techStack,
      databaseSchema: plan.databaseSchema,
      risks: plan.risks,
      roadmap: plan.roadmap,
      keyFeatures: plan.keyFeatures,
      // You can add metadata as a separate field if needed
      metadata: plan.metadata,
      executiveSummary: plan.executiveSummary,
    };
  }
};