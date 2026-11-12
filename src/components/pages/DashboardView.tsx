import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Activity, CampaignTask, CommunityIssue, TeamMember, ConstituencyMetric } from '../../types/campaign';
import { PageId } from '../layout/Navbar';
import {
  Users,
  Calendar,
  CheckSquare,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  MapPin,
  Clock,
  Plus,
  CheckCircle2,
} from 'lucide-react';

interface DashboardViewProps {
  activities: Activity[];
  tasks: CampaignTask[];
  issues: CommunityIssue[];
  teamMembers: TeamMember[];
  constituencies: ConstituencyMetric[];
  onNavigate: (page: PageId) => void;
  onOpenAddActivity: () => void;
  onOpenAddTask: () => void;
  onOpenAddIssue: () => void;
  onOpenAddTeamMember: () => void;
  onToggleTaskStatus: (taskId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  activities,
  tasks,
  issues,
  teamMembers,
  constituencies,
  onNavigate,
  onOpenAddActivity,
  onOpenAddTask,
  onOpenAddIssue,
  onOpenAddTeamMember,
  onToggleTaskStatus,
}) => {
  const [constituencySearch, setConstituencySearch] = useState('');

  // Calculations
  const totalTargetVoters = constituencies.reduce((acc, c) => acc + c.targetVoters, 0);
  const totalContactedVoters = constituencies.reduce((acc, c) => acc + c.contactedVoters, 0);
  const voterContactPercent = Math.round((totalContactedVoters / totalTargetVoters) * 100);

  const activeVolunteersCount = teamMembers
    .filter((m) => m.status === 'Active')
    .reduce((acc, m) => acc + (m.volunteersLed || 1), 0);

  const upcomingActivities = activities
    .filter((a) => a.status === 'Upcoming' || a.status === 'In Progress')
    .slice(0, 4);

  const pendingTasks = tasks.filter((t) => t.status !== 'Completed');
  const criticalIssues = issues.filter((i) => i.urgency === 'Critical');

  const filteredConstituencies = constituencies.filter((c) =>
    c.name.toLowerCase().includes(constituencySearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span className="text-xs font-semibold tracking-wider text-emerald-800 uppercase">
              Campaign Headquarters · Nairobi City County
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1">
            Gubernatorial Operations Dashboard
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Operational overview across all 17 sub-counties, grassroots volunteer networks, and citizen pledges.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="default"
            onClick={onOpenAddActivity}
            className="text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Plan Activity
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onOpenAddTask}
            className="text-xs border-neutral-300"
          >
            <Plus className="w-3.5 h-3.5 text-neutral-600" />
            New Task
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onOpenAddIssue}
            className="text-xs border-neutral-300"
          >
            <Plus className="w-3.5 h-3.5 text-neutral-600" />
            Log Issue
          </Button>
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1 */}
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Voter Target Reach</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-neutral-900 font-mono tabular-nums">
              {voterContactPercent}%
            </span>
            <span className="text-xs text-emerald-700 font-medium font-mono tabular-nums">
              {(totalContactedVoters / 1000000).toFixed(2)}M / {(totalTargetVoters / 1000000).toFixed(2)}M
            </span>
          </div>
          <div className="w-full bg-neutral-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-emerald-700 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${voterContactPercent}%` }}
            />
          </div>
        </Card>

        {/* Metric 2 */}
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Field Volunteers Active</span>
            <div className="p-2 rounded-lg bg-neutral-100 text-neutral-800">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-neutral-900 font-mono tabular-nums">
              {activeVolunteersCount.toLocaleString()}
            </span>
            <span className="text-xs text-neutral-500 font-medium">across 17 wards</span>
          </div>
          <button
            onClick={() => onNavigate('team')}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-medium mt-3 flex items-center gap-1 cursor-pointer"
          >
            Manage team directory <ChevronRight className="w-3 h-3" />
          </button>
        </Card>

        {/* Metric 3 */}
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Scheduled Rallies</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-neutral-900 font-mono tabular-nums">
              {upcomingActivities.length}
            </span>
            <span className="text-xs text-neutral-500 font-medium">upcoming this week</span>
          </div>
          <button
            onClick={() => onNavigate('activities')}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-medium mt-3 flex items-center gap-1 cursor-pointer"
          >
            View calendar itinerary <ChevronRight className="w-3 h-3" />
          </button>
        </Card>

        {/* Metric 4 */}
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Urgent Field Tasks</span>
            <div className="p-2 rounded-lg bg-neutral-100 text-neutral-800">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-neutral-900 font-mono tabular-nums">
              {pendingTasks.length}
            </span>
            <span className="text-xs text-rose-700 font-medium font-mono tabular-nums">
              {criticalIssues.length} critical issues
            </span>
          </div>
          <button
            onClick={() => onNavigate('tasks')}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-medium mt-3 flex items-center gap-1 cursor-pointer"
          >
            Review action queue <ChevronRight className="w-3 h-3" />
          </button>
        </Card>
      </div>

      {/* Grid: Upcoming Activities & Critical Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Upcoming Activities */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-semibold">Immediate Activity Itinerary</CardTitle>
              <CardDescription>Rallies, town halls, and community walks scheduled</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('activities')}
              className="text-xs text-emerald-700"
            >
              All Activities ({activities.length})
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingActivities.length === 0 ? (
              <div className="text-center py-8 text-neutral-500 text-xs">
                No upcoming activities scheduled.
                <div className="mt-2">
                  <Button size="sm" variant="outline" onClick={onOpenAddActivity}>
                    Plan first activity
                  </Button>
                </div>
              </div>
            ) : (
              upcomingActivities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-start justify-between p-3 rounded-lg border border-neutral-100 hover:border-neutral-200 bg-neutral-50/50 transition-colors"
                >
                  <div className="space-y-1 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-neutral-900">{act.title}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                      <span className="flex items-center gap-1 font-medium text-emerald-800">
                        <MapPin className="w-3 h-3" />
                        {act.constituency} · {act.venue}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {act.dateTime}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-600 line-clamp-1">{act.notes}</p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <Badge variant={act.status === 'In Progress' ? 'green' : 'black'}>
                      {act.status}
                    </Badge>
                    <span className="text-[11px] text-neutral-500 font-mono tabular-nums">
                      ~{act.expectedAttendance.toLocaleString()} pax
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Priority Action Queue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-semibold">Priority Field Assignments</CardTitle>
              <CardDescription>Logistics, sound permits, and ward volunteer rosters</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('tasks')}
              className="text-xs text-emerald-700"
            >
              All Tasks ({tasks.length})
            </Button>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {pendingTasks.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className="flex items-start justify-between p-2.5 rounded-lg border border-neutral-100 hover:bg-neutral-50/70 transition-colors"
              >
                <div className="flex items-start gap-2.5 pr-2">
                  <button
                    onClick={() => onToggleTaskStatus(task.id)}
                    className="mt-0.5 text-neutral-400 hover:text-emerald-700 transition-colors cursor-pointer"
                    title="Click to toggle status"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-900 leading-snug">
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-500">
                      <span>{task.assigneeName}</span>
                      <span>·</span>
                      <span className="font-mono tabular-nums">Due {task.dueDate}</span>
                      <span>·</span>
                      <span>{task.constituency}</span>
                    </div>
                  </div>
                </div>
                <div className="shrink-0">
                  <Badge variant={task.priority === 'High' ? 'urgent' : 'outline'}>
                    {task.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Constituency Progress Tracker (All 17 Nairobi Sub-Counties) */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
          <div>
            <CardTitle className="text-sm font-semibold">
              Constituency & Sub-County Ground Operations
            </CardTitle>
            <CardDescription>
              Grassroots voter penetration, ground activities, and top citizen concerns across Nairobi
            </CardDescription>
          </div>
          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Filter sub-county (e.g. Kibra, Kasarani)..."
              value={constituencySearch}
              onChange={(e) => setConstituencySearch(e.target.value)}
              className="w-full h-8 px-3 text-xs rounded-lg border border-neutral-300 bg-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-y border-neutral-200 text-neutral-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-4">Sub-County</th>
                  <th className="py-2.5 px-3">Voter Contact Progress</th>
                  <th className="py-2.5 px-3 text-right">Target Voters</th>
                  <th className="py-2.5 px-3 text-right">Volunteers</th>
                  <th className="py-2.5 px-3 text-right">Activities</th>
                  <th className="py-2.5 px-4">Top Citizen Concern</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredConstituencies.map((con) => {
                  const pct = Math.round((con.contactedVoters / con.targetVoters) * 100);
                  return (
                    <tr key={con.name} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3 px-4 font-semibold text-neutral-900">
                        {con.name}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-neutral-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-emerald-700 h-1.5 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="font-mono tabular-nums text-neutral-700 font-medium">
                            {pct}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-neutral-600">
                        {con.targetVoters.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-neutral-800 font-medium">
                        {con.activeVolunteers}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-emerald-800 font-medium">
                        {con.activitiesCount}
                      </td>
                      <td className="py-3 px-4 text-neutral-600 truncate max-w-xs" title={con.topConcern}>
                        {con.topConcern}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
