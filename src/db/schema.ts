import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table authenticated via Firebase Auth
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  displayName: text('display_name'),
  role: text('role').default('Field Coordinator'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Campaign Activities table
export const activities = pgTable('activities', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  type: text('type').notNull(),
  constituency: text('constituency').notNull(),
  ward: text('ward').notNull(),
  venue: text('venue').notNull(),
  dateTime: text('date_time').notNull(),
  expectedAttendance: integer('expected_attendance').notNull().default(0),
  leadCoordinator: text('lead_coordinator').notNull(),
  status: text('status').notNull().default('Upcoming'),
  permitsCleared: boolean('permits_cleared').notNull().default(false),
  budgetKSh: integer('budget_ksh').default(0),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Logistics & Field Tasks table
export const tasks = pgTable('tasks', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  priority: text('priority').notNull().default('Medium'),
  status: text('status').notNull().default('Pending'),
  assigneeName: text('assignee_name').notNull(),
  assigneeRole: text('assignee_role').notNull(),
  dueDate: text('due_date').notNull(),
  constituency: text('constituency').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Community Issues & Citizen Grievances table
export const issues = pgTable('issues', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  constituency: text('constituency').notNull(),
  ward: text('ward').notNull(),
  category: text('category').notNull(),
  urgency: text('urgency').notNull().default('High'),
  status: text('status').notNull().default('Under Review'),
  reportedDate: text('reported_date').notNull(),
  summary: text('summary').notNull(),
  pledgedAction: text('pledged_action').notNull(),
  reportedBy: text('reported_by').notNull(),
  votesImpactedApprox: integer('votes_impacted_approx').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Campaign Team & Field Volunteer Directory table
export const teamMembers = pgTable('team_members', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  constituency: text('constituency').notNull(),
  ward: text('ward').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  status: text('status').notNull().default('Active'),
  volunteersLed: integer('volunteers_led').default(0),
  joinedDate: text('joined_date').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
