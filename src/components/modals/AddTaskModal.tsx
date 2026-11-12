import React, { useState } from 'react';
import { Dialog } from '../ui/dialog';
import { Input, Textarea } from '../ui/input';
import { Select } from '../ui/select';
import { Button } from '../ui/button';
import { CampaignTask, TaskCategory, TaskPriority, TaskStatus } from '../../types/campaign';
import { NAIROBI_CONSTITUENCIES } from '../../data/mockData';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: CampaignTask) => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Logistics & Audio');
  const [priority, setPriority] = useState<TaskPriority>('High');
  const [status, setStatus] = useState<TaskStatus>('Pending');
  const [assigneeName, setAssigneeName] = useState('');
  const [assigneeRole, setAssigneeRole] = useState('Sub-County Coordinator');
  const [dueDate, setDueDate] = useState('');
  const [constituency, setConstituency] = useState<string>(NAIROBI_CONSTITUENCIES[0]);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: CampaignTask = {
      id: `tsk-${Date.now()}`,
      title: title.trim(),
      category,
      priority,
      status,
      assigneeName: assigneeName.trim() || 'Field Operations Desk',
      assigneeRole: assigneeRole.trim(),
      dueDate: dueDate || new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
      constituency,
      notes: notes.trim(),
    };

    onAddTask(newTask);
    setTitle('');
    setAssigneeName('');
    setNotes('');
    setDueDate('');
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Create Campaign Task"
      description="Assign field assignments, sound logistics, permit paperwork, or canvassing goals."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Task Description *
          </label>
          <Input
            required
            placeholder="e.g. Inspect wireless microphones and backup generator for Pumwani"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Category
            </label>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value as TaskCategory)}
            >
              <option value="Logistics & Audio">Logistics & Audio</option>
              <option value="Canvassing & Field">Canvassing & Field</option>
              <option value="Media & Comms">Media & Comms</option>
              <option value="Permits & Protocol">Permits & Protocol</option>
              <option value="Youth & Women Mobilization">Youth & Women Mobilization</option>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Priority
            </label>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
            >
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Assignee Name
            </label>
            <Input
              placeholder="e.g. Peter Njoroge"
              value={assigneeName}
              onChange={(e) => setAssigneeName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Assignee Role
            </label>
            <Select
              value={assigneeRole}
              onChange={(e) => setAssigneeRole(e.target.value)}
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Target Constituency
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
              Due Date
            </label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Status
            </label>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Operational Details
          </label>
          <Textarea
            placeholder="Special instructions, contact numbers, or delivery locations..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
          />
        </div>

        <div className="flex justify-end gap-2.5 pt-3 border-t border-neutral-100">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="default" size="sm">
            Save Task
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
