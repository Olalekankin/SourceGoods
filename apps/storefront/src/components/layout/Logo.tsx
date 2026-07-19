type LogoProps = {
  variant?: 'dark' | 'light';
  className?: string;
  alt?: string;
};

export default function Logo({
  variant = 'dark',
  className = '',
  alt = 'SourceGoods',
}: LogoProps) {
  const isLight = variant === 'light';
  const textFill = isLight ? '#FFFFFF' : '#23292F';
  const middleRectFill = isLight ? '#FFFFFF' : '#23292F';

  return (
    <svg
      viewBox="0 0 500 200"
      xmlns="http://www.w3.org/2000/svg"
      fontFamily="Arial, Helvetica, sans-serif"
      role="img"
      aria-label={alt}
      className={`h-16 w-auto object-contain ${className}`}
    >
      <g transform="translate(90,100)">
        <rect x="-18" y="-46" width="36" height="30" rx="3" fill="#FF9900" />
        <rect x="-40" y="-14" width="36" height="30" rx="3" fill={middleRectFill} />
        <rect x="4" y="-14" width="36" height="30" rx="3" fill="#FF9900" opacity="0.85" />
      </g>
      <text x="158" y="112" fontSize="50" fontWeight="700" fill={textFill}>
        Source
        <tspan fill="#FF9900">Goods</tspan>
      </text>
    </svg>
  );
}
