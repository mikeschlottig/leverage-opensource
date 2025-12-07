import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { PatternCard, PatternCardSkeleton } from '@/components/PatternCard';
import { api } from '@/lib/api-client';
import type { Pattern, Project } from '@shared/types';
import { AppLayout } from '@/components/layout/AppLayout';
import { Search, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    projectId: 'all',
    score: [0, 100],
    tags: [] as string[],
  });
  const { data: projectsData, isLoading: isLoadingProjects } = useQuery<{ items: Project[] }>({
    queryKey: ['projects'],
    queryFn: () => api('/api/projects'),
  });
  const { data: patternsData, isLoading: isLoadingPatterns } = useQuery<{ items: Pattern[] }>({
    queryKey: ['patterns'],
    queryFn: () => api('/api/patterns'),
  });
  const projectsById = useMemo(() => new Map(projectsData?.items.map(p => [p.id, p])), [projectsData]);
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    patternsData?.items.forEach(p => p.tags.forEach(t => tags.add(t)));
    return Array.from(tags);
  }, [patternsData]);
  const filteredPatterns = useMemo(() => {
    return patternsData?.items.filter(pattern => {
      const searchMatch = searchTerm === '' ||
        pattern.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pattern.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pattern.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const projectMatch = filters.projectId === 'all' || pattern.projectId === filters.projectId;
      const scoreMatch = pattern.score >= filters.score[0] && pattern.score <= filters.score[1];
      const tagsMatch = filters.tags.length === 0 || filters.tags.every(t => pattern.tags.includes(t));
      return searchMatch && projectMatch && scoreMatch && tagsMatch;
    }) ?? [];
  }, [patternsData, searchTerm, filters]);
  const isLoading = isLoadingProjects || isLoadingPatterns;
  return (
    <AppLayout>
      <ThemeToggle />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold">Pattern & Component Catalog</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">Discover reusable patterns and components extracted from open-source projects.</p>
            <div className="mt-8 max-w-lg mx-auto relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input type="text" placeholder="Search patterns..." className="w-full pl-12 h-12 text-lg" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <aside className="md:col-span-1">
              <div className="sticky top-8 space-y-6">
                <h3 className="text-lg font-semibold">Filters</h3>
                <div className="space-y-4">
                  <label className="text-sm font-medium">Project</label>
                  <Select value={filters.projectId} onValueChange={v => setFilters(f => ({ ...f, projectId: v }))}><SelectTrigger><SelectValue placeholder="All Projects" /></SelectTrigger><SelectContent><SelectItem value="all">All Projects</SelectItem>{projectsData?.items.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent></Select>
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-medium">Score: {filters.score[0]} - {filters.score[1]}</label>
                  <Slider value={filters.score} onValueChange={v => setFilters(f => ({ ...f, score: v }))} min={0} max={100} step={1} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags</label>
                  <div className="flex flex-wrap gap-2">{allTags.map(tag => <Button key={tag} variant={filters.tags.includes(tag) ? 'default' : 'outline'} size="sm" onClick={() => setFilters(f => ({ ...f, tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag] }))}>{tag}</Button>)}</div>
                </div>
              </div>
            </aside>
            <main className="md:col-span-3">
              <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-semibold">Results</h3><Badge variant="secondary">{filteredPatterns.length} patterns found</Badge></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {isLoading ? Array.from({ length: 6 }).map((_, i) => <PatternCardSkeleton key={i} />) : filteredPatterns.map(pattern => (<PatternCard key={pattern.id} pattern={pattern} project={projectsById.get(pattern.projectId)} />))}
              </div>
              {!isLoading && filteredPatterns.length === 0 && (<div className="text-center py-16 col-span-full bg-muted/50 rounded-lg"><p className="text-muted-foreground">No patterns found.</p><p className="mt-2 text-sm">Try adjusting your filters or <Link to="/" className="text-primary hover:underline">ingest a new project</Link>.</p></div>)}
            </main>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}