import { Activity, CampaignTask, CommunityIssue, TeamMember } from '../types/campaign';

export const campaignApi = {
  // Activities
  async getActivities(): Promise<Activity[]> {
    const res = await fetch('/api/activities');
    if (!res.ok) throw new Error('Failed to fetch activities');
    return res.json();
  },
  async createActivity(activity: Activity): Promise<Activity> {
    const res = await fetch('/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activity),
    });
    if (!res.ok) throw new Error('Failed to create activity');
    return res.json();
  },
  async updateActivityStatus(id: string, status: string): Promise<Activity> {
    const res = await fetch(`/api/activities/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update activity status');
    return res.json();
  },
  async deleteActivity(id: string): Promise<void> {
    const res = await fetch(`/api/activities/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete activity');
  },

  // Tasks
  async getTasks(): Promise<CampaignTask[]> {
    const res = await fetch('/api/tasks');
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
  },
  async createTask(task: CampaignTask): Promise<CampaignTask> {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error('Failed to create task');
    return res.json();
  },
  async updateTaskStatus(id: string, status: string): Promise<CampaignTask> {
    const res = await fetch(`/api/tasks/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update task status');
    return res.json();
  },
  async deleteTask(id: string): Promise<void> {
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete task');
  },

  // Issues
  async getIssues(): Promise<CommunityIssue[]> {
    const res = await fetch('/api/issues');
    if (!res.ok) throw new Error('Failed to fetch issues');
    return res.json();
  },
  async createIssue(issue: CommunityIssue): Promise<CommunityIssue> {
    const res = await fetch('/api/issues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(issue),
    });
    if (!res.ok) throw new Error('Failed to create issue');
    return res.json();
  },
  async updateIssueStatus(id: string, status: string): Promise<CommunityIssue> {
    const res = await fetch(`/api/issues/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update issue status');
    return res.json();
  },
  async deleteIssue(id: string): Promise<void> {
    const res = await fetch(`/api/issues/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete issue');
  },

  // Team
  async getTeam(): Promise<TeamMember[]> {
    const res = await fetch('/api/team');
    if (!res.ok) throw new Error('Failed to fetch team members');
    return res.json();
  },
  async createTeamMember(member: TeamMember): Promise<TeamMember> {
    const res = await fetch('/api/team', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member),
    });
    if (!res.ok) throw new Error('Failed to create team member');
    return res.json();
  },
  async updateTeamMemberStatus(id: string, status: string): Promise<TeamMember> {
    const res = await fetch(`/api/team/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update team member status');
    return res.json();
  },
  async deleteTeamMember(id: string): Promise<void> {
    const res = await fetch(`/api/team/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete team member');
  },

  // User auth sync
  async syncUser(uid: string, email: string, displayName?: string) {
    const res = await fetch('/api/auth/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, email, displayName }),
    });
    if (!res.ok) throw new Error('Failed to sync user');
    return res.json();
  },
};
