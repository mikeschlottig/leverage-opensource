import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Pattern, ComponentSpec } from '@shared/types';
import { AppLayout } from '@/components/layout/AppLayout';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Cuboid, Download, FileCode, Layers, Settings } from 'lucide-react';
import { ComponentPreview } from '@/components/ComponentPreview';
import { Toaster, toast } from '@/components/ui/sonner';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
export default function ComponentStudio() {
  const { patternId } = useParams<{ patternId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [componentName, setComponentName] = useState('');
  const { data: pattern, isLoading: isLoadingPattern } = useQuery<Pattern>({
    queryKey: ['pattern', patternId],
    queryFn: () => api(`/api/patterns/${patternId}`),
    enabled: !!patternId,
  });
  useEffect(() => {
    if (pattern?.title && !componentName) {
      const name = pattern.title.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
      setComponentName(name);
    }
  }, [pattern, componentName]);
  const createComponentMutation = useMutation<ComponentSpec, Error, { patternId: string; name: string }>({
    mutationFn: (vars) => api('/api/components', { method: 'POST', body: JSON.stringify(vars) }),
    onSuccess: (data) => {
      toast.success(`Component "${data.name}" created successfully!`);
      queryClient.invalidateQueries({ queryKey: ['components'] });
    },
    onError: (error) => {
      toast.error(`Failed to create component: ${error.message}`);
    }
  });
  const handleCreateAndExport = () => {
    if (!patternId || !componentName.trim()) {
      toast.error("Component name is required.");
      return;
    }
    createComponentMutation.mutate({ patternId, name: componentName.trim() });
  };
  if (isLoadingPattern) {
    return <ComponentStudioSkeleton />;
  }
  if (!pattern) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen text-muted-foreground">Pattern not found.</div>
      </AppLayout>
    );
  }
  return (
    <AppLayout>
      <ThemeToggle />
      <Toaster richColors />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-display font-bold">Component Studio</h1>
            <p className="text-muted-foreground mt-2">
              Preview, configure, and export your generated component from the "{pattern?.title}" pattern.
            </p>
          </motion.header>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <motion.main 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Cuboid /> Live Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  {createComponentMutation.data ? (
                    <ComponentPreview component={createComponentMutation.data} />
                  ) : (
                    <div className="w-full h-96 flex items-center justify-center bg-muted/30 rounded-lg border border-dashed">
                      <p className="text-muted-foreground">Your component preview will appear here.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.main>
            <motion.aside 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-6 sticky top-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Settings /> Configuration</CardTitle>
                  <CardDescription>Define the properties for your new component.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <label htmlFor="componentName" className="text-sm font-medium">Component Name</label>
                    <Input
                      id="componentName"
                      value={componentName}
                      onChange={(e) => setComponentName(e.target.value)}
                      placeholder="e.g., IngestionEngineUI"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={handleCreateAndExport}
                    disabled={createComponentMutation.isPending}
                  >
                    {createComponentMutation.isPending ? 'Generating...' : 'Generate & Export'}
                    <Download className="w-4 h-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><FileCode /> Source Pattern</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold">{pattern?.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{pattern?.description}</p>
                  <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => navigate(`/projects/${pattern?.projectId}`)}>
                    <Layers className="w-4 h-4 mr-2" /> View Source Project
                  </Button>
                </CardContent>
              </Card>
            </motion.aside>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
function ComponentStudioSkeleton() {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <header className="mb-8">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-5 w-2/3 mt-4" />
          </header>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <main className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-1/3" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-96 w-full" />
                </CardContent>
              </Card>
            </main>
            <aside className="space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-4 w-3/4 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full mt-2" />
                  <Skeleton className="h-4 w-5/6 mt-1" />
                  <Skeleton className="h-9 w-full mt-4" />
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}