import React from 'react';
import { LayoutDashboard, Calendar, CheckSquare, MessageSquare, Users } from 'lucide-react';
import { PageId } from './Navbar';

interface MobileNavProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentPage, onNavigate }) => {
  const items: { id: PageId; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'activities', label: 'Activities', icon: <Calendar className="w-5 h-5" /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="w-5 h-5" /> },
    { id: 'issues', label: 'Issues', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'team', label: 'Team', icon: <Users className="w-5 h-5" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200 px-2 py-1 shadow-lg">
      <div className="grid grid-cols-5 items-center">
        {items.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'text-emerald-700 font-semibold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <div className={isActive ? 'text-emerald-700' : 'text-neutral-400'}>
                {item.icon}
              </div>
              <span className="text-[10px] mt-1 whitespace-nowrap truncate max-w-full">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
