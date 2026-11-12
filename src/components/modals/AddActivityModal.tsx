import React, { useState } from 'react';
import { Dialog } from '../ui/dialog';
import { Input, Textarea } from '../ui/input';
import { Select } from '../ui/select';
import { Button } from '../ui/button';
import { Activity, ActivityType, ActivityStatus } from '../../types/campaign';
import { NAIROBI_CONSTITUENCIES } from '../../data/mockData';

interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddActivity: (activity: Activity) => void;
}

export const AddActivityModal: React.FC<AddActivityModalProps> = ({
  isOpen,
  onClose,
  onAddActivity,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ActivityType>('Town Hall');
  const [constituency, setConstituency] = useState<string>(NAIROBI_CONSTITUENCIES[0]);
  const [ward, setWard] = useState('');
  const [venue, setVenue] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [expectedAttendance, setExpectedAttendance] = useState('500');
  const [leadCoordinator, setLeadCoordinator] = useState('');
  const [status, setStatus] = useState<ActivityStatus>('Upcoming');
  const [permitsCleared, setPermitsCleared] = useState(false);
  const [budgetKSh, setBudgetKSh] = useState('50000');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !venue.trim()) return;

    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      title: title.trim(),
      type,
      constituency,
      ward: ward.trim() || 'Central Ward',
      venue: venue.trim(),
      dateTime: dateTime || new Date().toISOString().slice(0, 16).replace('T', ' '),
      expectedAttendance: Number(expectedAttendance) || 0,
      leadCoordinator: leadCoordinator.trim() || 'Field Ops Secretariat',
      status,
      permitsCleared,
      budgetKSh: Number(budgetKSh) || 0,
      notes: notes.trim(),
    };

    onAddActivity(newActivity);
    // Reset form
    setTitle('');
    setWard('');
    setVenue('');
    setNotes('');
    setDateTime('');
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Plan Campaign Activity"
      description="Schedule a rally, town hall, or voter canvassing event in Nairobi county."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Activity Title *
          </label>
          <Input
            required
            placeholder="e.g. Kangemi Traders Town Hall & Manifesto Launch"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Activity Type
            </label>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value as ActivityType)}
            >
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
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Constituency
            </label>
            <Select
              value={constituency}
              onChange={(e) => setConstituency(e.target.value)}
            >
              {NAIROBI_CONSTITUENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Ward / Neighborhood
            </label>
            <Input
              placeholder="e.g. Kangemi, Makina, Roysambu"
              value={ward}
              onChange={(e) => setWard(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Venue / Staging Ground *
            </label>
            <Input
              required
              placeholder="e.g. Jacaranda Grounds, Kangemi Social Hall"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Date & Scheduled Time
            </label>
            <Input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Target Turnout / Attendees
            </label>
            <Input
              type="number"
              min="10"
              value={expectedAttendance}
              onChange={(e) => setExpectedAttendance(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Lead Coordinator
            </label>
            <Input
              placeholder="e.g. David Kimani (Field Ops)"
              value={leadCoordinator}
              onChange={(e) => setLeadCoordinator(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Initial Status
            </label>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as ActivityStatus)}
            >
              <option value="Upcoming">Upcoming</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Postponed">Postponed</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Estimated Budget (KSh)
            </label>
            <Input
              type="number"
              value={budgetKSh}
              onChange={(e) => setBudgetKSh(e.target.value)}
            />
          </div>

          <div className="flex items-center pt-5">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-neutral-700">
              <input
                type="checkbox"
                checked={permitsCleared}
                onChange={(e) => setPermitsCleared(e.target.checked)}
                className="w-4 h-4 rounded border-neutral-300 text-emerald-700 focus:ring-emerald-700"
              />
              Police & NEMA Sound Permits Cleared
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Logistical Notes / Agenda
          </label>
          <Textarea
            placeholder="Key talking points, PA sound requirements, security marshals..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-2.5 pt-3 border-t border-neutral-100">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="default" size="sm">
            Save Activity
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
