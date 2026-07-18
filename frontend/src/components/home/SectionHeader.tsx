import React from "react";
import { motion } from "framer-motion";

export interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
}

/** Shared home-section heading with gold eyebrow + underline. */
const SectionHeader: React.FC<SectionHeaderProps> = ({ eyebrow, title, action }) => (
  <div className="mb-10 flex items-end justify-between gap-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
    >
      <span className="cpm-gold-text font-number text-xs font-extrabold uppercase tracking-cpm">
        {eyebrow}
      </span>
      <h2 className="mt-1 font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      <div className="mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-gold to-gold-premium" />
    </motion.div>
    {action}
  </div>
);

export default SectionHeader;
