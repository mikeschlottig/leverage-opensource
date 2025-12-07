import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComponentSpec } from '@shared/types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
interface ComponentPreviewProps {
  component: ComponentSpec;
}
export function ComponentPreview({ component }: ComponentPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full p-4 bg-muted/30 rounded-lg border border-dashed"
    >
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{component.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This is a live preview of the generated component.
          </p>
          <div className="space-y-2">
            {Object.entries(component.propsSchema).map(([propName, propType]) => (
              <div key={propName}>
                <Label htmlFor={propName} className="capitalize">{propName}</Label>
                <Input id={propName} type={propType === 'number' ? 'number' : 'text'} placeholder={`Enter ${propName}...`} />
              </div>
            ))}
          </div>
          <Button>Example Action</Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}