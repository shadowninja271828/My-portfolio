// 12x10 pixel-art crown drawn as SVG rects. Original artwork.
const ROWS = [
  '..X......X..',
  '..XX....XX..',
  'X.XX.XX.XX.X',
  'XXXXXXXXXXXX',
  'XXXXXXXXXXXX',
  'XXXXXXXXXXXX',
  '.XXXXXXXXXX.',
  '.XXXXXXXXXX.',
  '.XX.XXXX.XX.',
  '............',
]

export function PixelCrown({ size = 24, color = 'var(--lime)', className }: { size?: number; color?: string; className?: string }) {
  return (
    <svg
      width={size}
      height={(size * 10) / 12}
      viewBox="0 0 12 10"
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={className}
      fill={color}
    >
      {ROWS.flatMap((row, y) =>
        [...row].map((c, x) => (c === 'X' ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" /> : null)),
      )}
    </svg>
  )
}
