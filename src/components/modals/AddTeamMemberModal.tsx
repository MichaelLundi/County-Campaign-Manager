import React, { useState } from 'react';
import { Dialog } from '../ui/dialog';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Button } from '../ui/button';
import { TeamMember, TeamRole } from '../../types/campaign';
import { NAIROBI_CONSTITUENCIES } from '../../data/mockData';

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (member: TeamMember) => void;
}

export const AddTeamMemberModal: React.FC<AddTeamMemberModalProps> = ({
  isOpen,
  onClose,
  onAddMember,
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<TeamRole>('Ward Mobilizer');
  const [constituency, setConstituency] = useState<string>(NAIROBI_CONSTITUENCIES[0]);
  const [ward, setWard] = useState('');
  const [phone, setPhone] = useState('+254 ');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'Active' | 'On Leave' | 'Standby'>('Active');
  const [volunteersLed, setVolunteersLed] = useState('25');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      name: name.trim(),
      role,
      constituency,
      ward: ward.trim() || 'Central Ward',
      phone: phone.trim() || '+254 700 000 000',
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@campaign.nairobi.org`,
      status,
      volunteersLed: Number(volunteersLed) || 0,
      joinedDate: new Date().toISOString().slice(0, 10),
    };

    onAddMember(newMember);
    setName('');
    setWard('');
    setPhone('+254 ');
    setEmail('');
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Onboard Campaign Team Member"
      description="Register sub-county directors, ward mobilizers, and grassroots volunteer leaders."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Full Name *
          </label>
          <Input
            required
            placeholder="e.g. Dennis Kiprop or Sharon Mutiso"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Campaign Role
            </label>
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value as TeamRole)}
            >
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
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Assigned Constituency
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
              Assigned Ward
            </label>
            <Input
              placeholder="e.g. Kangemi, Woodley, Zimmerman"
              value={ward}
              onChange={(e) => setWard(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Status
            </label>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'Active' | 'On Leave' | 'Standby')}
            >
              <option value="Active">Active Duty</option>
              <option value="Standby">Standby</option>
              <option value="On Leave">On Leave</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Phone Number
            </label>
            <Input
              type="tel"
              placeholder="+254 7XX XXX XXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Official Email
            </label>
            <Input
              type="email"
              placeholder="name@campaign.nairobi.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Grassroots Field Team / Volunteers Led
          </label>
          <Input
            type="number"
            min="0"
            value={volunteersLed}
            onChange={(e) => setVolunteersLed(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2.5 pt-3 border-t border-neutral-100">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="default" size="sm">
            Save Team Member
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
