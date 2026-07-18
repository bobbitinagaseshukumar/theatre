import React from "react";
import { ShieldCheck, Lock, BadgeCheck, ScanFace } from "lucide-react";

const BADGES = [
  { icon: <Lock className="h-4 w-4" />, label: "256-bit SSL Encryption" },
  { icon: <BadgeCheck className="h-4 w-4" />, label: "PCI-DSS Compliant" },
  { icon: <ScanFace className="h-4 w-4" />, label: "Fraud Detection Active" },
  { icon: <ShieldCheck className="h-4 w-4" />, label: "Verified Merchant" },
];

/**
 * Trust / security panel with badges and a 100/100 security score to reduce
 * checkout anxiety.
 */
const PaymentSecurityPanel: React.FC = () => (
  <div className="cpm-glass p-5">
    <div className="mb-4 flex items-center justify-between">
      <h4 className="flex items-center gap-2 font-heading text-sm font-bold text-white">
        <ShieldCheck className="h-4 w-4 text-success" /> Payment Security
      </h4>
      <span className="flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-[11px] font-bold text-success">
        Security Score 100/100
      </span>
    </div>
    <div className="grid grid-cols-2 gap-3">
      {BADGES.map((b) => (
        <div
          key={b.label}
          className="flex items-center gap-2 rounded-xl border border-cpm-border bg-white/5 px-3 py-2.5 text-[11px] text-cpm-muted"
        >
          <span className="text-success">{b.icon}</span>
          {b.label}
        </div>
      ))}
    </div>
    <p className="mt-3 text-center text-[10px] text-cpm-muted">
      Your card details are tokenized and never stored on our servers.
    </p>
  </div>
);

export default PaymentSecurityPanel;
