import { db } from './index.ts';
import { activities, tasks, issues, teamMembers } from './schema.ts';
import { eq, desc } from 'drizzle-orm';
import { INITIAL_ACTIVITIES, INITIAL_TASKS, INITIAL_ISSUES, INITIAL_TEAM_MEMBERS } from '../data/mockData.ts';

// Activities
export async function getActivitiesDb() {
  try {
    return await db.select().from(activities).orderBy(desc(activities.createdAt));
  } catch (error) {
    console.error('Failed to get activities:', error);
    throw new Error('Database query failed', { cause: error });
  }
}

export async function insertActivityDb(data: typeof activities.$inferInsert) {
  try {
    const res = await db.insert(activities).values(data).returning();
    return res[0];
  } catch (error) {
    console.error('Failed to insert activity:', error);
    throw new Error('Database insert failed', { cause: error });
  }
}

export async function updateActivityStatusDb(id: string, status: string) {
  try {
    const res = await db.update(activities).set({ status }).where(eq(activities.id, id)).returning();
    return res[0];
  } catch (error) {
    console.error('Failed to update activity status:', error);
    throw new Error('Database update failed', { cause: error });
  }
}

export async function deleteActivityDb(id: string) {
  try {
    await db.delete(activities).where(eq(activities.id, id));
    return { success: true };
  } catch (error) {
    console.error('Failed to delete activity:', error);
    throw new Error('Database delete failed', { cause: error });
  }
}

// Tasks
export async function getTasksDb() {
  try {
    return await db.select().from(tasks).orderBy(desc(tasks.createdAt));
  } catch (error) {
    console.error('Failed to get tasks:', error);
    throw new Error('Database query failed', { cause: error });
  }
}

export async function insertTaskDb(data: typeof tasks.$inferInsert) {
  try {
    const res = await db.insert(tasks).values(data).returning();
    return res[0];
  } catch (error) {
    console.error('Failed to insert task:', error);
    throw new Error('Database insert failed', { cause: error });
  }
}

export async function updateTaskStatusDb(id: string, status: string) {
  try {
    const res = await db.update(tasks).set({ status }).where(eq(tasks.id, id)).returning();
    return res[0];
  } catch (error) {
    console.error('Failed to update task status:', error);
    throw new Error('Database update failed', { cause: error });
  }
}

export async function deleteTaskDb(id: string) {
  try {
    await db.delete(tasks).where(eq(tasks.id, id));
    return { success: true };
  } catch (error) {
    console.error('Failed to delete task:', error);
    throw new Error('Database delete failed', { cause: error });
  }
}

// Issues
export async function getIssuesDb() {
  try {
    return await db.select().from(issues).orderBy(desc(issues.createdAt));
  } catch (error) {
    console.error('Failed to get issues:', error);
    throw new Error('Database query failed', { cause: error });
  }
}

export async function insertIssueDb(data: typeof issues.$inferInsert) {
  try {
    const res = await db.insert(issues).values(data).returning();
    return res[0];
  } catch (error) {
    console.error('Failed to insert issue:', error);
    throw new Error('Database insert failed', { cause: error });
  }
}

export async function updateIssueStatusDb(id: string, status: string) {
  try {
    const res = await db.update(issues).set({ status }).where(eq(issues.id, id)).returning();
    return res[0];
  } catch (error) {
    console.error('Failed to update issue status:', error);
    throw new Error('Database update failed', { cause: error });
  }
}

export async function deleteIssueDb(id: string) {
  try {
    await db.delete(issues).where(eq(issues.id, id));
    return { success: true };
  } catch (error) {
    console.error('Failed to delete issue:', error);
    throw new Error('Database delete failed', { cause: error });
  }
}

// Team Members
export async function getTeamMembersDb() {
  try {
    return await db.select().from(teamMembers).orderBy(desc(teamMembers.createdAt));
  } catch (error) {
    console.error('Failed to get team members:', error);
    throw new Error('Database query failed', { cause: error });
  }
}

export async function insertTeamMemberDb(data: typeof teamMembers.$inferInsert) {
  try {
    const res = await db.insert(teamMembers).values(data).returning();
    return res[0];
  } catch (error) {
    console.error('Failed to insert team member:', error);
    throw new Error('Database insert failed', { cause: error });
  }
}

export async function updateTeamMemberStatusDb(id: string, status: string) {
  try {
    const res = await db.update(teamMembers).set({ status }).where(eq(teamMembers.id, id)).returning();
    return res[0];
  } catch (error) {
    console.error('Failed to update team member status:', error);
    throw new Error('Database update failed', { cause: error });
  }
}

export async function deleteTeamMemberDb(id: string) {
  try {
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
    return { success: true };
  } catch (error) {
    console.error('Failed to delete team member:', error);
    throw new Error('Database delete failed', { cause: error });
  }
}

// Seeder to populate database with sample data if tables are empty
export async function seedInitialDataIfEmpty() {
  try {
    const existingActs = await db.select().from(activities);
    if (existingActs.length === 0) {
      console.log('Seeding initial campaign activities...');
      for (const act of INITIAL_ACTIVITIES) {
        await db.insert(activities).values({
          id: act.id,
          title: act.title,
          type: act.type,
          constituency: act.constituency,
          ward: act.ward,
          venue: act.venue,
          dateTime: act.dateTime,
          expectedAttendance: act.expectedAttendance,
          leadCoordinator: act.leadCoordinator,
          status: act.status,
          permitsCleared: act.permitsCleared,
          budgetKSh: act.budgetKSh,
          notes: act.notes,
        });
      }
    }

    const existingTasks = await db.select().from(tasks);
    if (existingTasks.length === 0) {
      console.log('Seeding initial campaign tasks...');
      for (const t of INITIAL_TASKS) {
        await db.insert(tasks).values({
          id: t.id,
          title: t.title,
          category: t.category,
          priority: t.priority,
          status: t.status,
          assigneeName: t.assigneeName,
          assigneeRole: t.assigneeRole,
          dueDate: t.dueDate,
          constituency: t.constituency,
          notes: t.notes,
        });
      }
    }

    const existingIssues = await db.select().from(issues);
    if (existingIssues.length === 0) {
      console.log('Seeding initial community issues...');
      for (const iss of INITIAL_ISSUES) {
        await db.insert(issues).values({
          id: iss.id,
          title: iss.title,
          constituency: iss.constituency,
          ward: iss.ward,
          category: iss.category,
          urgency: iss.urgency,
          status: iss.status,
          reportedDate: iss.reportedDate,
          summary: iss.summary,
          pledgedAction: iss.pledgedAction,
          reportedBy: iss.reportedBy,
          votesImpactedApprox: iss.votesImpactedApprox,
        });
      }
    }

    const existingTeam = await db.select().from(teamMembers);
    if (existingTeam.length === 0) {
      console.log('Seeding initial team members...');
      for (const tm of INITIAL_TEAM_MEMBERS) {
        await db.insert(teamMembers).values({
          id: tm.id,
          name: tm.name,
          role: tm.role,
          constituency: tm.constituency,
          ward: tm.ward,
          phone: tm.phone,
          email: tm.email,
          status: tm.status,
          volunteersLed: tm.volunteersLed,
          joinedDate: tm.joinedDate,
        });
      }
    }
  } catch (err) {
    console.error('Error during initial data seeding check:', err);
  }
}
