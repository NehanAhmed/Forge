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

// Utility function to check if a value is one of the allowed enum values
function isOneOf<T extends string>(value: unknown, allowedValues: readonly T[]): value is T {
  return typeof value === 'string' && allowedValues.includes(value as T);
}

// Utility function to validate ISO 8601 date string
function isValidISOString(value: string): boolean {
  if (typeof value !== 'string') return false;
  const date = new Date(value);
  return date instanceof Date && !isNaN(date.getTime()) && date.toISOString() === value;
}

// Utility function to check if array contains only strings
function isStringArray(arr: unknown): arr is string[] {
  return Array.isArray(arr) && arr.every(item => typeof item === 'string');
}

// Enhanced type guard with detailed validation
export function isValidAIProjectPlanResponse(
  data: unknown
): data is AIProjectPlanResponse {
  try {
    if (!data || typeof data !== "object") return false;
    const d = data as Record<string, unknown>;

    // ========== Metadata validation ==========
    if (!d.metadata || typeof d.metadata !== "object") return false;
    const metadata = d.metadata as Record<string, unknown>;
    
    // Validate confidenceScore is a number in [0, 100]
    if (
      typeof metadata.confidenceScore !== "number" ||
      metadata.confidenceScore < 0 ||
      metadata.confidenceScore > 100 ||
      !Number.isFinite(metadata.confidenceScore)
    ) return false;
    
    // Validate analysisDepth is one of the literal strings
    const allowedDepths = ['basic', 'detailed', 'comprehensive'] as const;
    if (!isOneOf(metadata.analysisDepth, allowedDepths)) return false;
    
    // Validate generatedAt is a valid ISO 8601 string
    if (typeof metadata.generatedAt !== "string" || !isValidISOString(metadata.generatedAt)) {
      return false;
    }
    
    // Validate adjustmentsMade is an array of strings
    if (!isStringArray(metadata.adjustmentsMade)) return false;

    // ========== Tech Stack validation ==========
    if (!d.techStack || typeof d.techStack !== "object") return false;
    const techStack = d.techStack as Record<string, unknown>;
    
    // Validate rationale is a string
    if (typeof techStack.rationale !== "string" || techStack.rationale.length === 0) {
      return false;
    }
    
    // Validate optional arrays if present
    if (techStack.frontend !== undefined && !isStringArray(techStack.frontend)) return false;
    if (techStack.backend !== undefined && !isStringArray(techStack.backend)) return false;
    if (techStack.database !== undefined && !isStringArray(techStack.database)) return false;
    if (techStack.devops !== undefined && !isStringArray(techStack.devops)) return false;

    // ========== Database Schema validation ==========
    if (!d.databaseSchema || typeof d.databaseSchema !== "object") return false;
    const databaseSchema = d.databaseSchema as Record<string, unknown>;
    
    // Validate tables array
    if (!Array.isArray(databaseSchema.tables)) return false;
    
    // Validate each table structure
    for (const table of databaseSchema.tables) {
      if (!table || typeof table !== "object") return false;
      const t = table as Record<string, unknown>;
      
      // Validate table name is a string
      if (typeof t.name !== "string" || t.name.length === 0) return false;
      
      // Validate columns array
      if (!Array.isArray(t.columns)) return false;
      
      for (const column of t.columns) {
        if (!column || typeof column !== "object") return false;
        const c = column as Record<string, unknown>;
        
        // Validate column name is a string
        if (typeof c.name !== "string" || c.name.length === 0) return false;
        
        // Validate column type is a string
        if (typeof c.type !== "string" || c.type.length === 0) return false;
        
        // Validate nullable is a boolean
        if (typeof c.nullable !== "boolean") return false;
        
        // Validate optional primaryKey if present
        if (c.primaryKey !== undefined && typeof c.primaryKey !== "boolean") return false;
        
        // Validate optional foreignKey if present
        if (c.foreignKey !== undefined) {
          if (typeof c.foreignKey !== "object" || c.foreignKey === null) return false;
          const fk = c.foreignKey as Record<string, unknown>;
          if (typeof fk.table !== "string" || fk.table.length === 0) return false;
          if (typeof fk.column !== "string" || fk.column.length === 0) return false;
        }
      }
    }
    
    // Validate relationships array
    if (!Array.isArray(databaseSchema.relationships)) return false;
    
    const allowedRelationTypes = ['one-to-one', 'one-to-many', 'many-to-many', 'many-to-one'] as const;
    
    for (const relationship of databaseSchema.relationships) {
      if (!relationship || typeof relationship !== "object") return false;
      const rel = relationship as Record<string, unknown>;
      
      // Validate from is a string
      if (typeof rel.from !== "string" || rel.from.length === 0) return false;
      
      // Validate to is a string
      if (typeof rel.to !== "string" || rel.to.length === 0) return false;
      
      // Validate type is one of the allowed relation types
      if (!isOneOf(rel.type, allowedRelationTypes)) return false;
    }

    // ========== Risks validation ==========
    if (!Array.isArray(d.risks) || d.risks.length === 0) return false;
    
    const allowedSeverities = ['Critical', 'High', 'Medium', 'Low'] as const;
    const allowedCategories = ['Technical', 'Business', 'Timeline', 'Budget', 'Team'] as const;
    
    for (const risk of d.risks) {
      if (!risk || typeof risk !== "object") return false;
      const r = risk as Record<string, unknown>;
      
      // Validate all required string fields
      if (typeof r.title !== "string" || r.title.length === 0) return false;
      if (typeof r.description !== "string" || r.description.length === 0) return false;
      if (typeof r.mitigation !== "string" || r.mitigation.length === 0) return false;
      
      // Validate severity is one of the allowed values
      if (!isOneOf(r.severity, allowedSeverities)) return false;
      
      // Validate category is one of the allowed values
      if (!isOneOf(r.category, allowedCategories)) return false;
    }

    // ========== Roadmap validation ==========
    if (!d.roadmap || typeof d.roadmap !== "object") return false;
    const roadmap = d.roadmap as Record<string, unknown>;
    
    // Validate adjustedTimelineWeeks is a number
    if (
      typeof roadmap.adjustedTimelineWeeks !== "number" ||
      !Number.isFinite(roadmap.adjustedTimelineWeeks) ||
      roadmap.adjustedTimelineWeeks < 0
    ) return false;
    
    // Validate phases array
    if (!Array.isArray(roadmap.phases) || roadmap.phases.length === 0) return false;
    
    for (const phase of roadmap.phases) {
      if (!phase || typeof phase !== "object") return false;
      const p = phase as Record<string, unknown>;
      
      // Validate name is a string
      if (typeof p.name !== "string" || p.name.length === 0) return false;
      
      // Validate duration is a string (even though it contains numbers)
      if (typeof p.duration !== "string" || p.duration.length === 0) return false;
      
      // Validate tasks is an array of strings
      if (!isStringArray(p.tasks) || p.tasks.length === 0) return false;
      
      // Validate deliverables is an array of strings
      if (!isStringArray(p.deliverables) || p.deliverables.length === 0) return false;
      
      // Validate skillsRequired is an array of strings
      if (!isStringArray(p.skillsRequired) || p.skillsRequired.length === 0) return false;
    }

    // ========== Key Features validation ==========
    if (!Array.isArray(d.keyFeatures) || d.keyFeatures.length === 0) return false;
    
    const allowedPriorities = ['P0', 'P1', 'P2'] as const;
    const allowedComplexities = ['Low', 'Medium', 'High'] as const;
    
    for (const feature of d.keyFeatures) {
      if (!feature || typeof feature !== "object") return false;
      const f = feature as Record<string, unknown>;
      
      // Validate feature name is a string
      if (typeof f.feature !== "string" || f.feature.length === 0) return false;
      
      // Validate description is a string
      if (typeof f.description !== "string" || f.description.length === 0) return false;
      
      // Validate priority is one of the allowed values
      if (!isOneOf(f.priority, allowedPriorities)) return false;
      
      // Validate complexity is one of the allowed values
      if (!isOneOf(f.complexity, allowedComplexities)) return false;
      
      // Validate estimatedDays is a number
      if (
        typeof f.estimatedDays !== "number" ||
        !Number.isFinite(f.estimatedDays) ||
        f.estimatedDays < 0
      ) return false;
    }

    // ========== Executive Summary validation ==========
    if (typeof d.executiveSummary !== "string" || d.executiveSummary.length === 0) {
      return false;
    }

    return true;
  } catch {
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