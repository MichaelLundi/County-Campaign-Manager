import React from 'react';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { CheckCircle2, Calendar, CheckSquare, MessageSquare, Users, RefreshCw } from 'lucide-react';

interface TestingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetData: () => void;
}

export const TestingGuideModal: React.FC<TestingGuideModalProps> = ({
  isOpen,
  onClose,
  onResetData,
}) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Prototype Testing Guide"
      description="Follow these step-by-step instructions to test all interactive features of County Campaign Manager."
      maxWidth="max-w-xl"
    >
      <div className="space-y-5 text-sm text-neutral-700">
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3.5 text-emerald-900 text-xs leading-relaxed">
          <strong>Testing Scope:</strong> This prototype simulates a Nairobi County gubernatorial campaign operations center across all 17 sub-counties. All voter numbers, rally plans, tasks, and community issues use fictional Nairobi administrative data.
        </div>

        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-md bg-neutral-900 text-white flex items-center justify-center shrink-0 text-xs font-bold">1</div>
            <div>
              <h4 className="font-semibold text-neutral-900 flex items-center gap-1.5">
                Dashboard Overview
              </h4>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Test the KPI cards (Voter target tracker, active volunteers, pending tasks, resolved issues). Click on any constituency row (e.g. Westlands, Kibra, Embakasi East) to see voter engagement and sub-county concerns. Use the Quick Action buttons to jump directly to forms.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-md bg-neutral-900 text-white flex items-center justify-center shrink-0 text-xs font-bold">2</div>
            <div>
              <h4 className="font-semibold text-neutral-900 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                Activities Page & Event Scheduling
              </h4>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Filter activities by Constituency (e.g., &quot;Embakasi East&quot;) or Event Type (e.g., &quot;Rally&quot; or &quot;Boda Boda Outreach&quot;). Click <strong>&quot;+ New Activity&quot;</strong> to open the functional modal, fill in details (e.g., a rally at Jacaranda or Kangemi), and submit. The new event immediately appears in the list and dashboard. Click any card to update its status to Completed.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-md bg-neutral-900 text-white flex items-center justify-center shrink-0 text-xs font-bold">3</div>
            <div>
              <h4 className="font-semibold text-neutral-900 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-700" />
                Tasks & Field Logistics
              </h4>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Filter tasks by status (Pending, In Progress, Completed) or Priority. Click the status button or checkbox directly on any task to mark it done. Click <strong>&quot;+ New Task&quot;</strong> to assign equipment, audio permits, or flyer runs to a team member.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-md bg-neutral-900 text-white flex items-center justify-center shrink-0 text-xs font-bold">4</div>
            <div>
              <h4 className="font-semibold text-neutral-900 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                Community Issues Tracker
              </h4>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Review logged citizen concerns (water rationing, feeder road drainage, market sanitation). Test the Urgency and Category filters. Click <strong>&quot;+ Log Community Issue&quot;</strong> to record citizen feedback from a ward, select its urgency level, and record the campaign&apos;s pledged solution.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-md bg-neutral-900 text-white flex items-center justify-center shrink-0 text-xs font-bold">5</div>
            <div>
              <h4 className="font-semibold text-neutral-900 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-700" />
                Team & User Management
              </h4>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Filter by Role (Campaign Manager, Sub-County Coordinator, Ward Mobilizer, Volunteer). Search team members by name or constituency. Click <strong>&quot;+ Add Team Member&quot;</strong> to onboard a new coordinator with phone and ward assignments. Toggle their Active/Standby status.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-md bg-neutral-900 text-white flex items-center justify-center shrink-0 text-xs font-bold">6</div>
            <div>
              <h4 className="font-semibold text-neutral-900 flex items-center gap-1.5">
                Mobile & Desktop Responsiveness
              </h4>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Resize your browser window or switch to mobile viewport emulator. On mobile, note the ergonomic fixed bottom navigation bar, touch-friendly form dialogs, and readable compact cards.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              if (window.confirm('Reset all demo data back to initial sample state?')) {
                onResetData();
                onClose();
              }
            }}
            className="w-full sm:w-auto text-neutral-600 hover:text-neutral-900 text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset to Sample Data
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            <CheckCircle2 className="w-4 h-4" />
            Got it, Start Testing
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
