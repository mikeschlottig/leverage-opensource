import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ChatBoardEntity, ProjectEntity, PatternEntity, ComponentEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import { MOCK_PATTERNS } from "@shared/mock-data";
import type { IngestionReport, Pattern, Project, ComponentSpec } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'CF Workers Demo' }}));
  // --- LEVERAGE OpenSource Routes ---
  // PROJECTS
  app.get('/api/projects', async (c) => {
    await ProjectEntity.ensureSeed(c.env);
    const page = await ProjectEntity.list(c.env);
    return ok(c, page);
  });
  app.get('/api/projects/:id', async (c) => {
    const project = new ProjectEntity(c.env, c.req.param('id'));
    if (!await project.exists()) return notFound(c, 'project not found');
    return ok(c, await project.getState());
  });
  app.post('/api/projects', async (c) => {
    const { name, repoUrl } = (await c.req.json()) as Partial<Project>;
    if (!isStr(name) || !isStr(repoUrl)) return bad(c, 'name and repoUrl required');
    const newProject: Project = {
      id: `proj_${crypto.randomUUID()}`,
      name,
      repoUrl,
      status: 'pending',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await ProjectEntity.create(c.env, newProject);
    return ok(c, newProject);
  });
  // ANALYSIS (mocked)
  app.post('/api/projects/:id/analyze', async (c) => {
    const projectId = c.req.param('id');
    const project = new ProjectEntity(c.env, projectId);
    if (!await project.exists()) return notFound(c, 'project not found');
    await project.patch({ status: 'analyzing', updatedAt: Date.now() });
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    const report: IngestionReport = {
      projectId,
      entryPoints: ['src/ingestion/index.ts'],
      mechanisms: [
        { name: 'File System Traversal', description: 'Reads repository file structure.', docsUrl: 'https://docs.crawl4ai.com/concepts/traversal', deepwikiUrl: 'https://deepwiki.com/filesystem-api' },
        { name: 'AST Parsing', description: 'Parses code into an Abstract Syntax Tree.', docsUrl: 'https://docs.crawl4ai.com/concepts/ast', deepwikiUrl: 'https://deepwiki.com/ast-parsing' },
      ],
      patterns: MOCK_PATTERNS.filter(p => p.projectId === projectId),
    };
    await project.patch({ status: 'completed', updatedAt: Date.now() });
    return ok(c, report);
  });
  // PATTERNS
  app.get('/api/patterns', async (c) => {
    await PatternEntity.ensureSeed(c.env);
    const page = await PatternEntity.list(c.env);
    return ok(c, page);
  });
  app.get('/api/patterns/:id', async (c) => {
    const pattern = new PatternEntity(c.env, c.req.param('id'));
    if (!await pattern.exists()) return notFound(c, 'pattern not found');
    return ok(c, await pattern.getState());
  });
  // COMPONENTS
  app.post('/api/components', async (c) => {
    const { patternId, name } = (await c.req.json()) as { patternId: string, name: string };
    if (!isStr(patternId) || !isStr(name)) return bad(c, 'patternId and name required');
    const patternEntity = new PatternEntity(c.env, patternId);
    if (!await patternEntity.exists()) return notFound(c, 'pattern not found');
    const pattern = await patternEntity.getState();
    const newComponent: ComponentSpec = {
      id: `comp_${crypto.randomUUID()}`,
      patternId,
      projectId: pattern.projectId,
      name,
      sourceTemplate: `
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
export const ${name} = ({ title }) => (
  <Card>
    <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
    <CardContent>
      <p>This is a generated component based on the "${pattern.title}" pattern.</p>
      <pre className="bg-muted p-2 rounded-md mt-2 text-xs"><code>${pattern.snippet.replace(/</g, '&lt;')}</code></pre>
    </CardContent>
  </Card>
);
      `,
      propsSchema: { title: 'string' },
      createdAt: Date.now(),
    };
    await ComponentEntity.create(c.env, newComponent);
    return ok(c, newComponent);
  });
  // --- Original Demo Routes ---
  // USERS
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await UserEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });
  app.post('/api/users', async (c) => {
    const { name } = (await c.req.json()) as { name?: string };
    if (!name?.trim()) return bad(c, 'name required');
    return ok(c, await UserEntity.create(c.env, { id: crypto.randomUUID(), name: name.trim() }));
  });
  // CHATS
  app.get('/api/chats', async (c) => {
    await ChatBoardEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await ChatBoardEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });
  app.post('/api/chats', async (c) => {
    const { title } = (await c.req.json()) as { title?: string };
    if (!title?.trim()) return bad(c, 'title required');
    const created = await ChatBoardEntity.create(c.env, { id: crypto.randomUUID(), title: title.trim(), messages: [] });
    return ok(c, { id: created.id, title: created.title });
  });
  // MESSAGES
  app.get('/api/chats/:chatId/messages', async (c) => {
    const chat = new ChatBoardEntity(c.env, c.req.param('chatId'));
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.listMessages());
  });
  app.post('/api/chats/:chatId/messages', async (c) => {
    const chatId = c.req.param('chatId');
    const { userId, text } = (await c.req.json()) as { userId?: string; text?: string };
    if (!isStr(userId) || !text?.trim()) return bad(c, 'userId and text required');
    const chat = new ChatBoardEntity(c.env, chatId);
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.sendMessage(userId, text.trim()));
  });
  // DELETE: Users
  app.delete('/api/users/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await UserEntity.delete(c.env, c.req.param('id')) }));
  app.post('/api/users/deleteMany', async (c) => {
    const { ids } = (await c.req.json()) as { ids?: string[] };
    const list = ids?.filter(isStr) ?? [];
    if (list.length === 0) return bad(c, 'ids required');
    return ok(c, { deletedCount: await UserEntity.deleteMany(c.env, list), ids: list });
  });
  // DELETE: Chats
  app.delete('/api/chats/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await ChatBoardEntity.delete(c.env, c.req.param('id')) }));
  app.post('/api/chats/deleteMany', async (c) => {
    const { ids } = (await c.req.json()) as { ids?: string[] };
    const list = ids?.filter(isStr) ?? [];
    if (list.length === 0) return bad(c, 'ids required');
    return ok(c, { deletedCount: await ChatBoardEntity.deleteMany(c.env, list), ids: list });
  });
}