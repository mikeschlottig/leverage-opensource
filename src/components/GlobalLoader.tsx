import { useIsFetching } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
export function GlobalLoader() {
  const isFetching = useIsFetching();
  return (
    <AnimatePresence>
      {isFetching > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading data...</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}