import { InferSelectModel, relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index, uuid, varchar, integer, jsonb } from "drizzle-orm/pg-core";

// Type definitions for jsonb fields matching AI response
type DatabaseColumn = {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey?: boolean;
  foreignKey?: {
    table: string;
    column: string;
  };
};

type DatabaseTable = {
  name: string;
  columns: DatabaseColumn[];
};

type DatabaseRelationship = {
  from: string;
  to: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many' | 'many-to-one';
};

type TechStack = {
  frontend?: string[];
  backend?: string[];
  database?: string[];
  devops?: string[];
  rationale: string;
};

type Risk = {
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  mitigation: string;
  category: 'Technical' | 'Business' | 'Timeline' | 'Budget' | 'Team';
};

type RoadmapPhase = {
  name: string;
  duration: string;
  tasks: string[];
  deliverables: string[];
  skillsRequired: string[];
};

type Roadmap = {
  adjustedTimelineWeeks: number;
  phases: RoadmapPhase[];
};

type KeyFeature = {
  feature: string;
  description: string;
  priority: 'P0' | 'P1' | 'P2';
  complexity: 'Low' | 'Medium' | 'High';
  estimatedDays: number;
};

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
}, (table) => ({
  userIdIdx: index("session_userId_idx").on(table.userId),
}));

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => ({
  userIdIdx: index("account_userId_idx").on(table.userId),
}));

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => ({
  identifierIdx: index("verification_identifier_idx").on(table.identifier),
}));

export const projects = pgTable('projects', {
  // Primary Key
  id: uuid('id').primaryKey().defaultRandom(),

  slug: varchar('slug', { length: 255 }).unique().notNull(),

  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),

  // Basic Info
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  problemStatement: text('problem_statement').notNull(),
  isPublic: boolean('is_public').default(true),
  expiresAt: timestamp('expires_at'),
  
  // Project Details
  targetUsers: integer('target_users'),
  teamSize: integer('team_size'),
  timelineWeeks: integer('timeline_weeks'),
  budgetRange: varchar('budget_range', { length: 50 }),

  // AI Generated Content - Updated to match AI response
  techStack: jsonb('tech_stack').$type<TechStack>(),

  databaseSchema: jsonb('database_schema').$type<{
    tables: DatabaseTable[];
    relationships: DatabaseRelationship[];
  }>(),

  risks: jsonb('risks').$type<Risk[]>(),

  roadmap: jsonb('roadmap').$type<Roadmap>(),

  keyFeatures: jsonb('key_features').$type<KeyFeature[]>(),

  // Metadata
  viewCount: integer('view_count').default(0),
  forkCount: integer('fork_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userProjectsIdx: index('idx_user_projects').on(table.userId),
  publicProjectsIdx: index('idx_public_projects').on(table.isPublic, table.createdAt),
  slugIdx: index('idx_slug').on(table.slug),
  expiresAtIdx: index('idx_expires_at').on(table.expiresAt),
}));

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  projects: many(projects),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const projectRelations = relations(projects, ({ one }) => ({
  user: one(user, {
    fields: [projects.userId],
    references: [user.id],
  }),
}));

export type Project = InferSelectModel<typeof projects>;

// Export types for use in other files
export type { TechStack, Risk, Roadmap, KeyFeature, DatabaseTable, DatabaseRelationship };