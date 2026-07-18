import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Image as ImageIcon,
  Film,
  Video,
  FileText,
  CheckCircle2,
  Loader2,
  UploadCloud,
  ShieldCheck,
} from "lucide-react";

interface Asset {
  id: string;
  name: string;
  type: "Poster" | "Banner" | "Trailer" | "Still" | "Logo";
  size: string;
  processed: boolean;
}

const ASSETS: Asset[] = [
  { id: "a1", name: "aether-poster-01.jpg", type: "Poster", size: "2.4 MB", processed: true },
  { id: "a2", name: "aether-hero-banner.webp", type: "Banner", size: "3.1 MB", processed: true },
  { id: "a3", name: "aether-teaser.mp4", type: "Trailer", size: "48 MB", processed: false },
  { id: "a4", name: "still-scene-14.jpg", type: "Still", size: "1.8 MB", processed: true },
  { id: "a5", name: "brand-logo.svg", type: "Logo", size: "42 KB", processed: true },
  { id: "a6", name: "bts-interview.mp4", type: "Trailer", size: "120 MB", processed: false },
];

const TYPE_ICON: Record<Asset["type"], React.ReactNode> = {
  Poster: <ImageIcon className="h-4 w-4" />,
  Banner: <ImageIcon className="h-4 w-4" />,
  Trailer: <Video className="h-4 w-4" />,
  Still: <Film className="h-4 w-4" />,
  Logo: <FileText className="h-4 w-4" />,
};

const AI_CHECKS = [
  "Images compressed",
  "Thumbnails generated",
  "Video transcoded (HLS)",
  "Poster variations created",
  "Accessibility captions",
  "Watermarked versions",
];

const WORKFLOW = [
  "Draft",
  "Internal Review",
  "Media Verification",
  "Legal Review",
  "Content Approval",
  "Marketing Approval",
  "Executive Approval",
  "Scheduled",
  "Published",
];

/**
 * Movie CMS panel: digital media library with AI processing status and the
 * content approval workflow pipeline.
 */
const MovieCmsPanel: React.FC = () => {
  const [stage] = useState(5); // current workflow stage index (Marketing Approval)

  return (
    <div className="space-y-8">
      {/* Media Library */}
      <div className="glass-panel border border-white/5 p-6 rounded-2xl bg-black/40">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-heading text-sm font-extrabold uppercase tracking-wider text-gray-300">
            <UploadCloud className="h-5 w-5 text-accent" /> Digital Media Library
          </h3>
          <span className="text-[10px] uppercase tracking-wider text-gray-500">
            {ASSETS.length} assets · 2 processing
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {ASSETS.map((a) => (
            <motion.div
              key={a.id}
              whileHover={{ y: -4 }}
              className="rounded-xl border border-white/5 bg-white/5 p-3"
            >
              <div className="mb-2 flex h-16 items-center justify-center rounded-lg bg-black/40 text-accent">
                {TYPE_ICON[a.type]}
              </div>
              <p className="truncate text-[11px] font-semibold text-white">{a.name}</p>
              <p className="text-[9px] text-gray-500">{a.type} · {a.size}</p>
              <div className="mt-1.5">
                {a.processed ? (
                  <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" /> AI Optimized
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[9px] font-bold text-amber-400">
                    <Loader2 className="h-3 w-3 animate-spin" /> Processing…
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI processing checklist */}
        <div className="mt-5 grid grid-cols-2 gap-2 border-t border-white/5 pt-4 sm:grid-cols-3">
          {AI_CHECKS.map((c, i) => (
            <div key={c} className="flex items-center gap-2 text-[11px] text-gray-400">
              {i < 4 ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-400" />
              )}
              {c}
            </div>
          ))}
        </div>
      </div>

      {/* Approval workflow */}
      <div className="glass-panel border border-white/5 p-6 rounded-2xl bg-black/40">
        <h3 className="mb-5 flex items-center gap-2 font-heading text-sm font-extrabold uppercase tracking-wider text-gray-300">
          <ShieldCheck className="h-5 w-5 text-luxuryGold" /> Content Approval Workflow
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          {WORKFLOW.map((s, i) => {
            const done = i < stage;
            const active = i === stage;
            return (
              <React.Fragment key={s}>
                <div
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
                    done
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : active
                      ? "border-luxuryGold/40 bg-luxuryGold/10 text-luxuryGold shadow-goldGlow"
                      : "border-white/10 bg-white/5 text-gray-500"
                  }`}
                >
                  {done && <CheckCircle2 className="h-3 w-3" />}
                  {s}
                </div>
                {i < WORKFLOW.length - 1 && <span className="text-gray-600">›</span>}
              </React.Fragment>
            );
          })}
        </div>
        <p className="mt-4 text-[11px] text-gray-500">
          Current stage: <span className="font-bold text-luxuryGold">{WORKFLOW[stage]}</span> · awaiting marketing sign-off with digital audit trail.
        </p>
      </div>
    </div>
  );
};

export default MovieCmsPanel;
