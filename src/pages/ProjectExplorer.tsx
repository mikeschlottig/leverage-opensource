import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Project, IngestionReport, MechanismOfAction } from '@shared/types';
import { AppLayout } from '@/components/layout/AppLayout';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, BookOpen, BrainCircuit, Code, GitBranch as FileTreeIcon, Github, Link as LinkIcon } from 'lucide-react';
import { PatternCard } from '@/components/PatternCard';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { motion } from 'framer-motion';
export default function ProjectExplorer() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: project, isLoading: isLoadingProject } = useQuery<Project>({
    queryKey: ['project', projectId],
    queryFn: () => api(`/api/projects/${projectId}`),
    enabled: !!projectId,
  });
  const { data: analysis, isLoading: isLoadingAnalysis } = useQuery<IngestionReport>({
    queryKey: ['analysis', projectId],
    queryFn: () => api(`/api/projects/${projectId}/analyze`, { method: 'POST' }),
    enabled: !!project && project.status !== 'completed',
    refetchOnWindowFocus: false,
  });
  const isLoading = isLoadingProject;
  if (isLoading) {
    return <ProjectExplorerSkeleton />;
  }
  if (!project) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen text-muted-foreground">Project not found.</div>
      </AppLayout>
    );
  }
  return (
    <AppLayout>
      <ThemeToggle />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <header className="mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-display font-bold">{project.name}</h1>
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 mt-2">
                  <Github className="w-4 h-4" /> {project.repoUrl}
                </a>
              </div>
              <Badge variant={project.status === 'completed' ? 'default' : 'secondary'} className="capitalize text-sm">
                {project.status}
              </Badge>
            </div>
          </header>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <main className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><BrainCircuit /> Detected Ingestion Engine</CardTitle>
                  <CardDescription>Core mechanisms and patterns identified in this project.</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingAnalysis ? (
                    <div className="space-y-4 p-4">
                      <Skeleton className="h-8 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                  ) : analysis ? (
                    <Accordion type="single" collapsible className="w-full">
                      {analysis.mechanisms.map((mech) => (
                        <motion.div key={mech.name} whileHover={{ backgroundColor: 'hsl(var(--muted))' }} className="rounded-md">
                          <AccordionItem value={mech.name} className="border-b-0">
                            <AccordionTrigger className="px-4">{mech.name}</AccordionTrigger>
                            <AccordionContent className="px-4 pb-4">
                              <p className="text-muted-foreground mb-4">{mech.description}</p>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" asChild>
                                  <a href={mech.docsUrl} target="_blank" rel="noopener noreferrer"><BookOpen className="w-4 h-4 mr-2" /> docs.crawl4ai.com</a>
                                </Button>
                                <Button variant="outline" size="sm" asChild>
                                  <a href={mech.deepwikiUrl} target="_blank" rel="noopener noreferrer"><LinkIcon className="w-4 h-4 mr-2" /> deepwiki.com</a>
                                </Button>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </motion.div>
                      ))}
                    </Accordion>
                  ) : (
                    <p className="text-muted-foreground p-4">No analysis available.</p>
                  )}
                </CardContent>
              </Card>
              <div>
                <h2 className="text-2xl font-semibold mb-4">Identified Patterns</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {isLoadingAnalysis ? (
                    <>
                      <Skeleton className="h-64 w-full" />
                      <Skeleton className="h-64 w-full" />
                    </>
                  ) : analysis?.patterns.length ? (
                    analysis.patterns.map(p => <PatternCard key={p.id} pattern={p} />)
                  ) : (
                    <p className="text-muted-foreground md:col-span-2">No componentizable patterns found.</p>
                  )}
                </div>
              </div>
            </main>
            <aside className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><FileTreeIcon /> File Tree</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2">
                    {analysis?.patterns[0]?.filePaths.map(path => (
                      <li key={path} className="flex items-center gap-2 text-muted-foreground"><Code className="w-4 h-4 text-primary/70" /> {path}</li>
                    ))}
                    {!analysis && <li className="text-muted-foreground">Analysis pending...</li>}
                  </ul>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
function ProjectExplorerSkeleton() {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <header className="mb-8">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-5 w-2/3 mt-4" />
          </header>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
              <div>
                <Skeleton className="h-8 w-1/3 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
              </div>
            </div>
            <aside>
              <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-5/6" />
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}