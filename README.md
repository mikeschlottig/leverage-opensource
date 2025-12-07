# LEVERAGE OpenSource

[![Deploy to Cloudflare][cloudflarebutton]]

LEVERAGE OpenSource is a developer-facing SaaS-style tool (frontend on Cloudflare Workers edge) that analyzes open-source repositories, discovers repeatable patterns (features, ingestion engines, routing/logic, entry points), catalogs them, and turns them into production-ready, reusable React components and workflow templates. It indexes feature entry points per-project for fast retrieval and provides a Component Studio where extracted patterns can be previewed, parameterized and exported. Deep integrations (read-only) with [docs.crawl4ai.com](https://docs.crawl4ai.com) and [deepwiki.com](https://deepwiki.com) surface contextual documentation and mechanism-of-action metadata during analysis.

The purpose of this software is to streamline and enhance the development process by identifying successful and repeatable patterns and turning them into frameworks, guides, workflows, and re-usable components. For example, it can ingest a repository like codetxt, identify the 'ingestion engine' (mechanisms of action, routes, and logic), and package it into a reusable React Component for integration into projects like Cloudflare's VibeSDK.

## Key Features

- **Catalog & Index**: Searchable, faceted index of projects, features, patterns, and generated components. Fast listing with stable paging and saved filters.
- **Project Explorer**: Repository-level view showing file tree, detected entry points, component candidates, and ingestion-engine breakdown with annotations and links to deepwiki/docs.crawl4ai.
- **Pattern Extractor**: Server-side analysis that accepts repository metadata and returns an IngestionReport with entry points, mechanisms-of-action, and componentization candidates (Phase 1: mock/semi-real analysis using seeded examples like codetxt).
- **Component Studio**: Visual editor for live preview of generated React components, props schema editing, and export options (ZIP, copy-to-clipboard) with metadata for downstream integration.
- **Patterns Library**: Curated reusable components and workflows with descriptions, tags, code snippets, and integration instructions.
- **Integrations Pane**: Contextual links to docs.crawl4ai.com and deepwiki.com for selected mechanisms or patterns.

User personas include open-source engineers, solution architects, and platform integrators seeking to speed up productizing and reusing existing project logic as UI components and workflows.

## Technology Stack

- **Frontend**: React 18, React Router DOM, shadcn/ui, Tailwind CSS, Framer Motion (animations), Lucide React (icons), Sonner (toasts), Zustand (state management), TanStack React Query (data fetching), React Hook Form, Zod (validation).
- **Backend**: Hono (routing), Cloudflare Workers (edge runtime), Durable Objects (persistence via GlobalDurableObject), Cloudflare Index utilities.
- **Utilities**: UUID, Date-fns, Recharts (visualizations), React Markdown with Rehype Sanitize (safe rendering).
- **Build & Dev**: Vite (bundler), TypeScript, Bun (package manager), ESLint, Prettier.
- **Deployment**: Cloudflare Workers/Pages.

## Quick Start

### Prerequisites

- Node.js 18+ (or Bun 1.0+ recommended)
- Cloudflare account (for deployment)
- Wrangler CLI: Install via `npm i -g wrangler` or `bun add -g wrangler`

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd leverage-opensource
   ```

2. Install dependencies using Bun:
   ```
   bun install
   ```

3. Generate TypeScript types for Workers bindings:
   ```
   bun run cf-typegen
   ```

### Development

1. Start the development server:
   ```
   bun dev
   ```
   The app will be available at `http://localhost:3000`.

2. In a separate terminal, start the Worker (for API endpoints):
   ```
   wrangler dev
   ```
   This runs the backend on Cloudflare's edge simulator.

3. Open `http://localhost:3000` in your browser to view the app. The frontend proxies API calls to the Worker.

#### Usage Examples

- **Home Page**: Features a hero section with quick search, shortcuts to ingest a repository, browse the catalog, or access the Component Studio. Recent analyses appear in an activity feed.
- **Ingest Repository**: Paste a repo URL (e.g., codetxt) to trigger analysis. View results in the Project Explorer, which shows file tree, detected entry points, and links to docs.crawl4ai.com/deepwiki.com.
- **Catalog**: Search and filter projects/patterns. Cards display tags, origin, quality scores, and actions like preview/export.
- **Component Studio**: Select a pattern to preview the generated React component, edit props, and export as ZIP or snippet.
- **API Interaction**: Frontend uses TanStack Query for optimistic updates. Example: POST `/api/projects` to create a project, then GET `/api/projects/:id/analyze` for the IngestionReport.

For testing, use seeded data (e.g., codetxt example) via mock endpoints in `worker/user-routes.ts`.

### Building

Build the frontend assets:
```
bun run build
```

This generates static files in `dist/` for deployment.

## Deployment

Deploy to Cloudflare Workers/Pages for edge deployment with Durable Objects persistence.

1. Authenticate with Cloudflare:
   ```
   wrangler login
   ```

2. Configure your project (edit `wrangler.jsonc` if needed, but avoid modifying bindings):
   - Ensure `GlobalDurableObject` binding is set for storage.

3. Deploy the Worker and Pages:
   ```
   bun run deploy
   ```
   This builds the frontend and deploys both the Worker (API) and Pages (static assets).

4. Access your deployed app at the provided URL. The Durable Object handles state across edge locations.

For one-click deployment:

[cloudflarebutton]

#### Post-Deployment

- Seed initial data: Run `wrangler tail` to monitor logs during first requests, which trigger entity seeding.
- Custom Domain: Use `wrangler pages deploy dist --project-name <name>` for Pages, and bind a custom domain in the Cloudflare dashboard.
- Environment Variables: Set via Wrangler secrets if needed (e.g., `wrangler secret put API_KEY`).

## Architecture Overview

- **Frontend**: React app with React Router for views (Home, Catalog, Project Explorer, Component Studio, Pattern Library, Integrations). Uses shadcn/ui for components, Tailwind for styling, and Framer Motion for interactions.
- **Backend**: Hono-based Worker routes under `/api/*`. Persistence via single GlobalDurableObject with entity classes (e.g., ProjectEntity, PatternEntity) and Index for listings.
- **Data Flow**: Client POSTs to `/api/projects` to ingest; Worker analyzes (mock in Phase 1) and stores via Entities. Queries use cursors for pagination.
- **Phases**: Phase 1 focuses on visual foundation and mock APIs; subsequent phases add real analysis and integrations.

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

Follow TypeScript conventions, add tests where applicable, and ensure no breaking changes to core utilities (`worker/core-utils.ts`).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- Issues: Report bugs or request features on GitHub.
- Docs: Refer to Cloudflare Workers documentation for Durable Objects and Hono for routing.
- Community: Join Cloudflare's developer forums for Workers support.