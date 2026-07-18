import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Sparkles, Award, Lightbulb, Eye, EyeOff } from "lucide-react";

export interface MovieStorySectionProps {
  synopsis: string;
  highlights?: string[];
  whyWatch?: string[];
  facts?: string[];
}

const DEFAULT_HIGHLIGHTS = [
  "Shot on real IMAX 70mm cameras",
  "Practical effects over CGI wherever possible",
  "Original orchestral score recorded live",
];
const DEFAULT_WHY = [
  "A visual spectacle best experienced on the big screen",
  "Career-defining performances from the lead cast",
  "A story that rewards repeat viewings",
];
const DEFAULT_FACTS = [
  "The opening sequence took 3 months to film.",
  "Over 800 artists worked on the visual effects.",
  "The director hid easter eggs referencing their earlier films.",
];

/**
 * Expandable "Movie Story" section with a reading-progress indicator that
 * fills as the reader scrolls through the section. Facts are spoiler-gated.
 */
const MovieStorySection: React.FC<MovieStorySectionProps> = ({
  synopsis,
  highlights = DEFAULT_HIGHLIGHTS,
  whyWatch = DEFAULT_WHY,
  facts = DEFAULT_FACTS,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [showFacts, setShowFacts] = React.useState(false);

  return (
    <section ref={ref} className="mt-[120px]">
      <div className="mb-8 flex items-center gap-4">
        <h2 className="font-heading text-3xl font-extrabold uppercase tracking-wide text-white">
          The Story
        </h2>
        {/* reading progress */}
        <div className="relative hidden h-1 flex-1 overflow-hidden rounded-full bg-white/10 sm:block">
          <motion.div
            style={{ scaleX: progress, transformOrigin: "0%" }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-gold to-gold-premium"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="cpm-glass p-6 lg:col-span-2"
        >
          <h3 className="mb-3 flex items-center gap-2 font-heading font-bold text-gold">
            <Sparkles className="h-4 w-4" /> Official Synopsis
          </h3>
          <p className="text-sm leading-relaxed text-cpm-muted">{synopsis}</p>

          <h3 className="mb-3 mt-6 flex items-center gap-2 font-heading font-bold text-gold">
            <Award className="h-4 w-4" /> Why Watch
          </h3>
          <ul className="space-y-2">
            {whyWatch.map((w) => (
              <li key={w} className="flex items-start gap-2 text-sm text-cpm-muted">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                {w}
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="cpm-glass p-6"
          >
            <h3 className="mb-3 font-heading font-bold text-white">Highlights</h3>
            <ul className="space-y-2">
              {highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-cpm-muted">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cinemaRed" />
                  {h}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="cpm-glass p-6"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-heading font-bold text-white">
                <Lightbulb className="h-4 w-4 text-gold" /> Interesting Facts
              </h3>
              <button
                onClick={() => setShowFacts((s) => !s)}
                className="flex items-center gap-1 text-[11px] font-semibold text-gold"
              >
                {showFacts ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {showFacts ? "Hide" : "Reveal"}
              </button>
            </div>
            <ul className={`space-y-2 transition-all ${showFacts ? "" : "blur-sm select-none"}`}>
              {facts.map((f) => (
                <li key={f} className="text-sm text-cpm-muted">
                  • {f}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MovieStorySection;
