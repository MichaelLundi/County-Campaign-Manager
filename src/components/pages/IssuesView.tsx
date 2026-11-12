import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select } from '../ui/select';
import { Input } from '../ui/input';
import { CommunityIssue, IssueCategory, IssueUrgency, IssueStatus } from '../../types/campaign';
import { NAIROBI_CONSTITUENCIES } from '../../data/mockData';
import {
  MessageSquare,
  MapPin,
  AlertOctagon,
  CheckCircle2,
  Calendar,
  Users,
  Plus,
  Search,
  BookOpenCheck,
  Trash2,
} from 'lucide-react';

interface IssuesViewProps {
  issues: CommunityIssue[];
  onOpenAddModal: () => void;
  onUpdateStatus: (id: string, newStatus: IssueStatus) => void;
  onDeleteIssue: (id: string) => void;
}

export const IssuesView: React.FC<IssuesViewProps> = ({
  issues,
  onOpenAddModal,
  onUpdateStatus,
  onDeleteIssue,
}) => {
  const [search, setSearch] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [constituencyFilter, setConstituencyFilter] = useState<string>('all');

  const filtered = issues.filter((iss) => {
    const matchesSearch =
      iss.title.toLowerCase().includes(search.toLowerCase()) ||
      iss.summary.toLowerCase().includes(search.toLowerCase()) ||
      iss.pledgedAction.toLowerCase().includes(search.toLowerCase()) ||
      iss.reportedBy.toLowerCase().includes(search.toLowerCase());
    const matchesUrgency = urgencyFilter === 'all' || iss.urgency === urgencyFilter;
    const matchesStatus = statusFilter === 'all' || iss.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || iss.category === categoryFilter;
    const matchesCon = constituencyFilter === 'all' || iss.constituency === constituencyFilter;
    return matchesSearch && matchesUrgency && matchesStatus && matchesCategory && matchesCon;
  });

  const criticalCount = issues.filter((i) => i.urgency === 'Critical').length;
  const planReadyCount = issues.filter((i) => i.status === 'Action Plan Ready').length;
  const pledgedCount = issues.filter((i) => i.status === 'Addressed / Pledged').length;
  const totalImpacted = issues.reduce((acc, i) => acc + (i.votesImpactedApprox || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Community Grievances & Policy Commitments
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Document grassroots citizen priorities across Nairobi wards and articulate candidate manifesto commitments.
          </p>
        </div>
        <Button onClick={onOpenAddModal} variant="default" size="sm" className="text-xs">
          <Plus className="w-3.5 h-3.5" />
          Log Community Issue
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-lg border border-neutral-200">
          <span className="text-[11px] font-medium text-neutral-500">Critical Hotspots</span>
          <p className="text-xl font-bold text-rose-700 font-mono tabular-nums mt-0.5">
            {criticalCount}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-neutral-200">
          <span className="text-[11px] font-medium text-neutral-500">Action Plans Ready</span>
          <p className="text-xl font-bold text-neutral-900 font-mono tabular-nums mt-0.5">
            {planReadyCount}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-neutral-200">
          <span className="text-[11px] font-medium text-neutral-500">Pledged Commitments</span>
          <p className="text-xl font-bold text-emerald-700 font-mono tabular-nums mt-0.5">
            {pledgedCount}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-neutral-200">
          <span className="text-[11px] font-medium text-neutral-500">Residents Represented</span>
          <p className="text-xl font-bold text-neutral-900 font-mono tabular-nums mt-0.5">
            ~{totalImpacted.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
            <Input
              placeholder="Search grievances, keywords, sources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 text-xs"
            />
          </div>

          <div>
            <Select
              value={constituencyFilter}
              onChange={(e) => setConstituencyFilter(e.target.value)}
              className="h-10 text-xs"
            >
              <option value="all">All Sub-Counties</option>
              {NAIROBI_CONSTITUENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="h-10 text-xs"
            >
              <option value="all">All Urgency Levels</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
            </Select>
          </div>

          <div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 text-xs"
            >
              <option value="all">All Policy Statuses</option>
              <option value="Under Review">Under Review</option>
              <option value="Action Plan Ready">Action Plan Ready</option>
              <option value="Addressed / Pledged">Addressed / Pledged</option>
            </Select>
          </div>
        </div>

        {(search || urgencyFilter !== 'all' || statusFilter !== 'all' || constituencyFilter !== 'all') && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100 text-xs text-neutral-600">
            <span>
              Showing {filtered.length} of {issues.length} logged grievances
            </span>
            <button
              onClick={() => {
                setSearch('');
                setUrgencyFilter('all');
                setStatusFilter('all');
                setCategoryFilter('all');
                setConstituencyFilter('all');
              }}
              className="text-emerald-700 hover:text-emerald-800 font-medium cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        )}
      </Card>

      {/* Issues Cards */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-neutral-200">
            <MessageSquare className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-neutral-900">No community issues found</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              No reported grievances match this filter. Log a new citizen concern from a town hall or market tour.
            </p>
            <div className="mt-4">
              <Button size="sm" onClick={onOpenAddModal}>
                <Plus className="w-3.5 h-3.5" />
                Log Community Issue
              </Button>
            </div>
          </div>
        ) : (
          filtered.map((iss) => (
            <Card key={iss.id} className="hover:border-neutral-300 transition-colors">
              <CardContent className="p-4 sm:p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-neutral-900">{iss.title}</h3>
                      <Badge variant={iss.urgency === 'Critical' ? 'urgent' : iss.urgency === 'High' ? 'warning' : 'neutral'}>
                        {iss.urgency} Urgency
                      </Badge>
                      <Badge variant={iss.status === 'Addressed / Pledged' ? 'green' : 'black'}>
                        {iss.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                      <span className="flex items-center gap-1 font-semibold text-emerald-800">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                        {iss.constituency} ({iss.ward})
                      </span>
                      <span>·</span>
                      <span className="bg-neutral-100 text-neutral-700 px-1.5 py-0.5 rounded text-[11px] font-medium">
                        {iss.category}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3 text-neutral-400" />
                        Reported {iss.reportedDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                    <Select
                      value={iss.status}
                      onChange={(e) => onUpdateStatus(iss.id, e.target.value as IssueStatus)}
                      className="h-8 text-xs w-40"
                    >
                      <option value="Under Review">Under Review</option>
                      <option value="Action Plan Ready">Action Plan Ready</option>
                      <option value="Addressed / Pledged">Addressed / Pledged</option>
                    </Select>

                    <button
                      onClick={() => onDeleteIssue(iss.id)}
                      className="p-1.5 text-neutral-400 hover:text-rose-700 transition-colors cursor-pointer"
                      title="Delete issue"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Grievance Body */}
                <div className="text-xs text-neutral-700 leading-relaxed bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                  <span className="font-semibold text-neutral-900 block mb-1">
                    Grassroots Problem Report:
                  </span>
                  {iss.summary}
                </div>

                {/* Campaign Pledge Solution */}
                <div className="text-xs text-emerald-950 leading-relaxed bg-emerald-50/70 p-3 rounded-lg border border-emerald-200">
                  <span className="font-semibold text-emerald-900 flex items-center gap-1.5 mb-1">
                    <BookOpenCheck className="w-3.5 h-3.5 text-emerald-700" />
                    Candidate Pledged Manifesto Response:
                  </span>
                  {iss.pledgedAction}
                </div>

                {/* Footer Metadata */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-neutral-500 border-t border-neutral-100">
                  <span>Source: <strong className="text-neutral-700">{iss.reportedBy}</strong></span>
                  {iss.votesImpactedApprox ? (
                    <span className="flex items-center gap-1 font-mono tabular-nums">
                      <Users className="w-3 h-3 text-neutral-400" />
                      ~{iss.votesImpactedApprox.toLocaleString()} affected residents
                    </span>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
