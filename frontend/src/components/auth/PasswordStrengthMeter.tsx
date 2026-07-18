import React from "react";

export interface PasswordStrengthMeterProps {
  password: string;
}

interface Result {
  score: number; // 0..4
  label: string;
  color: string;
}

export const scorePassword = (pw: string): Result => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  const map: Result[] = [
    { score: 0, label: "Too weak", color: "#FF1744" },
    { score: 1, label: "Weak", color: "#FF3B30" },
    { score: 2, label: "Medium", color: "#FFC107" },
    { score: 3, label: "Strong", color: "#00C853" },
    { score: 4, label: "Excellent", color: "#FFD700" },
  ];
  return map[score];
};

/**
 * Live password strength meter (4 segments) with a descriptive label.
 */
const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  if (!password) return null;
  const { score, label, color } = scorePassword(password);

  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="h-1.5 flex-1 rounded-full transition-colors"
            style={{ backgroundColor: i < score ? color : "rgba(255,255,255,0.12)" }}
          />
        ))}
      </div>
      <p className="mt-1.5 text-[11px] font-semibold" style={{ color }}>
        {label}
      </p>
    </div>
  );
};

export default PasswordStrengthMeter;
