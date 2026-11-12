import React, { useState } from 'react';
import { Dialog } from '../ui/dialog';
import { Input, Textarea } from '../ui/input';
import { Select } from '../ui/select';
import { Button } from '../ui/button';
import { CommunityIssue, IssueCategory, IssueUrgency, IssueStatus } from '../../types/campaign';
import { NAIROBI_CONSTITUENCIES } from '../../data/mockData';

interface AddIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddIssue: (issue: CommunityIssue) => void;
}

export const AddIssueModal: React.FC<AddIssueModalProps> = ({
  isOpen,
  onClose,
  onAddIssue,
}) => {
  const [title, setTitle] = useState('');
  const [constituency, setConstituency] = useState<string>(NAIROBI_CONSTITUENCIES[0]);
  const [ward, setWard] = useState('');
  const [category, setCategory] = useState<IssueCategory>('Water & Sanitation');
  const [urgency, setUrgency] = useState<IssueUrgency>('High');
  const [status, setStatus] = useState<IssueStatus>('Under Review');
  const [summary, setSummary] = useState('');
  const [pledgedAction, setPledgedAction] = useState('');
  const [reportedBy, setReportedBy] = useState('');
  const [votesImpactedApprox, setVotesImpactedApprox] = useState('5000');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;

    const newIssue: CommunityIssue = {
      id: `iss-${Date.now()}`,
      title: title.trim(),
      constituency,
      ward: ward.trim() || 'Central Ward',
      category,
      urgency,
      status,
      reportedDate: new Date().toISOString().slice(0, 10),
      summary: summary.trim(),
      pledgedAction: pledgedAction.trim() || 'Campaign committee will incorporate this into the ward infrastructure action budget.',
      reportedBy: reportedBy.trim() || 'Community Residents Committee',
      votesImpactedApprox: Number(votesImpactedApprox) || 0,
    };

    onAddIssue(newIssue);
    setTitle('');
    setWard('');
    setSummary('');
    setPledgedAction('');
    setReportedBy('');
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Log Community Grievance / Issue"
      description="Record citizen issues, service delivery deficits, and campaign policy pledges."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Issue Headline *
          </label>
          <Input
            required
            placeholder="e.g. Uncollected garbage blocking feeder culvert near stage"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Ward / Estate
            </label>
            <Input
              placeholder="e.g. Zimmerman, Pumwani, Kangemi"
              value={ward}
              onChange={(e) => setWard(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Category
            </label>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value as IssueCategory)}
            >
              <option value="Water & Sanitation">Water & Sanitation</option>
              <option value="Youth & Enterprise">Youth & Enterprise</option>
              <option value="Feeder Roads & Drainage">Feeder Roads & Drainage</option>
              <option value="Healthcare & Dispensaries">Healthcare & Dispensaries</option>
              <option value="Street Lighting & Safety">Street Lighting & Safety</option>
              <option value="Market Stalls & Trading">Market Stalls & Trading</option>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Urgency
            </label>
            <Select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value as IssueUrgency)}
            >
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Action Status
            </label>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as IssueStatus)}
            >
              <option value="Under Review">Under Review</option>
              <option value="Action Plan Ready">Action Plan Ready</option>
              <option value="Addressed / Pledged">Addressed / Pledged</option>
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Community Grievance Summary *
          </label>
          <Textarea
            required
            placeholder="Describe what the local community reported, how long it has persisted, and affected groups..."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={2}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Campaign Pledged Solution / Manifesto Commitment
          </label>
          <Textarea
            placeholder="What will the Governor candidate deliver to fix this when elected? e.g. install solar high mast floodlight, pipe audit..."
            value={pledgedAction}
            onChange={(e) => setPledgedAction(e.target.value)}
            rows={2}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Reported By / Source
            </label>
            <Input
              placeholder="e.g. Boda Boda Sacco Elders, Market Traders Caucus"
              value={reportedBy}
              onChange={(e) => setReportedBy(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Approximate Affected Residents
            </label>
            <Input
              type="number"
              value={votesImpactedApprox}
              onChange={(e) => setVotesImpactedApprox(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2.5 pt-3 border-t border-neutral-100">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="default" size="sm">
            Save Issue
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
