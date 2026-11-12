import React, { useState, useEffect } from 'react';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  checkSupabaseConnection,
  seedSupabaseTables,
  SupabaseConnectionStatus,
} from '../../lib/supabase';
import {
  Database,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Copy,
  ExternalLink,
  Table,
  UploadCloud,
  Check,
} from 'lucide-react';

interface SupabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseStatusModal: React.FC<SupabaseStatusModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [status, setStatus] = useState<SupabaseConnectionStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  const runCheck = async () => {
    setLoading(true);
    setSeedResult(null);
    try {
      const res = await checkSupabaseConnection();
      setStatus(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      runCheck();
    }
  }, [isOpen]);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await seedSupabaseTables();
      setSeedResult(res);
      // Re-run check to update counts
      await runCheck();
    } finally {
      setSeeding(false);
    }
  };

  const sqlSchema = `-- Supabase SQL Schema for County Campaign Manager
create table if not exists activities (
  id text primary key,
  title text not null,
  type text not null,
  constituency text not null,
  ward text not null,
  venue text not null,
  date_time text not null,
  expected_attendance integer default 0,
  lead_coordinator text not null,
  status text default 'Upcoming',
  permits_cleared boolean default false,
  budget_ksh integer default 0,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists tasks (
  id text primary key,
  title text not null,
  category text not null,
  priority text default 'Medium',
  status text default 'Pending',
  assignee_name text not null,
  assignee_role text not null,
  due_date text not null,
  constituency text not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists issues (
  id text primary key,
  title text not null,
  constituency text not null,
  ward text not null,
  category text not null,
  urgency text default 'High',
  status text default 'Under Review',
  reported_date text not null,
  summary text not null,
  pledged_action text not null,
  reported_by text not null,
  votes_impacted_approx integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists team_members (
  id text primary key,
  name text not null,
  role text not null,
  constituency text not null,
  ward text not null,
  phone text not null,
  email text not null,
  status text default 'Active',
  volunteers_led integer default 0,
  joined_date text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS) & Public read/write policies
alter table activities enable row level security;
alter table tasks enable row level security;
alter table issues enable row level security;
alter table team_members enable row level security;

create policy "Allow anon access activities" on activities for all using (true) with check (true);
create policy "Allow anon access tasks" on tasks for all using (true) with check (true);
create policy "Allow anon access issues" on issues for all using (true) with check (true);
create policy "Allow anon access team_members" on team_members for all using (true) with check (true);`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const allTablesExist = status?.tables && status.tables.length > 0 && status.tables.every((t) => t.exists);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Supabase Connection Diagnostic"
      description="Live health check and status verification for your Supabase PostgreSQL project."
      maxWidth="max-w-xl"
    >
      <div className="space-y-4 text-xs text-neutral-700">
        {/* Status card */}
        <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-700" />
              <div>
                <span className="font-bold text-neutral-900 text-sm block">
                  Supabase Project
                </span>
                <span className="text-[11px] font-mono text-neutral-500">
                  {status?.projectRef || 'Loading...'}
                </span>
              </div>
            </div>

            {loading ? (
              <Badge variant="neutral" className="flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" /> Checking...
              </Badge>
            ) : status?.isConnected ? (
              <Badge variant="green" className="flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Connected
                {status.latencyMs ? ` · ${status.latencyMs}ms` : ''}
              </Badge>
            ) : (
              <Badge variant="urgent" className="flex items-center gap-1">
                <XCircle className="w-3 h-3 text-rose-700" /> Disconnected
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-2 border-t border-neutral-200/60">
            <div>
              <span className="text-neutral-500 block">Project URL:</span>
              <span className="font-mono text-neutral-800 break-all">
                {status?.url || '—'}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block">Client SDK:</span>
              <span className="font-medium text-neutral-800">
                @supabase/supabase-js (Active)
              </span>
            </div>
          </div>
        </div>

        {/* Error banner if connection failed */}
        {status?.error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-xs">
            <strong>Connection error:</strong> {status.error}
          </div>
        )}

        {/* Table schema audit */}
        {status?.isConnected && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-neutral-900 text-xs flex items-center gap-1.5">
                <Table className="w-4 h-4 text-emerald-700" />
                Database Tables in Supabase
              </span>
              <span className="text-[11px] text-neutral-500">
                {status.tables.filter((t) => t.exists).length} of {status.tables.length} tables found
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {status.tables.map((tbl) => (
                <div
                  key={tbl.name}
                  className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                    tbl.exists
                      ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-600'
                  }`}
                >
                  <span className="font-mono font-medium">{tbl.name}</span>
                  {tbl.exists ? (
                    <span className="font-mono tabular-nums text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                      {tbl.count ?? 0} rows
                    </span>
                  ) : (
                    <span className="text-[10px] text-neutral-500">
                      Not created yet
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* If tables do not exist yet, guide user to run SQL in Supabase dashboard */}
            {!allTablesExist && (
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2.5 mt-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="font-semibold text-neutral-900 text-xs">
                      Create Tables in Supabase SQL Editor
                    </h5>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Your connection is verified! To finish setup, paste the SQL below into your Supabase Dashboard SQL Editor:
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copySql}
                    className="h-7 text-xs border-neutral-300 shrink-0"
                  >
                    {copiedSql ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-700" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy SQL
                      </>
                    )}
                  </Button>
                </div>

                <pre className="p-2.5 bg-neutral-900 text-neutral-100 rounded-lg text-[10px] font-mono overflow-x-auto max-h-32">
                  {sqlSchema}
                </pre>

                <div className="flex items-center justify-end">
                  <a
                    href={`https://supabase.com/dashboard/project/${status?.projectRef}/sql/new`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 hover:text-emerald-800 underline"
                  >
                    Open Supabase SQL Editor <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {/* If tables exist, allow seeding */}
            {allTablesExist && (
              <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-semibold text-emerald-950 text-xs">
                      All Campaign Tables Ready
                    </h5>
                    <p className="text-[11px] text-emerald-800">
                      Populate your Supabase tables with the 17 Nairobi campaign sample data.
                    </p>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSeed}
                    disabled={seeding}
                    className="h-8 text-xs"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    {seeding ? 'Syncing...' : 'Sync Sample Data'}
                  </Button>
                </div>

                {seedResult && (
                  <p
                    className={`text-[11px] font-medium ${
                      seedResult.success ? 'text-emerald-800' : 'text-rose-700'
                    }`}
                  >
                    {seedResult.message}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Modal actions */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={runCheck}
            disabled={loading}
            className="text-xs border-neutral-300"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Re-test Connection
          </Button>

          <Button type="button" variant="black" size="sm" onClick={onClose} className="text-xs">
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
