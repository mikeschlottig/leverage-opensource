import type { User, Chat, ChatMessage, Project, Pattern, ComponentSpec } from './types';
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'User A' },
  { id: 'u2', name: 'User B' }
];
export const MOCK_CHATS: Chat[] = [
  { id: 'c1', title: 'General' },
];
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'm1', chatId: 'c1', userId: 'u1', text: 'Hello', ts: Date.now() },
];
// LEVERAGE OpenSource Mock Data
export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj_codetxt',
    name: 'codetxt',
    repoUrl: 'https://github.com/example/codetxt',
    status: 'completed',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: 'proj_vibesdk',
    name: 'VibeSDK',
    repoUrl: 'https://github.com/cloudflare/vibesdk',
    status: 'pending',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
];
export const MOCK_PATTERNS: Pattern[] = [
  {
    id: 'patt_ingestion_engine',
    projectId: 'proj_codetxt',
    title: 'Repository Ingestion Engine',
    description: 'Core logic for ingesting and processing code repositories into a structured format for LLMs.',
    filePaths: ['src/ingestion/index.ts', 'src/ingestion/parser.ts', 'src/ingestion/strategy.ts'],
    snippet: `
// src/ingestion/index.ts
export class IngestionEngine {
  constructor(private strategy: IngestionStrategy) {}
  async ingest(repoUrl: string): Promise<StructuredOutput> {
    const files = await this.strategy.fetch(repoUrl);
    const parsed = this.strategy.parse(files);
    return this.strategy.structure(parsed);
  }
}
    `,
    tags: ['ingestion', 'parser', 'core-logic', 'typescript'],
    score: 92,
  },
  {
    id: 'patt_auth_flow',
    projectId: 'proj_vibesdk',
    title: 'JWT Authentication Flow',
    description: 'Handles user authentication and session management using JSON Web Tokens.',
    filePaths: ['src/auth/jwt.ts', 'src/middleware/auth.ts'],
    snippet: `
// src/auth/jwt.ts
export function signToken(payload: object): string {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
}
    `,
    tags: ['auth', 'jwt', 'security', 'middleware'],
    score: 88,
  }
];
export const MOCK_COMPONENTS: ComponentSpec[] = [];