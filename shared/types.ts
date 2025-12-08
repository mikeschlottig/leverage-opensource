export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
// Minimal real-world chat example types (shared by frontend and worker)
export interface User {
  id: string;
  name: string;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number; // epoch millis
}
// LEVERAGE OpenSource Types
export type ProjectStatus = 'pending' | 'analyzing' | 'completed' | 'failed';
export interface Project {
  id: string;
  name: string;
  repoUrl: string;
  status: ProjectStatus;
  createdAt: number; // epoch millis
  updatedAt: number; // epoch millis
}
export interface Pattern {
  id: string;
  projectId: string;
  title: string;
  description: string;
  filePaths: string[];
  snippet: string;
  tags: string[];
  score: number; // 0-100 quality/risk score
}
export interface ComponentSpec {
  id: string;
  patternId: string;
  projectId: string;
  name: string;
  sourceTemplate: string;
  propsSchema: Record<string, 'string' | 'number' | 'boolean' | 'object'>;
  createdAt: number;
}
export interface MechanismOfAction {
  name: string;
  description: string;
  docsUrl: string;
  deepwikiUrl: string;
}
export interface IngestionReport {
  projectId: string;
  entryPoints: string[];
  mechanisms: MechanismOfAction[];
  patterns: Pattern[];
}