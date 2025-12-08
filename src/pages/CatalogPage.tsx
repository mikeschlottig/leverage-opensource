import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { PatternCard, PatternCardSkeleton } from '@/components/PatternCard';
import { api } from '@/lib/api-client';
import type { Pattern, Project } from '@shared/types';
import { AppLayout } from '@/components/layout/AppLayout';
import { Search } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link } from 'react-router-dom';
export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: projects, isLoading: isLoadingProjects } = useQuery<{ items: Project[] }>({
    queryKey: ['projects'],
    queryFn: () => api('/api/projects'),
  });
  const { data: patterns, isLoading: isLoadingPatterns } = useQuery<{ items: Pattern[] }>({
    queryKey: ['patterns'],
    queryFn: () => api('/api/patterns'),
  });
  const projectsById = new Map(projects?.items.map(p => [p.id, p]));
  const filteredPatterns = patterns?.items.filter(pattern =>
    pattern.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pattern.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pattern.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const isLoading = isLoadingProjects || isLoadingPatterns;
  return (
    <AppLayout>
      <ThemeToggle />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold">Pattern & Component Catalog</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover reusable patterns and components extracted from open-source projects.
            </p>
            <div className="mt-8 max-w-lg mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search patterns by name, tag, or description..."
                className="w-full pl-12 h-12 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </header>
          <main>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => <PatternCardSkeleton key={i} />)
                : filteredPatterns?.map(pattern => (
                    <PatternCard
                      key={pattern.id}
                      pattern={pattern}
                      project={projectsById.get(pattern.projectId)}
                    />
                  ))}
            </div>
            {!isLoading && filteredPatterns?.length === 0 && (
              <div className="text-center py-16 col-span-full bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">No patterns found matching your search.</p>
                <p className="mt-2 text-sm">Try a different keyword or <Link to="/" className="text-primary hover:underline">ingest a new project</Link>.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </AppLayout>
  );
}