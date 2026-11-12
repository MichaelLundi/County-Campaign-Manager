import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select } from '../ui/select';
import { Input } from '../ui/input';
import { TeamMember, TeamRole } from '../../types/campaign';
import { NAIROBI_CONSTITUENCIES } from '../../data/mockData';
import {
  Users,
  UserPlus,
  Phone,
  Mail,
  MapPin,
  Search,
  Award,
  Calendar,
  Trash2,
} from 'lucide-react';

interface TeamViewProps {
  teamMembers: TeamMember[];
  onOpenAddModal: () => void;
  onUpdateStatus: (id: string, newStatus: 'Active' | 'On Leave' | 'Standby') => void;
  onDeleteMember: (id: string) => void;
}

export const TeamView: React.FC<TeamViewProps> = ({
  teamMembers,
  onOpenAddModal,
  onUpdateStatus,
  onDeleteMember,
}) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [constituencyFilter, setConstituencyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = teamMembers.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.includes(search) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.ward.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || m.role === roleFilter;
    const matchesCon = constituencyFilter === 'all' || m.constituency === constituencyFilter;
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesSearch && matchesRole && matchesCon && matchesStatus;
  });

  const activeCount = teamMembers.filter((m) => m.status === 'Active').length;
  const totalVolunteersMobilized = teamMembers.reduce((acc, m) => acc + (m.volunteersLed || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Campaign Team & Volunteer Secretariat
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage sub-county coordinators, ward mobilizers, communication spokespersons, and grassroots volunteer captains.
          </p>
        </div>
        <Button onClick={onOpenAddModal} variant="default" size="sm" className="text-xs">
          <UserPlus className="w-3.5 h-3.5" />
          Add Team Member
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-lg border border-neutral-200">
          <span className="text-[11px] font-medium text-neutral-500">Key Staff & Leads</span>
          <p className="text-xl font-bold text-neutral-900 font-mono tabular-nums mt-0.5">
            {teamMembers.length}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-neutral-200">
          <span className="text-[11px] font-medium text-neutral-500">Active On Duty</span>
          <p className="text-xl font-bold text-emerald-700 font-mono tabular-nums mt-0.5">
            {activeCount}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-neutral-200">
          <span className="text-[11px] font-medium text-neutral-500">Grassroots Marshals</span>
          <p className="text-xl font-bold text-neutral-900 font-mono tabular-nums mt-0.5">
            {totalVolunteersMobilized.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-neutral-200">
          <span className="text-[11px] font-medium text-neutral-500">Covered Sub-Counties</span>
          <p className="text-xl font-bold text-neutral-800 font-mono tabular-nums mt-0.5">
            17 of 17
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
            <Input
              placeholder="Search by name, phone, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 text-xs"
            />
          </div>

          <div>
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-10 text-xs"
            >
              <option value="all">All Campaign Roles</option>
              <option value="Campaign Manager">Campaign Manager</option>
              <option value="Field Director">Field Director</option>
              <option value="Communications & Media Lead">Communications & Media Lead</option>
              <option value="Sub-County Coordinator">Sub-County Coordinator</option>
              <option value="Ward Mobilizer">Ward Mobilizer</option>
              <option value="Youth Wing Lead">Youth Wing Lead</option>
              <option value="Field Volunteer">Field Volunteer</option>
            </Select>
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 text-xs"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Standby">Standby</option>
              <option value="On Leave">On Leave</option>
            </Select>
          </div>
        </div>

        {(search || roleFilter !== 'all' || constituencyFilter !== 'all' || statusFilter !== 'all') && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100 text-xs text-neutral-600">
            <span>
              Showing {filtered.length} of {teamMembers.length} team members
            </span>
            <button
              onClick={() => {
                setSearch('');
                setRoleFilter('all');
                setConstituencyFilter('all');
                setStatusFilter('all');
              }}
              className="text-emerald-700 hover:text-emerald-800 font-medium cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        )}
      </Card>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center rounded-xl border border-neutral-200">
            <Users className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-neutral-900">No team members match query</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              Check your search keywords or onboard a new coordinator or volunteer.
            </p>
            <div className="mt-4">
              <Button size="sm" onClick={onOpenAddModal}>
                <UserPlus className="w-3.5 h-3.5" />
                Add Team Member
              </Button>
            </div>
          </div>
        ) : (
          filtered.map((member) => (
            <Card key={member.id} className="hover:border-neutral-300 transition-colors">
              <CardContent className="p-4 sm:p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-900 text-white font-bold flex items-center justify-center text-xs shrink-0">
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 leading-tight">
                        {member.name}
                      </h3>
                      <p className="text-xs font-medium text-emerald-800 mt-0.5">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  <Badge variant={member.status === 'Active' ? 'green' : 'neutral'}>
                    {member.status}
                  </Badge>
                </div>

                {/* Territory */}
                <div className="text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded-lg border border-neutral-100 space-y-1">
                  <div className="flex items-center gap-1.5 font-medium text-neutral-800">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{member.constituency}</span>
                    <span className="text-neutral-400">·</span>
                    <span className="text-neutral-600">{member.ward}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-500 text-[11px]">
                    <Award className="w-3 h-3 text-neutral-400" />
                    <span>Leads <strong>{member.volunteersLed}</strong> registered field volunteers</span>
                  </div>
                </div>

                {/* Contact info */}
                <div className="space-y-1 text-xs text-neutral-600 pt-1">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <a
                      href={`tel:${member.phone.replace(/\s+/g, '')}`}
                      className="hover:text-emerald-700 transition-colors font-mono tabular-nums text-xs"
                    >
                      {member.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate text-xs text-neutral-500">{member.email}</span>
                  </div>
                </div>

                {/* Footer and status changer */}
                <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-xs">
                  <Select
                    value={member.status}
                    onChange={(e) => onUpdateStatus(member.id, e.target.value as 'Active' | 'On Leave' | 'Standby')}
                    className="h-7 text-[11px] w-28"
                  >
                    <option value="Active">Active</option>
                    <option value="Standby">Standby</option>
                    <option value="On Leave">On Leave</option>
                  </Select>

                  <button
                    onClick={() => {
                      if (window.confirm(`Remove ${member.name} from the campaign roster?`)) {
                        onDeleteMember(member.id);
                      }
                    }}
                    className="p-1.5 text-neutral-400 hover:text-rose-700 transition-colors cursor-pointer"
                    title="Remove member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
