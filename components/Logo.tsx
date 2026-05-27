type LogoProps = {
  stacked?: boolean;
  className?: string;
  markClassName?: string;
  textClassName?: string;
};

export default function Logo({
  stacked = false,
  className = "",
  markClassName = "",
  textClassName = "",
}: LogoProps) {
  return (
    <div
      className={`flex ${stacked ? "flex-col items-center gap-3" : "items-center gap-2.5"} ${className}`}
    >
      <svg
        className={`h-8 w-8 shrink-0 ${stacked ? "h-12 w-12" : ""} ${markClassName}`}
        viewBox="0 0 40 40"
        aria-hidden="true"
      >
        <rect
          x="3"
          y="3"
          width="34"
          height="34"
          rx="6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
        />
        <path
          d="M8 29 29 8M8 23 23 8M8 17 17 8M14 32 32 14M20 32 32 20"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
      <span
        className={`font-semibold tracking-[-0.02em] text-current ${
          stacked ? "text-5xl" : "text-3xl"
        } ${textClassName}`}
      >
        lumencraft
      </span>
    </div>
  );
}
