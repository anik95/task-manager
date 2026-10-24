// - **users** — `id`, `email` (unique), `password_hash`, `role` (default `'member'`), `created_at`
// - **projects** — `id`, `name`, `owner_id` (FK → users.id), `created_at`
// - **tasks** — `id`, `title`, `description`, `status`, `project_id` (FK → projects.id), `assignee_id` (nullable FK → users.id), `created_at`

import { sql } from 'drizzle-orm';
import {
  pgEnum,
  pgTable,
  text,
  uuid,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['member', 'admin']);

export const statusEnum = pgEnum('status', ['todo', 'in_progress', 'done']);

// A task belongs to a project, a project belongs to a user. "Can this user touch this task?" → yes if they own the project (task → project → owner) OR they are the task's assignee.

export const users = pgTable('users', {
  id: uuid()
    .primaryKey()
    .default(sql`uuidv7()`),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: roleEnum('role').notNull().default('member'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const projects = pgTable(
  'projects',
  {
    id: uuid()
      .primaryKey()
      .default(sql`uuidv7()`),
    name: text('name').notNull(),
    ownerId: uuid('owner_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },

  (table) => [index('projects_owner_id_idx').on(table.ownerId)], // convention for index is tableName_columnName_idx);
);

export const tasks = pgTable(
  'tasks',
  {
    id: uuid()
      .primaryKey()
      .default(sql`uuidv7()`),
    title: text('title').notNull(),
    description: text('description').notNull(),
    status: statusEnum('status').notNull().default('todo'),
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    assigneeId: uuid('assignee_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },

  (table) => [
    index('tasks_project_id_idx').on(table.projectId),
    index('tasks_asignee_id_idx').on(table.assigneeId),
  ], // convention for index is tableName_columnName_idx);
);
