-- ============================================
-- IT Project Management App — Supabase Schema
-- ============================================

-- Team Members
CREATE TABLE team_members (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  role        TEXT NOT NULL,
  avatar_url  TEXT,
  skills      TEXT[]  DEFAULT '{}',
  joined_date DATE
);

-- Projects
CREATE TABLE projects (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  status      TEXT NOT NULL CHECK (status IN ('active','on-hold','completed','planning')),
  priority    TEXT NOT NULL CHECK (priority IN ('critical','high','medium','low')),
  progress    INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  start_date  DATE,
  end_date    DATE,
  tech_stack  TEXT[] DEFAULT '{}',
  repository  TEXT
);

-- Project <> Team Member (many-to-many)
CREATE TABLE project_members (
  project_id    TEXT REFERENCES projects(id) ON DELETE CASCADE,
  member_id     TEXT REFERENCES team_members(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, member_id)
);

-- Sprints
CREATE TABLE sprints (
  id         TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  start_date DATE,
  end_date   DATE,
  goal       TEXT,
  is_active  BOOLEAN DEFAULT FALSE
);

-- Tasks
CREATE TABLE tasks (
  id           TEXT PRIMARY KEY,
  project_id   TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  sprint_id    TEXT REFERENCES sprints(id) ON DELETE SET NULL,
  title        TEXT NOT NULL,
  description  TEXT,
  status       TEXT NOT NULL CHECK (status IN ('todo','in-progress','review','done')),
  priority     TEXT NOT NULL CHECK (priority IN ('critical','high','medium','low')),
  assignee_id  TEXT REFERENCES team_members(id) ON DELETE SET NULL,
  labels       TEXT[] DEFAULT '{}',
  story_points INTEGER DEFAULT 0,
  due_date     DATE,
  created_at   DATE,
  updated_at   DATE
);

-- Bugs
CREATE TABLE bugs (
  id                  TEXT PRIMARY KEY,
  project_id          TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title               TEXT NOT NULL,
  description         TEXT,
  severity            TEXT NOT NULL CHECK (severity IN ('blocker','major','minor','trivial')),
  status              TEXT NOT NULL CHECK (status IN ('open','in-progress','resolved','closed')),
  priority            TEXT NOT NULL CHECK (priority IN ('critical','high','medium','low')),
  reported_by_id      TEXT REFERENCES team_members(id) ON DELETE SET NULL,
  assignee_id         TEXT REFERENCES team_members(id) ON DELETE SET NULL,
  steps_to_reproduce  TEXT[] DEFAULT '{}',
  environment         TEXT,
  created_at          DATE,
  updated_at          DATE,
  resolved_at         DATE
);

-- ============================================
-- SEED DATA
-- ============================================

-- Team Members
INSERT INTO team_members VALUES
('tm1','Alex Johnson','alex.j@itpm.dev','Tech Lead','https://i.pravatar.cc/150?u=tm1',ARRAY['TypeScript','Angular','System Design','Node.js'],'2021-03-15'),
('tm2','Sara Kim','sara.k@itpm.dev','Backend Engineer','https://i.pravatar.cc/150?u=tm2',ARRAY['Java','Spring Boot','PostgreSQL','Redis'],'2022-01-10'),
('tm3','Marcus Lee','marcus.l@itpm.dev','Frontend Engineer','https://i.pravatar.cc/150?u=tm3',ARRAY['React','TypeScript','CSS','GraphQL'],'2021-07-20'),
('tm4','Priya Patel','priya.p@itpm.dev','QA Engineer','https://i.pravatar.cc/150?u=tm4',ARRAY['Selenium','Cypress','Postman','JIRA'],'2022-06-01'),
('tm5','David Chen','david.c@itpm.dev','DevOps Engineer','https://i.pravatar.cc/150?u=tm5',ARRAY['AWS','Docker','Kubernetes','Terraform','CI/CD'],'2020-11-05'),
('tm6','Natasha Brown','natasha.b@itpm.dev','Product Manager','https://i.pravatar.cc/150?u=tm6',ARRAY['Roadmapping','Agile','Stakeholder Mgmt','Data Analysis'],'2020-05-12'),
('tm7','Ryan Torres','ryan.t@itpm.dev','Backend Engineer','https://i.pravatar.cc/150?u=tm7',ARRAY['Python','FastAPI','MongoDB','RabbitMQ'],'2023-02-14'),
('tm8','Elena Russo','elena.r@itpm.dev','UX Designer','https://i.pravatar.cc/150?u=tm8',ARRAY['Figma','User Research','Prototyping','Design Systems'],'2022-09-30'),
('tm9','James Wilson','james.w@itpm.dev','Frontend Engineer','https://i.pravatar.cc/150?u=tm9',ARRAY['Angular','Vue.js','Tailwind CSS','Testing'],'2023-04-18'),
('tm10','Aisha Okonkwo','aisha.o@itpm.dev','QA Engineer','https://i.pravatar.cc/150?u=tm10',ARRAY['Manual Testing','Test Automation','Performance Testing'],'2023-07-22');

-- Projects
INSERT INTO projects VALUES
('p1','Customer Portal Redesign','Full redesign of the customer-facing portal with improved UX, accessibility compliance, and mobile-first approach.','active','high',62,'2026-01-15','2026-06-30',ARRAY['Angular','Node.js','PostgreSQL','AWS'],'https://github.com/itpm/customer-portal'),
('p2','Internal Analytics Platform','Build an internal BI platform to replace third-party tools and provide real-time operational metrics.','active','high',38,'2026-02-01','2026-09-30',ARRAY['React','Python','ClickHouse','Kafka'],'https://github.com/itpm/analytics-platform'),
('p3','Microservices Migration','Decompose the monolithic backend into domain-driven microservices with independent deployment pipelines.','active','critical',25,'2026-03-01','2026-12-31',ARRAY['Go','Docker','Kubernetes','gRPC','AWS EKS'],'https://github.com/itpm/microservices-migration'),
('p4','CI/CD Pipeline Overhaul','Modernize build, test, and deployment pipelines to achieve sub-5-minute deploy cycles across all environments.','completed','medium',100,'2025-10-01','2026-02-28',ARRAY['GitHub Actions','ArgoCD','Terraform','AWS'],'https://github.com/itpm/cicd-overhaul'),
('p5','Security Hardening Initiative','Address penetration test findings, implement zero-trust networking, and achieve SOC 2 Type II compliance.','on-hold','critical',45,'2026-01-01','2026-07-31',ARRAY['Vault','AWS IAM','Snyk','Falco'],'https://github.com/itpm/security-hardening'),
('p6','Mobile App MVP','Cross-platform mobile app for field technicians — offline-capable work orders, asset scanning, and reporting.','planning','medium',8,'2026-05-01','2026-11-30',ARRAY['React Native','Expo','Node.js','SQLite'],'https://github.com/itpm/mobile-app');

-- Project Members
INSERT INTO project_members VALUES
('p1','tm1'),('p1','tm2'),('p1','tm4'),('p1','tm5'),('p1','tm6'),('p1','tm9'),
('p2','tm1'),('p2','tm3'),('p2','tm4'),('p2','tm6'),('p2','tm8'),
('p3','tm1'),('p3','tm3'),('p3','tm5'),('p3','tm6'),('p3','tm7'),
('p4','tm2'),('p4','tm5'),('p4','tm6'),('p4','tm10'),
('p5','tm4'),('p5','tm5'),('p5','tm6'),('p5','tm7'),('p5','tm10'),
('p6','tm6'),('p6','tm8'),('p6','tm9'),('p6','tm10');

-- Sprints
INSERT INTO sprints VALUES
('s1-1','p1','Sprint 1','2026-01-15','2026-01-29','Auth & user profile flows',false),
('s1-2','p1','Sprint 2','2026-01-29','2026-02-12','Dashboard & notifications',false),
('s1-3','p1','Sprint 3','2026-02-12','2026-02-26','Billing module',false),
('s1-4','p1','Sprint 4','2026-04-16','2026-04-30','Support ticket integration',true),
('s2-1','p2','Sprint 1','2026-02-01','2026-02-15','Data pipeline foundation',false),
('s2-2','p2','Sprint 2','2026-04-01','2026-04-15','Chart components & drill-down',true),
('s3-1','p3','Sprint 1','2026-03-01','2026-03-15','Service mesh & auth service',false),
('s3-2','p3','Sprint 2','2026-04-15','2026-04-30','Order service extraction',true),
('s4-1','p4','Sprint 1','2025-10-01','2025-10-15','Pipeline audit & design',false),
('s4-2','p4','Sprint 2','2025-10-15','2025-10-29','GitHub Actions migration',false),
('s4-3','p4','Sprint 3','2025-11-01','2026-02-28','ArgoCD & rollout strategy',false),
('s5-1','p5','Sprint 1','2026-01-01','2026-01-15','Pentest finding triage',false),
('s5-2','p5','Sprint 2','2026-01-15','2026-01-29','Secrets manager rollout',false),
('s6-1','p6','Sprint 1','2026-05-01','2026-05-15','Tech spike & architecture',true);

-- Tasks
INSERT INTO tasks VALUES
('t1','p1','s1-4','Implement support ticket list view','Build paginated list with filtering by status and priority.','in-progress','high','tm9',ARRAY['feature','ui'],5,'2026-04-28','2026-04-16','2026-04-20'),
('t2','p1','s1-4','Connect ticket API endpoints','Wire up REST endpoints for ticket CRUD operations.','todo','high','tm2',ARRAY['api','backend'],3,'2026-04-25','2026-04-16','2026-04-16'),
('t3','p1','s1-4','Ticket detail modal with attachments','Full-screen modal with file attachment support (max 10MB).','todo','medium','tm9',ARRAY['ui','feature'],8,'2026-04-30','2026-04-16','2026-04-16'),
('t4','p1','s1-4','Write e2e tests for ticket flows','Cypress tests covering create, update, and close ticket journeys.','todo','medium','tm4',ARRAY['testing','qa'],5,'2026-04-30','2026-04-17','2026-04-17'),
('t5','p1','s1-3','Invoice PDF generation','Generate downloadable PDF invoices from billing records.','done','high','tm2',ARRAY['feature','billing'],5,'2026-02-26','2026-02-12','2026-02-24'),
('t6','p1','s1-3','Payment method management UI','Add/remove credit cards and bank accounts.','done','high','tm9',ARRAY['ui','billing'],8,'2026-02-26','2026-02-12','2026-02-25'),
('t7','p1','s1-4','Accessibility audit & fixes (WCAG 2.1)','Fix all AA-level violations found in audit.','review','critical','tm1',ARRAY['a11y','compliance'],13,'2026-04-29','2026-04-18','2026-04-22'),
('t8','p2','s2-2','Bar & line chart components','Reusable Chart.js wrapper components with theme support.','in-progress','high','tm3',ARRAY['ui','charts'],8,'2026-04-14','2026-04-01','2026-04-10'),
('t9','p2','s2-2','Dashboard layout grid system','Drag-and-drop widget grid for custom dashboard layouts.','todo','high','tm3',ARRAY['ui','feature'],13,'2026-04-15','2026-04-01','2026-04-01'),
('t10','p2','s2-2','ClickHouse query builder service','Backend service to translate UI filters into ClickHouse SQL.','review','critical','tm2',ARRAY['backend','data'],8,'2026-04-15','2026-04-01','2026-04-11'),
('t11','p2','s2-2','Real-time data refresh via WebSocket','Push updates to live dashboards without polling.','todo','medium','tm7',ARRAY['backend','realtime'],5,'2026-04-15','2026-04-05','2026-04-05'),
('t12','p2','s2-1','Kafka consumer for event ingestion','Ingest product events from Kafka into ClickHouse.','done','high','tm7',ARRAY['backend','data'],8,'2026-02-15','2026-02-01','2026-02-14'),
('t13','p3','s3-2','Extract order domain entities','Identify bounded context and define order aggregate root.','in-progress','critical','tm1',ARRAY['architecture','backend'],8,'2026-04-28','2026-04-15','2026-04-18'),
('t14','p3','s3-2','Order service gRPC contracts','Define .proto files for order service APIs.','todo','high','tm7',ARRAY['backend','grpc'],5,'2026-04-29','2026-04-15','2026-04-15'),
('t15','p3','s3-2','Service mesh mTLS config','Configure Istio mTLS between services in staging.','todo','high','tm5',ARRAY['infra','security'],5,'2026-04-30','2026-04-15','2026-04-15'),
('t16','p3','s3-1','Auth service implementation','JWT-based auth service with OAuth2 social login.','done','critical','tm1',ARRAY['backend','security'],13,'2026-03-15','2026-03-01','2026-03-14'),
('t17','p3','s3-2','Deploy order service to staging','Helm chart and ArgoCD app for order service.','review','high','tm5',ARRAY['devops','k8s'],3,'2026-04-28','2026-04-20','2026-04-22'),
('t18','p5','s5-2','Rotate all database credentials','Migrate hardcoded DB credentials to Vault dynamic secrets.','done','critical','tm5',ARRAY['security','infra'],8,'2026-01-29','2026-01-15','2026-01-28'),
('t19','p5','s5-1','Pentest findings classification','Classify and prioritize 47 pentest findings into CVSS severity.','done','critical','tm4',ARRAY['security','qa'],5,'2026-01-15','2026-01-01','2026-01-14'),
('t20','p6','s6-1','React Native tech spike','Evaluate Expo vs bare RN workflow for offline support.','in-progress','high','tm9',ARRAY['spike','mobile'],3,'2026-05-10','2026-05-01','2026-05-02'),
('t21','p6','s6-1','UX wireframes — work order flow','Figma wireframes for the core work order creation and scanning flow.','in-progress','high','tm8',ARRAY['design','ux'],5,'2026-05-12','2026-05-01','2026-05-02'),
('t22','p6','s6-1','Architecture decision records','Document ADRs for offline sync, auth, and state management.','todo','medium','tm1',ARRAY['architecture','docs'],2,'2026-05-15','2026-05-01','2026-05-01');

-- Bugs
INSERT INTO bugs VALUES
('b1','p1','Payment form submits twice on slow network','Double-click or slow response causes duplicate payment intent creation.','blocker','in-progress','critical','tm4','tm2',ARRAY['Open billing page','Enter card details','Click Pay on a throttled connection','Observe two charges in Stripe'],'production','2026-04-18','2026-04-21',NULL),
('b2','p1','Session timeout not showing warning modal','Users are silently logged out without the 2-minute warning dialog appearing.','major','open','high','tm9',NULL,ARRAY['Log in','Leave page idle for 28 minutes','Check for modal'],'staging','2026-04-17','2026-04-17',NULL),
('b3','p1','PDF invoice missing line items for prepaid plans','Generated invoices show only the total amount, not itemized breakdown.','major','open','high','tm4','tm2',ARRAY['Navigate to Billing','Download invoice for a prepaid plan','Check line items section'],'production','2026-04-15','2026-04-15',NULL),
('b4','p2','Dashboard crashes when date range exceeds 90 days','ClickHouse query times out and causes unhandled promise rejection, crashing the UI.','blocker','open','critical','tm6','tm3',ARRAY['Open analytics dashboard','Set date range > 90 days','Observe white screen'],'staging','2026-04-10','2026-04-10',NULL),
('b5','p2','Bar chart tooltip flickers on hover','Tooltip rapidly shows/hides when cursor is near bar edge.','minor','open','low','tm3',NULL,ARRAY['Open any bar chart widget','Hover cursor along bar edges slowly'],'staging','2026-04-12','2026-04-12',NULL),
('b6','p3','Auth service returns 500 on expired refresh token','Should return 401, but returns internal server error causing client-side crash loops.','blocker','resolved','critical','tm1','tm1',ARRAY['Obtain a refresh token','Wait for expiry (7 days)','Call /auth/refresh'],'staging','2026-03-20','2026-04-02','2026-04-02'),
('b7','p3','Order service leaks goroutines under load','Load test reveals goroutine count grows unbounded, leading to OOM after ~2h.','major','in-progress','high','tm5','tm7',ARRAY['Run k6 load test profile "heavy"','Monitor goroutines via pprof endpoint','Observe linear growth over time'],'staging','2026-04-22','2026-04-23',NULL),
('b8','p5','Vault token renewal silently fails in prod','After 768h, vault tokens expire and services cannot connect to databases — no alert fires.','blocker','resolved','critical','tm5','tm5',ARRAY['Check vault token TTL in prod','Observe no renewal job in k8s cronjobs'],'production','2026-01-25','2026-01-28','2026-01-28'),
('b9','p1','Profile avatar upload fails for files > 2MB','No error is shown to the user, request just silently fails with 413.','minor','open','medium','tm4',NULL,ARRAY['Go to Profile settings','Upload an image > 2MB','Submit and observe no feedback'],'production','2026-04-19','2026-04-19',NULL),
('b10','p2','Kafka consumer lag not visible in metrics','Consumer group lag missing from the analytics metrics dashboard.','major','open','high','tm6','tm7',ARRAY['Open Ops metrics page','Check Kafka section','Observe no consumer lag panel'],'production','2026-04-08','2026-04-08',NULL),
('b11','p3','gRPC interceptor does not propagate trace context','Distributed traces break at service boundaries.','major','open','high','tm1','tm7',ARRAY['Trigger a cross-service request','Check Jaeger for the trace','Observe missing spans after first hop'],'staging','2026-04-20','2026-04-20',NULL),
('b12','p1','Dark mode contrast fails WCAG AA on sidebar','Several navigation items have contrast ratio below 4.5:1 in dark mode.','trivial','closed','low','tm9','tm9',ARRAY['Switch to dark mode','Run axe DevTools scan on sidebar'],'staging','2026-03-10','2026-03-15','2026-03-15');
