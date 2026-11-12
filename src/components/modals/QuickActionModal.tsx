import React from 'react';
import { Dialog } from '../ui/dialog';
import { Calendar, CheckSquare, MessageSquare, UserPlus } from 'lucide-react';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: 'activity' | 'task' | 'issue' | 'team') => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  const actions = [
    {
      id: 'activity' as const,
      title: 'Plan Campaign Activity',
      description: 'Schedule a mega rally, town hall, or voter canvassing drive.',
      icon: <Calendar className="w-5 h-5 text-emerald-700" />,
    },
    {
      id: 'task' as const,
      title: 'Create Logistics Task',
      description: 'Assign sound systems, police permits, or print materials to staff.',
      icon: <CheckSquare className="w-5 h-5 text-emerald-700" />,
    },
    {
      id: 'issue' as const,
      title: 'Log Community Issue',
      description: 'Record water rationing, feeder road, or youth employment concerns.',
      icon: <MessageSquare className="w-5 h-5 text-emerald-700" />,
    },
    {
      id: 'team' as const,
      title: 'Add Campaign Team Member',
      description: 'Onboard a ward mobilizer, sub-county coordinator, or volunteer.',
      icon: <UserPlus className="w-5 h-5 text-emerald-700" />,
    },
  ];

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Quick Campaign Actions"
      description="Choose a record to create in the Nairobi campaign operational log."
    >
      <div className="grid grid-cols-1 gap-2.5">
        {actions.map((act) => (
          <button
            key={act.id}
            onClick={() => {
              onClose();
              onSelectAction(act.id);
            }}
            className="flex items-start gap-3.5 p-3.5 rounded-xl border border-neutral-200 hover:border-emerald-700 hover:bg-emerald-50/40 text-left transition-all cursor-pointer group"
          >
            <div className="p-2.5 rounded-lg bg-neutral-100 group-hover:bg-emerald-100/60 transition-colors shrink-0">
              {act.icon}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-900 group-hover:text-emerald-900">
                {act.title}
              </h4>
              <p className="text-xs text-neutral-500 mt-0.5">{act.description}</p>
            </div>
          </button>
        ))}
      </div>
    </Dialog>
  );
};
