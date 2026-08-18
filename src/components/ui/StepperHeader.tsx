import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { IoCheckmark } from "react-icons/io5";

interface StepperHeaderProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function StepperHeader({ steps, currentStep, className }: StepperHeaderProps) {
  return (
    <div className={cn("flex items-center gap-1 sm:gap-2", className)}>
      {steps.map((step, i) => {
        const isActive = i === currentStep;
        const isCompleted = i < currentStep;
        return (
          <div key={step} className="flex items-center gap-1.5 sm:gap-2 flex-1">
            <div className="flex items-center gap-2 flex-1">
              <div
                className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold shrink-0 transition-all duration-300"
                style={{
                  background: isCompleted ? "var(--accent-aqua)" : isActive ? "var(--accent-coral)" : "var(--glass-bg-hover)",
                  color: isCompleted || isActive ? "white" : "var(--text-muted)",
                  boxShadow: isActive ? "0 0 16px var(--glow-aqua)" : "none",
                }}
              >
                {isCompleted ? <IoCheckmark size={16} /> : i + 1}
              </div>
              <span className="text-xs font-semibold hidden sm:inline" style={{ color: isActive ? "var(--text-primary)" : "var(--text-muted)" }}>
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="h-0.5 flex-1 rounded-full transition-all duration-300"
                style={{ background: isCompleted ? "var(--accent-aqua)" : "var(--glass-border)" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
