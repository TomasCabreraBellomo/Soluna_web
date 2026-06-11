import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
};

const variants = {
  primary: "bg-soluna-champagne text-white shadow-glow hover:bg-[#b79558]",
  secondary: "border border-soluna-champagne/50 bg-white/70 text-soluna-charcoal hover:border-soluna-champagne hover:bg-white",
  ghost: "text-soluna-charcoal hover:bg-soluna-nude/40"
};

export function Button({ href, variant = "primary", className = "", children, ...props }: ButtonProps) {
  const classes = `focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
