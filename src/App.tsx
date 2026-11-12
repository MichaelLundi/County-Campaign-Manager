import React, { useState, useEffect } from 'react';
import { PageId, Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { TestingGuideModal } from './components/layout/TestingGuideModal';
import { QuickActionModal } from './components/modals/QuickActionModal';
import { AddActivityModal } from './components/modals/AddActivityModal';
import { AddTaskModal } from './components/modals/AddTaskModal';
import { AddIssueModal } from './components/modals/AddIssueModal';
import { AddTeamMemberModal } from './components/modals/AddTeamMemberModal';
import { SupabaseStatusModal } from './components/modals/SupabaseStatusModal';

import { DashboardView } from './components/pages/DashboardView';
import { ActivitiesView } from './components/pages/ActivitiesView';
import { TasksView } from './components/pages/TasksView';
import { IssuesView } from './components/pages/IssuesView';
import { TeamView } from './components/pages/TeamView';

import {
  INITIAL_ACTIVITIES,
  INITIAL_TASKS,
  INITIAL_ISSUES,
  INITIAL_TEAM_MEMBERS,
  CONSTITUENCY_METRICS,
} from './data/mockData';
import {
  Activity,
  CampaignTask,
  CommunityIssue,
  TeamMember,
  ActivityStatus,
  TaskStatus,
  IssueStatus,
} from './types/campaign';
import { campaignApi } from './services/api';
import { auth, googleAuthProvider } from './lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { HelpCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Campaign State
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [tasks, setTasks] = useState<CampaignTask[]>(INITIAL_TASKS);
  const [issues, setIssues] = useState<CommunityIssue[]>(INITIAL_ISSUES);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);

  // Modals
  const [isTestingGuideOpen, setIsTestingGuideOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isSupabaseStatusOpen, setIsSupabaseStatusOpen] = useState(false);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAddIssueOpen, setIsAddIssueOpen] = useState(false);
  const [isAddTeamMemberOpen, setIsAddTeamMemberOpen] = useState(false);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user && user.email) {
        try {
          await campaignApi.syncUser(user.uid, user.email, user.displayName || undefined);
        } catch (err) {
          console.warn('User synchronization notice:', err);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch initial campaign data from backend PostgreSQL API
  useEffect(() => {
    async function loadCampaignData() {
      try {
        const [acts, tsks, isss, tm] = await Promise.allSettled([
          campaignApi.getActivities(),
          campaignApi.getTasks(),
          campaignApi.getIssues(),
          campaignApi.getTeam(),
        ]);

        if (acts.status === 'fulfilled' && acts.value.length > 0) {
          setActivities(acts.value);
        }
        if (tsks.status === 'fulfilled' && tsks.value.length > 0) {
          setTasks(tsks.value);
        }
        if (isss.status === 'fulfilled' && isss.value.length > 0) {
          setIssues(isss.value);
        }
        if (tm.status === 'fulfilled' && tm.value.length > 0) {
          setTeamMembers(tm.value);
        }
      } catch (err) {
        console.warn('Notice: Using client state while connecting to backend database', err);
      }
    }
    loadCampaignData();
  }, []);

  // Sign In / Sign Out
  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        console.error('Google Sign-In notice:', err);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  // Reset to default sample dataset
  const handleResetData = async () => {
    setActivities(INITIAL_ACTIVITIES);
    setTasks(INITIAL_TASKS);
    setIssues(INITIAL_ISSUES);
    setTeamMembers(INITIAL_TEAM_MEMBERS);
  };

  // Activity handlers
  const handleAddActivity = async (newAct: Activity) => {
    setActivities((prev) => [newAct, ...prev]);
    try {
      await campaignApi.createActivity(newAct);
    } catch (err) {
      console.warn('Activity saved locally:', err);
    }
  };

  const handleUpdateActivityStatus = async (id: string, newStatus: ActivityStatus) => {
    setActivities((prev) =>
      prev.map((act) => (act.id === id ? { ...act, status: newStatus } : act))
    );
    try {
      await campaignApi.updateActivityStatus(id, newStatus);
    } catch (err) {
      console.warn('Status updated locally:', err);
    }
  };

  const handleDeleteActivity = async (id: string) => {
    setActivities((prev) => prev.filter((act) => act.id !== id));
    try {
      await campaignApi.deleteActivity(id);
    } catch (err) {
      console.warn('Activity removed locally:', err);
    }
  };

  // Task handlers
  const handleAddTask = async (newTask: CampaignTask) => {
    setTasks((prev) => [newTask, ...prev]);
    try {
      await campaignApi.createTask(newTask);
    } catch (err) {
      console.warn('Task saved locally:', err);
    }
  };

  const handleToggleTaskStatus = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: nextStatus } : t))
    );
    try {
      await campaignApi.updateTaskStatus(id, nextStatus);
    } catch (err) {
      console.warn('Task status updated locally:', err);
    }
  };

  const handleUpdateTaskStatus = async (id: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
    try {
      await campaignApi.updateTaskStatus(id, newStatus);
    } catch (err) {
      console.warn('Task status updated locally:', err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await campaignApi.deleteTask(id);
    } catch (err) {
      console.warn('Task deleted locally:', err);
    }
  };

  // Issue handlers
  const handleAddIssue = async (newIssue: CommunityIssue) => {
    setIssues((prev) => [newIssue, ...prev]);
    try {
      await campaignApi.createIssue(newIssue);
    } catch (err) {
      console.warn('Issue saved locally:', err);
    }
  };

  const handleUpdateIssueStatus = async (id: string, newStatus: IssueStatus) => {
    setIssues((prev) =>
      prev.map((iss) => (iss.id === id ? { ...iss, status: newStatus } : iss))
    );
    try {
      await campaignApi.updateIssueStatus(id, newStatus);
    } catch (err) {
      console.warn('Issue status updated locally:', err);
    }
  };

  const handleDeleteIssue = async (id: string) => {
    setIssues((prev) => prev.filter((iss) => iss.id !== id));
    try {
      await campaignApi.deleteIssue(id);
    } catch (err) {
      console.warn('Issue deleted locally:', err);
    }
  };

  // Team member handlers
  const handleAddTeamMember = async (newMember: TeamMember) => {
    setTeamMembers((prev) => [newMember, ...prev]);
    try {
      await campaignApi.createTeamMember(newMember);
    } catch (err) {
      console.warn('Team member saved locally:', err);
    }
  };

  const handleUpdateTeamMemberStatus = async (
    id: string,
    newStatus: 'Active' | 'On Leave' | 'Standby'
  ) => {
    setTeamMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
    );
    try {
      await campaignApi.updateTeamMemberStatus(id, newStatus);
    } catch (err) {
      console.warn('Team status updated locally:', err);
    }
  };

  const handleDeleteTeamMember = async (id: string) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
    try {
      await campaignApi.deleteTeamMember(id);
    } catch (err) {
      console.warn('Team member deleted locally:', err);
    }
  };

  // Quick Action launcher
  const handleSelectQuickAction = (action: 'activity' | 'task' | 'issue' | 'team') => {
    if (action === 'activity') setIsAddActivityOpen(true);
    if (action === 'task') setIsAddTaskOpen(true);
    if (action === 'issue') setIsAddIssueOpen(true);
    if (action === 'team') setIsAddTeamMemberOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100/70 font-sans text-neutral-900">
      {/* Top Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onOpenTestingGuide={() => setIsTestingGuideOpen(true)}
        onOpenQuickAction={() => setIsQuickActionOpen(true)}
        onOpenSupabaseStatus={() => setIsSupabaseStatusOpen(true)}
        currentUser={
          currentUser
            ? { email: currentUser.email || 'Staff Member', displayName: currentUser.displayName || undefined }
            : null
        }
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
        {currentPage === 'dashboard' && (
          <DashboardView
            activities={activities}
            tasks={tasks}
            issues={issues}
            teamMembers={teamMembers}
            constituencies={CONSTITUENCY_METRICS}
            onNavigate={setCurrentPage}
            onOpenAddActivity={() => setIsAddActivityOpen(true)}
            onOpenAddTask={() => setIsAddTaskOpen(true)}
            onOpenAddIssue={() => setIsAddIssueOpen(true)}
            onOpenAddTeamMember={() => setIsAddTeamMemberOpen(true)}
            onToggleTaskStatus={handleToggleTaskStatus}
          />
        )}

        {currentPage === 'activities' && (
          <ActivitiesView
            activities={activities}
            onOpenAddModal={() => setIsAddActivityOpen(true)}
            onUpdateStatus={handleUpdateActivityStatus}
            onDeleteActivity={handleDeleteActivity}
          />
        )}

        {currentPage === 'tasks' && (
          <TasksView
            tasks={tasks}
            onOpenAddModal={() => setIsAddTaskOpen(true)}
            onToggleStatus={handleToggleTaskStatus}
            onUpdateStatus={handleUpdateTaskStatus}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {currentPage === 'issues' && (
          <IssuesView
            issues={issues}
            onOpenAddModal={() => setIsAddIssueOpen(true)}
            onUpdateStatus={handleUpdateIssueStatus}
            onDeleteIssue={handleDeleteIssue}
          />
        )}

        {currentPage === 'team' && (
          <TeamView
            teamMembers={teamMembers}
            onOpenAddModal={() => setIsAddTeamMemberOpen(true)}
            onUpdateStatus={handleUpdateTeamMemberStatus}
            onDeleteMember={handleDeleteTeamMember}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="hidden md:block border-t border-neutral-200 bg-white py-6 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-800">County Campaign Manager</span>
            <span>·</span>
            <span>Nairobi Gubernatorial Campaign 2027</span>
            <span>·</span>
            <span className="text-neutral-400">PostgreSQL Relational Storage</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsTestingGuideOpen(true)}
              className="text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Testing Guide
            </button>
            <button
              onClick={() => {
                if (window.confirm('Reset all demo data back to default sample state?')) {
                  handleResetData();
                }
              }}
              className="text-neutral-500 hover:text-neutral-800 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Demo Data
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation (< md screens) */}
      <MobileNav currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* Interactive Modals */}
      <TestingGuideModal
        isOpen={isTestingGuideOpen}
        onClose={() => setIsTestingGuideOpen(false)}
        onResetData={handleResetData}
      />

      <SupabaseStatusModal
        isOpen={isSupabaseStatusOpen}
        onClose={() => setIsSupabaseStatusOpen(false)}
      />

      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        onSelectAction={handleSelectQuickAction}
      />

      <AddActivityModal
        isOpen={isAddActivityOpen}
        onClose={() => setIsAddActivityOpen(false)}
        onAddActivity={handleAddActivity}
      />

      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onAddTask={handleAddTask}
      />

      <AddIssueModal
        isOpen={isAddIssueOpen}
        onClose={() => setIsAddIssueOpen(false)}
        onAddIssue={handleAddIssue}
      />

      <AddTeamMemberModal
        isOpen={isAddTeamMemberOpen}
        onClose={() => setIsAddTeamMemberOpen(false)}
        onAddMember={handleAddTeamMember}
      />
    </div>
  );
}
