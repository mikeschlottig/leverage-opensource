import { AppLayout } from '@/components/layout/AppLayout';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { BookOpen, Link as LinkIcon, ExternalLink, Search } from 'lucide-react';
import { MOCK_PATTERNS } from '@shared/mock-data';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
const MOCK_DOCS = {
  'ingestion': [
    { title: 'Core Concepts: Traversal', url: 'https://docs.crawl4ai.com/concepts/traversal' },
    { title: 'Deep Dive: File System API', url: 'https://deepwiki.com/filesystem-api' },
  ],
  'parser': [
    { title: 'Core Concepts: AST Parsing', url: 'https://docs.crawl4ai.com/concepts/ast' },
    { title: 'Deep Dive: Abstract Syntax Trees', url: 'https://deepwiki.com/ast-parsing' },
  ],
  'auth': [
    { title: 'Security: JWT Best Practices', url: 'https://docs.crawl4ai.com/security/jwt' },
    { title: 'Deep Dive: JSON Web Tokens', url: 'https://deepwiki.com/jwt' },
  ]
};
export default function IntegrationsPane() {
  return (
    <AppLayout>
      <ThemeToggle />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold">Integrations & Docs</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Contextual documentation from our partners to accelerate your development.
            </p>
          </motion.header>
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Documentation Hub</CardTitle>
                <CardDescription>
                  Find relevant articles from docs.crawl4ai.com and deepwiki.com.
                </CardDescription>
                <div className="mt-4 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input placeholder="Search documentation..." className="pl-9" />
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full">
                  {Object.entries(MOCK_DOCS).map(([category, links]) => (
                    <AccordionItem value={category} key={category}>
                      <AccordionTrigger className="capitalize text-lg">{category}</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-3">
                          {links.map(link => (
                            <li key={link.url}>
                              <a 
                                href={link.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors group"
                              >
                                <div className="flex items-center gap-3">
                                  {link.url.includes('crawl4ai') ? <BookOpen className="w-5 h-5 text-primary" /> : <LinkIcon className="w-5 h-5 text-indigo-400" />}
                                  <div>
                                    <p className="font-medium">{link.title}</p>
                                    <p className="text-xs text-muted-foreground">{new URL(link.url).hostname}</p>
                                  </div>
                                </div>
                                <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                              </a>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}