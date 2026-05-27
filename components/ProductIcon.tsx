export default function ProductIcon({ type, className }: { type: string; className?: string }) {
  const icons: Record<string, React.ReactElement> = {
    pixel: (
      <svg viewBox="0 0 400 400" fill="none" className={className}>
        <circle cx="200" cy="200" r="95" fill="#3a3a3a" />
        <circle cx="200" cy="200" r="65" fill="#cccccc" />
      </svg>
    ),
    pixelbar: (
      <svg viewBox="0 0 400 400" fill="none" className={className}>
        <rect x="55" y="180" width="290" height="42" rx="4" fill="#3a3a3a" />
        <rect x="65" y="190" width="270" height="22" rx="2" fill="#1a1a1a" />
        {[85, 120, 155, 190, 225, 260, 295, 320].map((cx) => (
          <circle key={cx} cx={cx} cy="201" r="6" fill="#e5e5e5" />
        ))}
      </svg>
    ),
    washer: (
      <svg viewBox="0 0 400 400" fill="none" className={className}>
        <rect x="40" y="160" width="320" height="80" rx="8" fill="#3a3a3a" />
        <rect x="55" y="178" width="290" height="44" rx="4" fill="#f4f4f4" />
        {[70, 100, 130, 160, 190, 220, 250, 280, 310].map((x) => (
          <rect key={x} x={x} y="194" width="14" height="12" rx="1" fill="#777" />
        ))}
      </svg>
    ),
    flood: (
      <svg viewBox="0 0 400 400" fill="none" className={className}>
        <rect x="100" y="120" width="200" height="180" rx="14" fill="#3a3a3a" />
        <rect x="116" y="136" width="168" height="148" rx="6" fill="#0a0a0a" />
        <ellipse cx="200" cy="210" rx="68" ry="60" fill="#cccccc" />
      </svg>
    ),
    flex: (
      <svg viewBox="0 0 400 400" fill="none" className={className}>
        <path d="M 40 200 Q 90 130 160 200 T 280 200 T 360 170" stroke="#f4f4f4" strokeWidth="22" strokeLinecap="round" />
        {[80, 135, 190, 250, 310].map((cx, index) => (
          <circle key={cx} cx={cx} cy={index < 2 ? 170 : index === 2 ? 220 : 200 - (index - 3) * 10} r="3" fill="#3a3a3a" />
        ))}
      </svg>
    ),
    controller: (
      <svg viewBox="0 0 400 400" fill="none" className={className}>
        <rect x="80" y="140" width="240" height="160" rx="10" fill="#3a3a3a" />
        <rect x="95" y="160" width="210" height="60" rx="3" fill="#0a0a0a" />
        {[120, 160, 200, 240, 280].map((cx) => (
          <circle key={cx} cx={cx} cy="255" r="10" fill="#666" />
        ))}
      </svg>
    ),
  };

  return icons[type] ?? icons.pixel;
}
