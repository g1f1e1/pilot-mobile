import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "gold" | "outline" | "glass" | "pine";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  gold: "bg-gradient-to-l from-gold-dark via-gold to-gold-light text-ink font-bold shadow-[0_8px_30px_-8px_rgba(200,162,78,0.6)] hover:shadow-[0_10px_40px_-6px_rgba(200,162,78,0.85)] hover:brightness-110",
  outline: "border border-gold/50 text-gold hover:bg-gold/10 hover:border-gold",
  glass: "glass text-cream hover:bg-white/10 hover:border-white/25",
  pine: "bg-pine text-cream hover:bg-pine-300 border border-pine-300/40",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm rounded-xl gap-1.5",
  md: "px-6 py-3 text-base rounded-2xl gap-2",
  lg: "px-8 py-4 text-lg rounded-2xl gap-2.5",
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

interface ButtonAsButton extends BaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> {
  href?: undefined;
}

interface ButtonAsLink extends BaseProps {
  href: string;
  target?: string;
  rel?: string;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const { variant = "gold", size = "md", className, children } = props;
  const classes = cn(
    "inline-flex items-center justify-center font-medium transition-all duration-300 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
    variants[variant],
    sizes[size],
    className
  );

  if ("href" in props && props.href) {
    return (
      <a href={props.href} target={props.target} rel={props.rel} className={classes}>
        {children}
      </a>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, href: _h, ...rest } =
    props as ButtonAsButton;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
