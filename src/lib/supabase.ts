import { createClient } from '@supabase/supabase-js';
import { INITIAL_ACTIVITIES, INITIAL_TASKS, INITIAL_ISSUES, INITIAL_TEAM_MEMBERS } from '../data/mockData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  supabaseUrl.includes('.supabase.co')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export interface TableCheckResult {
  name: string;
  exists: boolean;
  count?: number;
  message?: string;
}

export interface SupabaseConnectionStatus {
  isConfigured: boolean;
  isConnected: boolean;
  url: string;
  projectRef: string;
  latencyMs?: number;
  error?: string;
  tables: TableCheckResult[];
}

export async function checkSupabaseConnection(): Promise<SupabaseConnectionStatus> {
  const url = supabaseUrl.trim();
  const projectRef = url.replace('https://', '').split('.')[0] || 'unknown';

  if (!isSupabaseConfigured || !supabase) {
    return {
      isConfigured: false,
      isConnected: false,
      url: url || 'Not specified',
      projectRef,
      error: 'Supabase URL or anon public key is not configured in environment.',
      tables: [],
    };
  }

  const startTime = performance.now();

  try {
    // Check tables one by one
    const tableNames = ['activities', 'tasks', 'issues', 'team_members'];
    const tableChecks: TableCheckResult[] = [];

    for (const tbl of tableNames) {
      try {
        const { count, error } = await supabase
          .from(tbl)
          .select('*', { count: 'exact', head: true });

        if (error) {
          // If error code is 42P01 (relation does not exist) or similar schema error
          tableChecks.push({
            name: tbl,
            exists: false,
            message: error.message || 'Table not found',
          });
        } else {
          tableChecks.push({
            name: tbl,
            exists: true,
            count: count || 0,
            message: 'Ready',
          });
        }
      } catch (e: any) {
        tableChecks.push({
          name: tbl,
          exists: false,
          message: e.message || 'Check failed',
        });
      }
    }

    const latencyMs = Math.round(performance.now() - startTime);

    return {
      isConfigured: true,
      isConnected: true,
      url,
      projectRef,
      latencyMs,
      tables: tableChecks,
    };
  } catch (err: any) {
    const latencyMs = Math.round(performance.now() - startTime);
    return {
      isConfigured: true,
      isConnected: false,
      url,
      projectRef,
      latencyMs,
      error: err.message || 'Unable to reach Supabase project. Check internet connection or project status.',
      tables: [],
    };
  }
}

// Helper to seed initial sample records directly into Supabase
export async function seedSupabaseTables(): Promise<{ success: boolean; message: string }> {
  if (!supabase) return { success: false, message: 'Supabase client not initialized' };

  try {
    // 1. Seed activities
    await supabase.from('activities').upsert(
      INITIAL_ACTIVITIES.map((a) => ({
        id: a.id,
        title: a.title,
        type: a.type,
        constituency: a.constituency,
        ward: a.ward,
        venue: a.venue,
        date_time: a.dateTime,
        expected_attendance: a.expectedAttendance,
        lead_coordinator: a.leadCoordinator,
        status: a.status,
        permits_cleared: a.permitsCleared,
        budget_ksh: a.budgetKSh || 0,
        notes: a.notes || null,
      }))
    );

    // 2. Seed tasks
    await supabase.from('tasks').upsert(
      INITIAL_TASKS.map((t) => ({
        id: t.id,
        title: t.title,
        category: t.category,
        priority: t.priority,
        status: t.status,
        assignee_name: t.assigneeName,
        assignee_role: t.assigneeRole,
        due_date: t.dueDate,
        constituency: t.constituency,
        notes: t.notes || null,
      }))
    );

    // 3. Seed issues
    await supabase.from('issues').upsert(
      INITIAL_ISSUES.map((i) => ({
        id: i.id,
        title: i.title,
        constituency: i.constituency,
        ward: i.ward,
        category: i.category,
        urgency: i.urgency,
        status: i.status,
        reported_date: i.reportedDate,
        summary: i.summary,
        pledged_action: i.pledgedAction,
        reported_by: i.reportedBy,
        votes_impacted_approx: i.votesImpactedApprox || 0,
      }))
    );

    // 4. Seed team members
    await supabase.from('team_members').upsert(
      INITIAL_TEAM_MEMBERS.map((m) => ({
        id: m.id,
        name: m.name,
        role: m.role,
        constituency: m.constituency,
        ward: m.ward,
        phone: m.phone,
        email: m.email,
        status: m.status,
        volunteers_led: m.volunteersLed || 0,
        joined_date: m.joinedDate,
      }))
    );

    return { success: true, message: 'All 4 tables successfully populated in Supabase!' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Seeding failed' };
  }
}
