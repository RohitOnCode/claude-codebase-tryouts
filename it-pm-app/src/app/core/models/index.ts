export type ProjectStatus = 'active' | 'on-hold' | 'completed' | 'planning';
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type BugSeverity = 'blocker' | 'major' | 'minor' | 'trivial';
export type BugStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
export type MemberRole =
  | 'Tech Lead'
  | 'Backend Engineer'
  | 'Frontend Engineer'
  | 'QA Engineer'
  | 'DevOps Engineer'
  | 'Product Manager'
  | 'UX Designer';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  avatarUrl: string;
  skills: string[];
  projectIds: string[];
  joinedDate: string;
}

export interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  goal: string;
  isActive: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  progress: number;
  startDate: string;
  endDate: string;
  teamMemberIds: string[];
  techStack: string[];
  sprints: Sprint[];
  repository: string;
}

export interface Task {
  id: string;
  projectId: string;
  sprintId: string | null;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string | null;
  labels: string[];
  storyPoints: number;
  createdAt: string;
  updatedAt: string;
  dueDate: string | null;
}

export interface Bug {
  id: string;
  projectId: string;
  title: string;
  description: string;
  severity: BugSeverity;
  status: BugStatus;
  priority: Priority;
  reportedById: string;
  assigneeId: string | null;
  stepsToReproduce: string[];
  environment: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

export interface KpiSummary {
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  completedTasks: number;
  openBugs: number;
  criticalBugs: number;
  teamSize: number;
  sprintVelocity: number;
}
