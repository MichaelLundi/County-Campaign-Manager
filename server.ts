import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import {
  getActivitiesDb,
  insertActivityDb,
  updateActivityStatusDb,
  deleteActivityDb,
  getTasksDb,
  insertTaskDb,
  updateTaskStatusDb,
  deleteTaskDb,
  getIssuesDb,
  insertIssueDb,
  updateIssueStatusDb,
  deleteIssueDb,
  getTeamMembersDb,
  insertTeamMemberDb,
  updateTeamMemberStatusDb,
  deleteTeamMemberDb,
  seedInitialDataIfEmpty,
} from './src/db/campaign.ts';
import { getOrCreateUser } from './src/db/users.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API Routes
app.get('/api/health', async (_req, res) => {
  res.json({
    status: 'ok',
    database: 'Cloud SQL PostgreSQL (Drizzle)',
    region: 'europe-west1',
    timestamp: new Date().toISOString(),
  });
});

// Auth sync endpoint
app.post('/api/auth/sync', async (req, res) => {
  try {
    const { uid, email, displayName } = req.body;
    if (!uid || !email) {
      return res.status(400).json({ error: 'Missing uid or email' });
    }
    const user = await getOrCreateUser(uid, email, displayName);
    res.json(user);
  } catch (error: any) {
    console.error('Failed to sync user:', error);
    res.status(500).json({ error: error.message || 'User sync failed' });
  }
});

// Activities API
app.get('/api/activities', async (_req, res) => {
  try {
    const data = await getActivitiesDb();
    res.json(data);
  } catch (error: any) {
    console.error('API getActivities error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch activities' });
  }
});

app.post('/api/activities', async (req, res) => {
  try {
    const activity = await insertActivityDb(req.body);
    res.status(201).json(activity);
  } catch (error: any) {
    console.error('API insertActivity error:', error);
    res.status(500).json({ error: error.message || 'Failed to create activity' });
  }
});

app.patch('/api/activities/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await updateActivityStatusDb(id, status);
    res.json(updated);
  } catch (error: any) {
    console.error('API updateActivityStatus error:', error);
    res.status(500).json({ error: error.message || 'Failed to update activity status' });
  }
});

app.delete('/api/activities/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteActivityDb(id);
    res.json({ success: true });
  } catch (error: any) {
    console.error('API deleteActivity error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete activity' });
  }
});

// Tasks API
app.get('/api/tasks', async (_req, res) => {
  try {
    const data = await getTasksDb();
    res.json(data);
  } catch (error: any) {
    console.error('API getTasks error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch tasks' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const task = await insertTaskDb(req.body);
    res.status(201).json(task);
  } catch (error: any) {
    console.error('API insertTask error:', error);
    res.status(500).json({ error: error.message || 'Failed to create task' });
  }
});

app.patch('/api/tasks/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await updateTaskStatusDb(id, status);
    res.json(updated);
  } catch (error: any) {
    console.error('API updateTaskStatus error:', error);
    res.status(500).json({ error: error.message || 'Failed to update task status' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteTaskDb(id);
    res.json({ success: true });
  } catch (error: any) {
    console.error('API deleteTask error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete task' });
  }
});

// Issues API
app.get('/api/issues', async (_req, res) => {
  try {
    const data = await getIssuesDb();
    res.json(data);
  } catch (error: any) {
    console.error('API getIssues error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch issues' });
  }
});

app.post('/api/issues', async (req, res) => {
  try {
    const issue = await insertIssueDb(req.body);
    res.status(201).json(issue);
  } catch (error: any) {
    console.error('API insertIssue error:', error);
    res.status(500).json({ error: error.message || 'Failed to create issue' });
  }
});

app.patch('/api/issues/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await updateIssueStatusDb(id, status);
    res.json(updated);
  } catch (error: any) {
    console.error('API updateIssueStatus error:', error);
    res.status(500).json({ error: error.message || 'Failed to update issue status' });
  }
});

app.delete('/api/issues/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteIssueDb(id);
    res.json({ success: true });
  } catch (error: any) {
    console.error('API deleteIssue error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete issue' });
  }
});

// Team API
app.get('/api/team', async (_req, res) => {
  try {
    const data = await getTeamMembersDb();
    res.json(data);
  } catch (error: any) {
    console.error('API getTeam error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch team members' });
  }
});

app.post('/api/team', async (req, res) => {
  try {
    const member = await insertTeamMemberDb(req.body);
    res.status(201).json(member);
  } catch (error: any) {
    console.error('API insertTeam error:', error);
    res.status(500).json({ error: error.message || 'Failed to create team member' });
  }
});

app.patch('/api/team/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await updateTeamMemberStatusDb(id, status);
    res.json(updated);
  } catch (error: any) {
    console.error('API updateTeamStatus error:', error);
    res.status(500).json({ error: error.message || 'Failed to update team member status' });
  }
});

app.delete('/api/team/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteTeamMemberDb(id);
    res.json({ success: true });
  } catch (error: any) {
    console.error('API deleteTeam error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete team member' });
  }
});

// Setup Vite middleware or static serving
async function startServer() {
  // Seed sample records if PostgreSQL tables are empty
  await seedInitialDataIfEmpty();

  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
