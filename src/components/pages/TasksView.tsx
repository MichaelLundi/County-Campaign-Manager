import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select } from '../ui/select';
import { Input } from '../ui/input';
import { CampaignTask, TaskPriority, TaskStatus, TaskCategory } from '../../types/campaign';
import {
  CheckSquare,
  CheckCircle2,
  Circle,
  Plus,
  Search,
  Calendar,
  User,
  MapPin,
  Trash2,
  Clock,
} from 'lucide-react';

interface TasksViewProps {
  tasks: CampaignTask[];
  onOpenAddModal: () => void;
  onToggleStatus: (taskId: string) => void;
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onOpenAddModal,
  onToggleStatus,
  onUpdateStatus,
  onDeleteTask,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filtered = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.assigneeName.toLowerCase().includes(search.toLowerCase()) ||
      t.constituency.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const pendingCount = tasks.filter((t) => t.status === 'Pending').length;
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const highPriorityCount = tasks.filter((t) => t.priority === 'High' && t.status !== 'Completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Campaign Logistics & Field Tasks
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Coordinate stage sound rigs, printed manifestos, police notifications, and polling agent captain rosters.
          </p>
        </div>
        <Button onClick={onOpenAddModal} variant="default" size="sm" className="text-xs">
          <Plus className="w-3.5 h-3.5" />
          Create Task
        </Button>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setStatusFilter(statusFilter === 'Pending' ? 'all' : 'Pending')}
          className={`p-3.5 rounded-lg border text-left transition-colors cursor-pointer ${
            statusFilter === 'Pending' ? 'bg-neutral-100 border-neutral-900' : 'bg-white border-neutral-200'
          }`}
        >
          <span className="text-[11px] font-medium text-neutral-500">Pending</span>
          <p className="text-xl font-bold text-neutral-900 font-mono tabular-nums mt-0.5">
            {pendingCount}
          </p>
        </button>

        <button
          onClick={() => setStatusFilter(statusFilter === 'In Progress' ? 'all' : 'In Progress')}
          className={`p-3.5 rounded-lg border text-left transition-colors cursor-pointer ${
            statusFilter === 'In Progress' ? 'bg-neutral-100 border-neutral-900' : 'bg-white border-neutral-200'
          }`}
        >
          <span className="text-[11px] font-medium text-neutral-500">In Progress</span>
          <p className="text-xl font-bold text-emerald-700 font-mono tabular-nums mt-0.5">
            {inProgressCount}
          </p>
        </button>

        <button
          onClick={() => setStatusFilter(statusFilter === 'Completed' ? 'all' : 'Completed')}
          className={`p-3.5 rounded-lg border text-left transition-colors cursor-pointer ${
            statusFilter === 'Completed' ? 'bg-neutral-100 border-neutral-900' : 'bg-white border-neutral-200'
          }`}
        >
          <span className="text-[11px] font-medium text-neutral-500">Completed</span>
          <p className="text-xl font-bold text-neutral-800 font-mono tabular-nums mt-0.5">
            {completedCount}
          </p>
        </button>

        <button
          onClick={() => setPriorityFilter(priorityFilter === 'High' ? 'all' : 'High')}
          className={`p-3.5 rounded-lg border text-left transition-colors cursor-pointer ${
            priorityFilter === 'High' ? 'bg-rose-50 border-rose-400' : 'bg-white border-neutral-200'
          }`}
        >
          <span className="text-[11px] font-medium text-rose-700 font-semibold">High Priority</span>
          <p className="text-xl font-bold text-rose-800 font-mono tabular-nums mt-0.5">
            {highPriorityCount}
          </p>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
            <Input
              placeholder="Search tasks, assignees, sub-county..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 text-xs"
            />
          </div>

          <div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 text-xs"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </Select>
          </div>

          <div>
            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="h-10 text-xs"
            >
              <option value="all">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </Select>
          </div>

          <div>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-10 text-xs"
            >
              <option value="all">All Task Categories</option>
              <option value="Logistics & Audio">Logistics & Audio</option>
              <option value="Canvassing & Field">Canvassing & Field</option>
              <option value="Media & Comms">Media & Comms</option>
              <option value="Permits & Protocol">Permits & Protocol</option>
              <option value="Youth & Women Mobilization">Youth & Women Mobilization</option>
            </Select>
          </div>
        </div>

        {(search || statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all') && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100 text-xs text-neutral-600">
            <span>
              Showing {filtered.length} of {tasks.length} tasks
            </span>
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('all');
                setPriorityFilter('all');
                setCategoryFilter('all');
              }}
              className="text-emerald-700 hover:text-emerald-800 font-medium cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        )}
      </Card>

      {/* Task List */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-neutral-200">
            <CheckSquare className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-neutral-900">No tasks found</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              Everything in this view is cleared or filtered out. Create a new campaign operational task.
            </p>
            <div className="mt-4">
              <Button size="sm" onClick={onOpenAddModal}>
                <Plus className="w-3.5 h-3.5" />
                Create Task
              </Button>
            </div>
          </div>
        ) : (
          filtered.map((task) => {
            const isCompleted = task.status === 'Completed';
            return (
              <Card
                key={task.id}
                className={`transition-colors ${
                  isCompleted ? 'bg-neutral-50/60 border-neutral-200' : 'bg-white hover:border-neutral-300'
                }`}
              >
                <CardContent className="p-4 sm:p-4.5">
                  <div className="flex items-start gap-3.5">
                    {/* Checkbox */}
                    <button
                      onClick={() => onToggleStatus(task.id)}
                      className="mt-0.5 text-neutral-400 hover:text-emerald-700 transition-colors shrink-0 cursor-pointer"
                      title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-700 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5 text-neutral-400 hover:text-emerald-700" />
                      )}
                    </button>

                    {/* Content */}
                    <div className="flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4
                          className={`text-sm font-bold leading-snug ${
                            isCompleted ? 'line-through text-neutral-400' : 'text-neutral-900'
                          }`}
                        >
                          {task.title}
                        </h4>
                        <Badge
                          variant={
                            task.priority === 'High' ? 'urgent' : task.priority === 'Medium' ? 'warning' : 'outline'
                          }
                        >
                          {task.priority} Priority
                        </Badge>
                        <span className="text-[11px] text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded font-medium">
                          {task.category}
                        </span>
                      </div>

                      {task.notes && (
                        <p className="text-xs text-neutral-600 bg-neutral-50/80 p-2 rounded border border-neutral-100">
                          {task.notes}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 pt-1">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-neutral-400" />
                          <span className="font-semibold text-neutral-800">{task.assigneeName}</span>
                          <span className="text-neutral-400">({task.assigneeRole})</span>
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                          {task.constituency}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 font-mono tabular-nums">
                          <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                          Due: {task.dueDate}
                        </span>
                      </div>
                    </div>

                    {/* Status & Delete */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Select
                        value={task.status}
                        onChange={(e) => onUpdateStatus(task.id, e.target.value as TaskStatus)}
                        className="h-8 text-xs w-28 hidden sm:block"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </Select>

                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1.5 text-neutral-400 hover:text-rose-700 transition-colors cursor-pointer"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
