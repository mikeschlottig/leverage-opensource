import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Code, Cuboid, FileCode } from 'lucide-react';
import { Pattern } from '@shared/types';
import { Skeleton } from './ui/skeleton';
interface PatternCardProps {
  pattern: Pattern;
  project?: { name: string };
}
export function PatternCard({ pattern, project }: PatternCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      className="h-full"
    >
      <Card className="flex flex-col h-full border-border/60 hover:border-primary/50 transition-colors duration-300">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold">{pattern.title}</CardTitle>
            <Badge variant={pattern.score > 90 ? 'default' : 'secondary'} className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Score: {pattern.score}
            </Badge>
          </div>
          {project && (
            <CardDescription>
              From <Link to={`/projects/${pattern.projectId}`} className="text-primary hover:underline">{project.name}</Link>
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground text-sm mb-4">{pattern.description}</p>
          <div className="flex flex-wrap gap-2">
            {pattern.tags.slice(0, 4).map(tag => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/projects/${pattern.projectId}`}><FileCode className="w-4 h-4 mr-2" /> Open Project</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to={`/studio/${pattern.id}`}>Create Component <Cuboid className="w-4 h-4 ml-2" /></Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
export function PatternCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-4 w-1/2 mt-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-4" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-14" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-36" />
      </CardFooter>
    </Card>
  );
}