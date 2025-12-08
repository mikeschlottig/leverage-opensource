import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Cuboid, GitBranch, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster, toast } from '@/components/ui/sonner';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api-client';
import { Project } from '@shared/types';
import { useState } from 'react';
export function HomePage() {
  const navigate = useNavigate();
  const [repoUrl, setRepoUrl] = useState('');
  const [isIngesting, setIsIngesting] = useState(false);
  const handleIngest = async () => {
    if (!repoUrl.trim()) {
      toast.error('Please enter a repository URL.');
      return;
    }
    setIsIngesting(true);
    try {
      const newProject = await api<Project>('/api/projects', {
        method: 'POST',
        body: JSON.stringify({ name: repoUrl.split('/').pop(), repoUrl }),
      });
      toast.success(`Project "${newProject.name}" created. Starting analysis...`);
      navigate(`/projects/${newProject.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to ingest repository.');
    } finally {
      setIsIngesting(false);
    }
  };
  const handleQuickIngest = async () => {
    setIsIngesting(true);
    try {
      // This uses the seeded data on the backend
      toast.success(`Ingesting "codetxt" example...`);
      navigate(`/projects/proj_codetxt`);
    } catch (error) {
      toast.error('Failed to load example project.');
    } finally {
      setIsIngesting(false);
    }
  };
  return (
    <AppLayout>
      <div className="relative min-h-screen w-full overflow-hidden">
        <ThemeToggle className="absolute top-4 right-4 z-20" />
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div 
          className="absolute top-0 left-0 right-0 -z-10 h-[40rem] w-full bg-cover bg-center"
          style={{
            backgroundImage: 'linear-gradient(to bottom, hsl(var(--background)), transparent), radial-gradient(circle at 50% 0, #F3802020, transparent 40%)',
          }}
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-24 md:py-32 lg:py-40 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tighter">
                LEVERAGE <span className="text-gradient">OpenSource</span>
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
                Extract repeatable patterns from repositories and convert them into reusable React components.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-10 max-w-xl mx-auto"
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="text"
                  placeholder="https://github.com/user/repo"
                  className="h-12 text-base"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  disabled={isIngesting}
                />
                <Button size="lg" className="h-12 text-base" onClick={handleIngest} disabled={isIngesting}>
                  {isIngesting ? 'Ingesting...' : 'Ingest Repository'}
                  <GitBranch className="w-5 h-5 ml-2" />
                </Button>
              </div>
              <Button variant="link" className="mt-2 text-muted-foreground" onClick={handleQuickIngest} disabled={isIngesting}>
                or try with the 'codetxt' example
              </Button>
            </motion.div>
          </div>
          <section className="pb-24 md:pb-32">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Search />}
                title="Catalog & Index"
                description="Searchable index of projects, patterns, and generated components."
                link="/catalog"
              />
              <FeatureCard
                icon={<Code />}
                title="Project Explorer"
                description="View file trees, detected entry points, and ingestion engine breakdowns."
                link="/projects/proj_codetxt"
              />
              <FeatureCard
                icon={<Cuboid />}
                title="Component Studio"
                description="Visually edit, preview, and export generated React components."
                link="/studio/patt_ingestion_engine"
              />
            </div>
          </section>
        </main>
        <footer className="text-center py-8 text-muted-foreground/80">
          <p>Built with ❤️ at Cloudflare</p>
        </footer>
      </div>
      <Toaster richColors />
    </AppLayout>
  );
}
function FeatureCard({ icon, title, description, link }: { icon: React.ReactNode; title: string; description: string; link: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-full hover:border-primary/50 transition-colors duration-300 hover:shadow-lg">
        <CardHeader>
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
            {icon}
          </div>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{description}</p>
          <Button variant="ghost" asChild className="mt-4 p-0 h-auto text-primary">
            <Link to={link}>
              Learn More <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}