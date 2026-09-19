import * as React from "react"

export type SkillStatus = "verified" | "in_progress" | "needs_improvement" | "claimed" | "assessed";

interface SkillPillProps extends React.HTMLAttributes<HTMLDivElement> {
  status: SkillStatus;
  children: React.ReactNode;
}

export function SkillPill({ status, children, className = "", ...props }: SkillPillProps) {
  let statusClasses = "";
  
  if (status === "verified") {
    statusClasses = "bg-primary text-[var(--on-pine)]";
  } else if (status === "in_progress" || status === "claimed" || status === "assessed") {
    statusClasses = "bg-[var(--ochre)] text-[var(--on-ochre)]";
  } else if (status === "needs_improvement") {
    statusClasses = "bg-[var(--rust)] text-[var(--on-rust)]";
  }

  return (
    <div 
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
