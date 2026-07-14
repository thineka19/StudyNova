const COLORS = [
  'bg-primary', 'bg-secondary', 'bg-success', 'bg-warning', 'bg-danger', 'bg-primary-hover',
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase();
}

function colorFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return COLORS[hash % COLORS.length]!;
}

const sizeClass: Record<'sm' | 'md' | 'lg' | 'xl', string> = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-16 text-lg',
  xl: 'size-24 text-2xl',
};

export default function Avatar({
  name,
  src,
  size = 'md',
  className = '',
}: {
  name: string;
  src?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClass[size]} shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }
  return (
    <div
      className={`flex ${sizeClass[size]} shrink-0 items-center justify-center rounded-full font-semibold text-white ${colorFor(name)} ${className}`}
    >
      {initials(name)}
    </div>
  );
}
