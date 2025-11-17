import { motion } from 'framer-motion';

interface FlowParticleProps {
  delay: number;
}

export const FlowParticle = ({ delay }: FlowParticleProps) => (
  <motion.div
    className="absolute w-2 h-2 rounded-full bg-primary"
    initial={{ x: 0, opacity: 0 }}
    animate={{
      x: [0, 50, 100],
      opacity: [0, 1, 0]
    }}
    transition={{
      duration: 2,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);
