export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
// LEVERAGE OpenSource Types
export type ProjectStatus = 'pending' | 'analyzing' | 'completed' | 'failed';
export type AnalysisStatus = 'fetching_tree' | 'parsing' | 'complete';
export type ExportFormat = 'zip' | 'snippet';
export interface User {
  id: string;
  name: string;
  email?: string;
}
export interface Project {
  id: string;
  name: string;
  repoUrl: string;
  status: ProjectStatus;
  createdAt: number; // epoch millis
  updatedAt: number; // epoch millis
  analysis?: IngestionReport;
  ownerId?: string;
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
  exportFormats?: ExportFormat[];
  version: string;
  revisions?: ComponentSpec[];
  publishUrl?: string;
}
export interface MechanismOfAction {
  name: string;
  description: string;
  docsUrl: string;
  deepwikiUrl: string;
}
export interface FileTreeNode {
  path: string;
  type: 'tree' | 'blob';
  children?: FileTreeNode[];
  content?: string;
}
export interface IngestionReport {
  projectId: string;
  entryPoints: string[];
  mechanisms: MechanismOfAction[];
  patterns: Pattern[];
  fileTree?: FileTreeNode[];
  status?: AnalysisStatus;
}
// Original Demo Types (kept for compatibility)
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