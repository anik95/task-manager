import { defineRelations } from 'drizzle-orm';
import * as schema from './schema.js';

export const relations = defineRelations(schema, (r) => ({
  users: {
    projects: r.many.projects(),
    assignedTasks: r.many.tasks(),
  },
  projects: {
    owner: r.one.users({
      from: r.projects.ownerId,
      to: r.users.id,
      optional: false,
    }),
    tasks: r.many.tasks(),
  },
  tasks: {
    assignee: r.one.users({
      from: r.tasks.assigneeId,
      to: r.users.id,
      optional: true,
    }),
    project: r.one.projects({
      optional: false,
      from: r.tasks.projectId,
      to: r.projects.id,
    }),
  },
}));
