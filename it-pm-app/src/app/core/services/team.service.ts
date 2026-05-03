import { Injectable, signal } from '@angular/core';
import { TeamMember } from '../models';

const MOCK_MEMBERS: TeamMember[] = [
  {
    id: 'tm1', name: 'Alex Johnson', email: 'alex.j@itpm.dev', role: 'Tech Lead',
    avatarUrl: 'https://i.pravatar.cc/150?u=tm1',
    skills: ['TypeScript', 'Angular', 'System Design', 'Node.js'],
    projectIds: ['p1', 'p2', 'p3'], joinedDate: '2021-03-15'
  },
  {
    id: 'tm2', name: 'Sara Kim', email: 'sara.k@itpm.dev', role: 'Backend Engineer',
    avatarUrl: 'https://i.pravatar.cc/150?u=tm2',
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Redis'],
    projectIds: ['p1', 'p4'], joinedDate: '2022-01-10'
  },
  {
    id: 'tm3', name: 'Marcus Lee', email: 'marcus.l@itpm.dev', role: 'Frontend Engineer',
    avatarUrl: 'https://i.pravatar.cc/150?u=tm3',
    skills: ['React', 'TypeScript', 'CSS', 'GraphQL'],
    projectIds: ['p2', 'p3'], joinedDate: '2021-07-20'
  },
  {
    id: 'tm4', name: 'Priya Patel', email: 'priya.p@itpm.dev', role: 'QA Engineer',
    avatarUrl: 'https://i.pravatar.cc/150?u=tm4',
    skills: ['Selenium', 'Cypress', 'Postman', 'JIRA'],
    projectIds: ['p1', 'p2', 'p5'], joinedDate: '2022-06-01'
  },
  {
    id: 'tm5', name: 'David Chen', email: 'david.c@itpm.dev', role: 'DevOps Engineer',
    avatarUrl: 'https://i.pravatar.cc/150?u=tm5',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
    projectIds: ['p1', 'p3', 'p4', 'p5'], joinedDate: '2020-11-05'
  },
  {
    id: 'tm6', name: 'Natasha Brown', email: 'natasha.b@itpm.dev', role: 'Product Manager',
    avatarUrl: 'https://i.pravatar.cc/150?u=tm6',
    skills: ['Roadmapping', 'Agile', 'Stakeholder Mgmt', 'Data Analysis'],
    projectIds: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'], joinedDate: '2020-05-12'
  },
  {
    id: 'tm7', name: 'Ryan Torres', email: 'ryan.t@itpm.dev', role: 'Backend Engineer',
    avatarUrl: 'https://i.pravatar.cc/150?u=tm7',
    skills: ['Python', 'FastAPI', 'MongoDB', 'RabbitMQ'],
    projectIds: ['p3', 'p5'], joinedDate: '2023-02-14'
  },
  {
    id: 'tm8', name: 'Elena Russo', email: 'elena.r@itpm.dev', role: 'UX Designer',
    avatarUrl: 'https://i.pravatar.cc/150?u=tm8',
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    projectIds: ['p2', 'p6'], joinedDate: '2022-09-30'
  },
  {
    id: 'tm9', name: 'James Wilson', email: 'james.w@itpm.dev', role: 'Frontend Engineer',
    avatarUrl: 'https://i.pravatar.cc/150?u=tm9',
    skills: ['Angular', 'Vue.js', 'Tailwind CSS', 'Testing'],
    projectIds: ['p1', 'p6'], joinedDate: '2023-04-18'
  },
  {
    id: 'tm10', name: 'Aisha Okonkwo', email: 'aisha.o@itpm.dev', role: 'QA Engineer',
    avatarUrl: 'https://i.pravatar.cc/150?u=tm10',
    skills: ['Manual Testing', 'Test Automation', 'Performance Testing'],
    projectIds: ['p4', 'p5', 'p6'], joinedDate: '2023-07-22'
  },
];

@Injectable({ providedIn: 'root' })
export class TeamService {
  private readonly _members = signal<TeamMember[]>(MOCK_MEMBERS);
  readonly members = this._members.asReadonly();

  getById(id: string): TeamMember | undefined {
    return this._members().find(m => m.id === id);
  }

  getByProject(projectId: string): TeamMember[] {
    return this._members().filter(m => m.projectIds.includes(projectId));
  }
}
