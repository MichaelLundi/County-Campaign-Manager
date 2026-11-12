import React from 'react';
import { HelpCircle, Plus, Database } from 'lucide-react';
import { Button } from '../ui/button';

export type PageId = 'dashboard' | 'activities' | 'tasks' | 'issues' | 'team';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenTestingGuide: () => void;
  onOpenQuickAction: () => void;
  onOpenSupabaseStatus: () => void;
  currentUser?: { email: string; displayName?: string } | null;
  onSignIn?: () => void;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenTestingGuide,
  onOpenQuickAction,
  onOpenSupabaseStatus,
  currentUser,
  onSignIn,
  onSignOut,
}) => {
  const navItems: { id: PageId; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'activities', label: 'Activities' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'issues', label: 'Community Issues' },
    { id: 'team', label: 'Team & Users' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/95 backdrop-blur-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-lg shrink-0 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              CC
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-neutral-900 whitespace-nowrap">
                County Campaign Manager
              </span>
              <span className="text-[10px] text-neutral-500 font-medium tracking-wide">
                Nairobi Gubernatorial Campaign 2027
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`relative py-1 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-emerald-800 font-semibold after:absolute after:bottom-[-20px] after:left-0 after:right-0 after:h-0.5 after:bg-emerald-700'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenSupabaseStatus}
              className="text-xs text-neutral-800 border-neutral-300"
              title="Check Supabase connection status"
            >
              <Database className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">Supabase</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onOpenTestingGuide}
              className="text-xs text-neutral-700 border-neutral-300"
              title="How to test this prototype"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">How to Test</span>
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={onOpenQuickAction}
              className="text-xs"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Quick Action</span>
              <span className="sm:hidden">Action</span>
            </Button>

            {currentUser ? (
              <div className="flex items-center gap-2 pl-1 border-l border-neutral-200">
                <div
                  className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold"
                  title={currentUser.email}
                >
                  {(currentUser.displayName || currentUser.email)[0].toUpperCase()}
                </div>
                <button
                  onClick={onSignOut}
                  className="hidden lg:inline text-xs text-neutral-500 hover:text-neutral-900 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : onSignIn ? (
              <Button
                variant="outline"
                size="sm"
                onClick={onSignIn}
                className="text-xs text-neutral-800 border-neutral-300"
              >
                Sign In
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};
