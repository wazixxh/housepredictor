import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export default function Card({
  className,
  dark = false,
  ...props
}: HTMLAttributes<HTMLDivElement> & { dark?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl2 p-6",
        dark ? "glass-panel-dark" : "glass-panel",
        className
      )}
      {...props}
    />
  );
}
