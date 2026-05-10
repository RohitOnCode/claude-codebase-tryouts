export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  skills: string[];
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'critical' | 'high' | 'medium' | 'low';
  assignee_id: string | null;
  story_points: number;
  due_date: string | null;
}

export const MEMBERS: Member[] = [
  { id: 'tm1', name: 'Alex Johnson',   email: 'alex.j@itpm.dev',    role: 'Tech Lead',           skills: ['TypeScript','Angular','System Design','Node.js'] },
  { id: 'tm2', name: 'Sara Kim',       email: 'sara.k@itpm.dev',    role: 'Backend Engineer',    skills: ['Java','Spring Boot','PostgreSQL','Redis'] },
  { id: 'tm3', name: 'Marcus Lee',     email: 'marcus.l@itpm.dev',  role: 'Frontend Engineer',   skills: ['React','TypeScript','CSS','GraphQL'] },
  { id: 'tm4', name: 'Priya Patel',    email: 'priya.p@itpm.dev',   role: 'QA Engineer',         skills: ['Selenium','Cypress','Postman','JIRA'] },
  { id: 'tm5', name: 'David Chen',     email: 'david.c@itpm.dev',   role: 'DevOps Engineer',     skills: ['AWS','Docker','Kubernetes','Terraform','CI/CD'] },
  { id: 'tm6', name: 'Natasha Brown',  email: 'natasha.b@itpm.dev', role: 'Product Manager',     skills: ['Roadmapping','Agile','Stakeholder Mgmt'] },
  { id: 'tm7', name: 'Ryan Torres',    email: 'ryan.t@itpm.dev',    role: 'Backend Engineer',    skills: ['Python','FastAPI','MongoDB','RabbitMQ'] },
  { id: 'tm8', name: 'Elena Russo',    email: 'elena.r@itpm.dev',   role: 'UX Designer',         skills: ['Figma','User Research','Prototyping'] },
  { id: 'tm9', name: 'James Wilson',   email: 'james.w@itpm.dev',   role: 'Frontend Engineer',   skills: ['Angular','Vue.js','Tailwind CSS','Testing'] },
  { id: 'tm10', name: 'Aisha Okonkwo', email: 'aisha.o@itpm.dev',   role: 'QA Engineer',         skills: ['Manual Testing','Test Automation','Performance Testing'] },
];

// Only active (non-done) tasks with an assignee
export const TASKS: Task[] = [
  { id: 't1',  project_id: 'p1', title: 'Implement support ticket list view',        status: 'in-progress', priority: 'high',     assignee_id: 'tm9', story_points: 5,  due_date: '2026-04-28' },
  { id: 't2',  project_id: 'p1', title: 'Connect ticket API endpoints',              status: 'todo',        priority: 'high',     assignee_id: 'tm2', story_points: 3,  due_date: '2026-04-25' },
  { id: 't3',  project_id: 'p1', title: 'Ticket detail modal with attachments',      status: 'todo',        priority: 'medium',   assignee_id: 'tm9', story_points: 8,  due_date: '2026-04-30' },
  { id: 't4',  project_id: 'p1', title: 'Write e2e tests for ticket flows',          status: 'todo',        priority: 'medium',   assignee_id: 'tm4', story_points: 5,  due_date: '2026-04-30' },
  { id: 't7',  project_id: 'p1', title: 'Accessibility audit & fixes (WCAG 2.1)',    status: 'review',      priority: 'critical', assignee_id: 'tm1', story_points: 13, due_date: '2026-04-29' },
  { id: 't8',  project_id: 'p2', title: 'Bar & line chart components',               status: 'in-progress', priority: 'high',     assignee_id: 'tm3', story_points: 8,  due_date: '2026-04-14' },
  { id: 't9',  project_id: 'p2', title: 'Dashboard layout grid system',              status: 'todo',        priority: 'high',     assignee_id: 'tm3', story_points: 13, due_date: '2026-04-15' },
  { id: 't10', project_id: 'p2', title: 'ClickHouse query builder service',          status: 'review',      priority: 'critical', assignee_id: 'tm2', story_points: 8,  due_date: '2026-04-15' },
  { id: 't11', project_id: 'p2', title: 'Real-time data refresh via WebSocket',      status: 'todo',        priority: 'medium',   assignee_id: 'tm7', story_points: 5,  due_date: '2026-04-15' },
  { id: 't13', project_id: 'p3', title: 'Extract order domain entities',             status: 'in-progress', priority: 'critical', assignee_id: 'tm1', story_points: 8,  due_date: '2026-04-28' },
  { id: 't14', project_id: 'p3', title: 'Order service gRPC contracts',              status: 'todo',        priority: 'high',     assignee_id: 'tm7', story_points: 5,  due_date: '2026-04-29' },
  { id: 't15', project_id: 'p3', title: 'Service mesh mTLS config',                  status: 'todo',        priority: 'high',     assignee_id: 'tm5', story_points: 5,  due_date: '2026-04-30' },
  { id: 't17', project_id: 'p3', title: 'Deploy order service to staging',           status: 'review',      priority: 'high',     assignee_id: 'tm5', story_points: 3,  due_date: '2026-04-28' },
  { id: 't20', project_id: 'p6', title: 'React Native tech spike',                   status: 'in-progress', priority: 'high',     assignee_id: 'tm9', story_points: 3,  due_date: '2026-05-10' },
  { id: 't21', project_id: 'p6', title: 'UX wireframes — work order flow',           status: 'in-progress', priority: 'high',     assignee_id: 'tm8', story_points: 5,  due_date: '2026-05-12' },
  { id: 't22', project_id: 'p6', title: 'Architecture decision records',             status: 'todo',        priority: 'medium',   assignee_id: 'tm1', story_points: 2,  due_date: '2026-05-15' },
];

export const OVERLOADED_THRESHOLD_SP = 15;
export const UNDERLOADED_THRESHOLD_SP = 5;

export function getActiveTasks(): Task[] {
  return TASKS.filter(t => t.status !== 'done');
}

export function getMemberById(id: string): Member | undefined {
  return MEMBERS.find(m => m.id === id);
}

export function findMember(identifier: string): Member | undefined {
  const lower = identifier.toLowerCase();
  return MEMBERS.find(
    m => m.id.toLowerCase() === lower || m.name.toLowerCase().includes(lower)
  );
}
