export type ActivityType =
  | 'Rally'
  | 'Town Hall'
  | 'Door-to-Door Canvassing'
  | 'Market Walk'
  | 'Youth Forum'
  | 'Media & Press Briefing'
  | 'Boda Boda Outreach';

export type ActivityStatus = 'Upcoming' | 'In Progress' | 'Completed' | 'Postponed';

export interface Activity {
  id: string;
  title: string;
  type: ActivityType;
  constituency: string;
  ward: string;
  venue: string;
  dateTime: string; // ISO or human readable formatted
  expectedAttendance: number;
  leadCoordinator: string;
  status: ActivityStatus;
  permitsCleared: boolean;
  budgetKSh?: number;
  notes?: string;
}

export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type TaskCategory =
  | 'Logistics & Audio'
  | 'Canvassing & Field'
  | 'Media & Comms'
  | 'Permits & Protocol'
  | 'Youth & Women Mobilization';

export interface CampaignTask {
  id: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  assigneeName: string;
  assigneeRole: string;
  dueDate: string;
  constituency: string;
  notes?: string;
}

export type IssueUrgency = 'Critical' | 'High' | 'Medium';
export type IssueStatus = 'Under Review' | 'Action Plan Ready' | 'Addressed / Pledged';
export type IssueCategory =
  | 'Water & Sanitation'
  | 'Youth & Enterprise'
  | 'Feeder Roads & Drainage'
  | 'Healthcare & Dispensaries'
  | 'Street Lighting & Safety'
  | 'Market Stalls & Trading';

export interface CommunityIssue {
  id: string;
  title: string;
  constituency: string;
  ward: string;
  category: IssueCategory;
  urgency: IssueUrgency;
  status: IssueStatus;
  reportedDate: string;
  summary: string;
  pledgedAction: string;
  reportedBy: string;
  votesImpactedApprox?: number;
}

export type TeamRole =
  | 'Campaign Manager'
  | 'Field Director'
  | 'Communications & Media Lead'
  | 'Sub-County Coordinator'
  | 'Ward Mobilizer'
  | 'Youth Wing Lead'
  | 'Field Volunteer';

export interface TeamMember {
  id: string;
  name: string;
  role: TeamRole;
  constituency: string;
  ward: string;
  phone: string;
  email: string;
  status: 'Active' | 'On Leave' | 'Standby';
  volunteersLed: number;
  joinedDate: string;
}

export interface ConstituencyMetric {
  name: string;
  targetVoters: number;
  contactedVoters: number;
  activeVolunteers: number;
  activitiesCount: number;
  topConcern: string;
}
