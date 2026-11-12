import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select } from '../ui/select';
import { Input } from '../ui/input';
import { Activity, ActivityStatus, ActivityType } from '../../types/campaign';
import { NAIROBI_CONSTITUENCIES } from '../../data/mockData';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ShieldCheck,
  ShieldAlert,
  Plus,
  Search,
  Filter,
  CheckCircle,
  Coins,
} from 'lucide-react';

interface ActivitiesViewProps {
  activities: Activity[];
  onOpenAddModal: () => void;
  onUpdateStatus: (id: string, newStatus: ActivityStatus) => void;
  onDeleteActivity: (id: string) => void;
}

export const ActivitiesView: React.FC<ActivitiesViewProps> = ({
  activities,
  onOpenAddModal,
  onUpdateStatus,
  onDeleteActivity,
}) => {
  const [search, setSearch] = useState('');
  const [selectedConstituency, setSelectedConstituency] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filtered = activities.filter((act) => {
    const matchesSearch =
      act.title.toLowerCase().includes(search.toLowerCase()) ||
      act.venue.toLowerCase().includes(search.toLowerCase()) ||
      act.leadCoordinator.toLowerCase().includes(search.toLowerCase());
    const matchesCon = selectedConstituency === 'all' || act.constituency === selectedConstituency;
    const matchesType = selectedType === 'all' || act.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || act.status === selectedStatus;
    return matchesSearch && matchesCon && matchesType && matchesStatus;
  });

  const totalCrowd = activities.reduce((acc, a) => acc + a.expectedAttendance, 0);
  const upcomingCount = activities.filter((a) => a.status === 'Upcoming').length;
  const completedCount = activities.filter((a) => a.status === 'Completed').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Campaign Activities & Rallies
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Coordinate mega rallies, market walks, town halls, and grassroots door-to-door tours across Nairobi.
          </p>
        </div>
        <Button onClick={onOpenAddModal} variant="default" size="sm" className="text-xs">
          <Plus className="w-3.5 h-3.5" />
          Plan New Activity
        </Button>
      </div>

      {/* Metric Quick Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-lg border border-neutral-200">
          <span className="text-[11px] font-medium text-neutral-500">Total Planned Events</span>
          <p className="text-xl font-bold text-neutral-900 font-mono tabular-nums mt-0.5">
            {activities.length}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-neutral-200">
          <span className="text-[11px] font-medium text-neutral-500">Upcoming This Period</span>
          <p className="text-xl font-bold text-emerald-700 font-mono tabular-nums mt-0.5">
            {upcomingCount}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-neutral-200">
          <span className="text-[11px] font-medium text-neutral-500">Completed Outreaches</span>
          <p className="text-xl font-bold text-neutral-800 font-mono tabular-nums mt-0.5">
            {completedCount}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-neutral-200">
          <span className="text-[11px] font-medium text-neutral-500">Estimated Total Reach</span>
          <p className="text-xl font-bold text-neutral-900 font-mono tabular-nums mt-0.5">
            {totalCrowd.toLocaleString()} pax
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
            <Input
              placeholder="Search title, venue, coordinator..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 text-xs"
            />
          </div>

          <div>
            <Select
              value={selectedConstituency}
              onChange={(e) => setSelectedConstituency(e.target.value)}
              className="h-10 text-xs"
            >
              <option value="all">All Nairobi Constituencies</option>
              {NAIROBI_CONSTITUENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="h-10 text-xs"
            >
              <option value="all">All Activity Types</option>
              <option value="Rally">Mega Rally</option>
              <option value="Town Hall">Town Hall</option>
              <option value="Door-to-Door Canvassing">Door-to-Door Canvassing</option>
              <option value="Market Walk">Market Walk</option>
              <option value="Youth Forum">Youth Forum</option>
              <option value="Media & Press Briefing">Media & Press Briefing</option>
              <option value="Boda Boda Outreach">Boda Boda Outreach</option>
            </Select>
          </div>

          <div>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-10 text-xs"
            >
              <option value="all">All Statuses</option>
              <option value="Upcoming">Upcoming</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Postponed">Postponed</option>
            </Select>
          </div>
        </div>

        {(search || selectedConstituency !== 'all' || selectedType !== 'all' || selectedStatus !== 'all') && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100 text-xs text-neutral-600">
            <span>
              Showing {filtered.length} of {activities.length} activities
            </span>
            <button
              onClick={() => {
                setSearch('');
                setSelectedConstituency('all');
                setSelectedType('all');
                setSelectedStatus('all');
              }}
              className="text-emerald-700 hover:text-emerald-800 font-medium cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        )}
      </Card>

      {/* Activity Cards List */}
      <div className="space-y-3.5">
        {filtered.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-neutral-200">
            <Calendar className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-neutral-900">No activities match your criteria</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search query, or plan a new activity in one of the 17 Nairobi sub-counties.
            </p>
            <div className="mt-4">
              <Button size="sm" onClick={onOpenAddModal}>
                <Plus className="w-3.5 h-3.5" />
                Plan Activity
              </Button>
            </div>
          </div>
        ) : (
          filtered.map((act) => (
            <Card key={act.id} className="overflow-hidden hover:border-neutral-300 transition-colors">
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: Details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-neutral-900">{act.title}</h3>
                      <Badge variant={act.status === 'Completed' ? 'green' : act.status === 'In Progress' ? 'warning' : 'black'}>
                        {act.status}
                      </Badge>
                      <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {act.type}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-neutral-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span className="font-semibold text-neutral-800">{act.constituency}</span>
                        <span className="text-neutral-400">·</span>
                        <span className="truncate">{act.venue}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span className="font-mono tabular-nums">{act.dateTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span className="font-mono tabular-nums font-medium text-neutral-800">
                          {act.expectedAttendance.toLocaleString()} expected
                        </span>
                      </div>
                    </div>

                    {act.notes && (
                      <p className="text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded-lg border border-neutral-100">
                        {act.notes}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-500">
                      <span>Lead: <strong className="text-neutral-700">{act.leadCoordinator}</strong></span>
                      <span>·</span>
                      {act.budgetKSh ? (
                        <span className="flex items-center gap-1 font-mono">
                          <Coins className="w-3 h-3 text-neutral-400" />
                          KSh {act.budgetKSh.toLocaleString()}
                        </span>
                      ) : null}
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        {act.permitsCleared ? (
                          <span className="text-emerald-700 flex items-center gap-1 font-medium">
                            <ShieldCheck className="w-3.5 h-3.5" /> Permits Cleared
                          </span>
                        ) : (
                          <span className="text-amber-700 flex items-center gap-1 font-medium">
                            <ShieldAlert className="w-3.5 h-3.5" /> Permits Pending
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2 shrink-0 pt-2 lg:pt-0 border-t sm:border-t-0 border-neutral-100">
                    <Select
                      value={act.status}
                      onChange={(e) => onUpdateStatus(act.id, e.target.value as ActivityStatus)}
                      className="h-8 text-xs w-36"
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Postponed">Postponed</option>
                    </Select>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (window.confirm(`Delete activity "${act.title}"?`)) {
                          onDeleteActivity(act.id);
                        }
                      }}
                      className="text-xs text-neutral-500 hover:text-rose-700 h-8 px-2"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
