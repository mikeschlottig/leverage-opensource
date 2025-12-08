import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Pattern, ComponentSpec } from '@shared/types';
import { AppLayout } from '@/components/layout/AppLayout';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Cuboid, Download, FileCode, Layers, Settings, Copy, UploadCloud } from 'lucide-react';
import { ComponentPreview } from '@/components/ComponentPreview';
import { Toaster, toast } from '@/components/ui/sonner';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import JSZip from 'jszip';
export default function ComponentStudio() {
  const { patternId } = useParams<{ patternId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [componentName, setComponentName] = useState('');
  const [props, setProps] = useState<Record<string, string>>({});
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
    onError: (error) => toast.error(`Failed to create component: ${error.message}`)
  });
  const handleGenerate = () => {
    if (!patternId || !componentName.trim()) {
      toast.error("Component name is required.");
      return;
    }
    createComponentMutation.mutate({ patternId, name: componentName.trim() });
  };
  const handleCopy = (component: ComponentSpec) => {
    navigator.clipboard.writeText(component.sourceTemplate);
    toast.success('Source code copied to clipboard!');
  };
  const handleDownloadZip = async (component: ComponentSpec) => {
    const zip = new JSZip();
    const readmeContent = `# ${component.name}\n\nGenerated from the "${pattern?.title}" pattern.\n\n## Integration\n\nTo integrate into a project like VibeSDK, import and use the component:\n\n\`\`\`jsx\nimport { ${component.name} } from './components/${component.name}';\n\nfunction App() {\n  return <${component.name} title="My Ingestion Engine" />;\n}\n\`\`\``;
    zip.file(`${component.name}.tsx`, component.sourceTemplate);
    zip.file('props.json', JSON.stringify(component.propsSchema, null, 2));
    zip.file('README.md', readmeContent);
    const blob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${component.name}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Component package downloaded!');
  };
  if (isLoadingPattern) return <ComponentStudioSkeleton />;
  if (!pattern) return <AppLayout><div className="flex items-center justify-center h-screen text-muted-foreground">Pattern not found.</div></AppLayout>;
  return (
    <AppLayout>
      <ThemeToggle />
      <Toaster richColors />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
            <h1 className="text-4xl font-display font-bold">Component Studio</h1>
            <p className="text-muted-foreground mt-2">Preview, configure, and export your generated component from the "{pattern?.title}" pattern.</p>
          </motion.header>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <motion.main initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="lg:col-span-2">
              <Card className="h-full"><CardHeader><CardTitle className="flex items-center gap-2"><Cuboid /> Live Preview</CardTitle></CardHeader>
                <CardContent>
                  {createComponentMutation.data ? (<ComponentPreview component={createComponentMutation.data} />) : (<div className="w-full h-96 flex items-center justify-center bg-muted/30 rounded-lg border border-dashed"><p className="text-muted-foreground">Your component preview will appear here.</p></div>)}
                </CardContent>
              </Card>
            </motion.main>
            <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="space-y-6 sticky top-8">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Settings /> Configuration</CardTitle><CardDescription>Define the properties for your new component.</CardDescription></CardHeader>
                <CardContent><div className="space-y-2"><label htmlFor="componentName" className="text-sm font-medium">Component Name</label><Input id="componentName" value={componentName} onChange={(e) => setComponentName(e.target.value)} placeholder="e.g., IngestionEngineUI" /></div></CardContent>
                <CardFooter><Button className="w-full" onClick={handleGenerate} disabled={createComponentMutation.isPending}>{createComponentMutation.isPending ? 'Generating...' : 'Generate Component'}</Button></CardFooter>
              </Card>
              {createComponentMutation.data && (
                <Card>
                  <CardHeader><CardTitle>Export</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full" onClick={() => handleCopy(createComponentMutation.data!)}><Copy className="w-4 h-4 mr-2" /> Copy Snippet</Button>
                    <Button className="w-full" onClick={() => handleDownloadZip(createComponentMutation.data!)}><Download className="w-4 h-4 mr-2" /> Download ZIP</Button>
                    <Button variant="secondary" className="w-full" onClick={() => toast.info('Publishing to VibeSDK (simulation)...')}><UploadCloud className="w-4 h-4 mr-2" /> Push to VibeSDK</Button>
                  </CardContent>
                </Card>
              )}
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><FileCode /> Source Pattern</CardTitle></CardHeader>
                <CardContent><p className="font-semibold">{pattern?.title}</p><p className="text-sm text-muted-foreground mt-1">{pattern?.description}</p><Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => navigate(`/projects/${pattern?.projectId}`)}><Layers className="w-4 h-4 mr-2" /> View Source Project</Button></CardContent>
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
          <header className="mb-8"><Skeleton className="h-10 w-1/2" /><Skeleton className="h-5 w-2/3 mt-4" /></header>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <main className="lg:col-span-2"><Card><CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader><CardContent><Skeleton className="h-96 w-full" /></CardContent></Card></main>
            <aside className="space-y-6"><Card><CardHeader><Skeleton className="h-8 w-1/2" /><Skeleton className="h-4 w-3/4 mt-2" /></CardHeader><CardContent><Skeleton className="h-10 w-full" /></CardContent><CardFooter><Skeleton className="h-10 w-full" /></CardFooter></Card><Card><CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader><CardContent><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-full mt-2" /><Skeleton className="h-4 w-5/6 mt-1" /><Skeleton className="h-9 w-full mt-4" /></CardContent></Card></aside>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}