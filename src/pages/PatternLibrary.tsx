import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { PatternCard, PatternCardSkeleton } from '@/components/PatternCard';
import { api } from '@/lib/api-client';
import type { Pattern, Project } from '@shared/types';
import { AppLayout } from '@/components/layout/AppLayout';
import { Layers, Search } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
export default function PatternLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState('score_desc');
  const { data: projectsData, isLoading: isLoadingProjects } = useQuery<{ items: Project[] }>({
    queryKey: ['projects'],
    queryFn: () => api('/api/projects'),
  });
  const { data: patternsData, isLoading: isLoadingPatterns } = useQuery<{ items: Pattern[] }>({
    queryKey: ['patterns'],
    queryFn: () => api('/api/patterns'),
  });
  const projectsById = useMemo(() => new Map(projectsData?.items.map(p => [p.id, p])), [projectsData]);
  const filteredAndSortedPatterns = useMemo(() => {
    const filtered = patternsData?.items.filter(pattern =>
      pattern.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pattern.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pattern.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    ) ?? [];
    return filtered.sort((a, b) => {
      if (sort === 'score_desc') return b.score - a.score;
      if (sort === 'score_asc') return a.score - b.score;
      // Assuming patterns have a createdAt, which they don't in the type.
      // Let's sort by title as a fallback.
      if (sort === 'date_newest') return a.title.localeCompare(b.title);
      if (sort === 'date_oldest') return b.title.localeCompare(a.title);
      return 0;
    });
  }, [patternsData, searchTerm, sort]);
  const isLoading = isLoadingProjects || isLoadingPatterns;
  return (
    <AppLayout>
      <ThemeToggle />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12 text-center">
            <div className="inline-flex items-center justify-center bg-primary/10 text-primary p-3 rounded-lg mb-4"><Layers className="w-8 h-8" /></div>
            <h1 className="text-4xl md:text-5xl font-display font-bold">Pattern Library</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">A curated collection of battle-tested, reusable patterns ready to be integrated into your projects.</p>
          </motion.header>
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
            <div className="w-full md:w-1/2 lg:w-1/3 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input type="text" placeholder="Search by name, tag, or description..." className="w-full pl-12 h-11" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Sort by" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="score_desc">Score: High to Low</SelectItem>
                  <SelectItem value="score_asc">Score: Low to High</SelectItem>
                  <SelectItem value="date_newest">Name: A-Z</SelectItem>
                  <SelectItem value="date_oldest">Name: Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <main>
            <div className="mb-4"><Badge variant="secondary">{filteredAndSortedPatterns.length} patterns</Badge></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {isLoading ? Array.from({ length: 6 }).map((_, i) => <PatternCardSkeleton key={i} />) : filteredAndSortedPatterns.map(pattern => (<PatternCard key={pattern.id} pattern={pattern} project={projectsById.get(pattern.projectId)} />))}
            </div>
            {!isLoading && filteredAndSortedPatterns.length === 0 && (<div className="text-center py-16 col-span-full bg-muted/50 rounded-lg"><p className="text-muted-foreground">No patterns found.</p><p className="mt-2 text-sm">Try a different search term or <Link to="/" className="text-primary hover:underline">ingest a new project</Link>.</p></div>)}
          </main>
        </div>
      </div>
    </AppLayout>
  );
}