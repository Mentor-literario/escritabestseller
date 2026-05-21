import { HTMLAttributes } from "react";
import { clsx } from "clsx";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export default function Card({ hover = false, className, children, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        "bg-white border border-gold-300/40 rounded-lg shadow-sm",
        hover && "hover:border-gold-400 hover:shadow-md transition-all duration-200 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
