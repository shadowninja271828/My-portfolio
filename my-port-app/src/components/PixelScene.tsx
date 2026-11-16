// Original pixel-art desk scene, inline SVG on a 32x24 grid. Swap/remove via content.heroVisual.
const P = (x: number, y: number, w: number, h: number, fill: string, cls?: string) => (
  <rect key={`${x}-${y}-${w}-${h}-${fill}`} x={x} y={y} width={w} height={h} fill={fill} className={cls} />
)

export function PixelScene() {
  return (
    <svg viewBox="0 0 32 24" shapeRendering="crispEdges" role="img" aria-label="Pixel art desk with a laptop, lamp, plant and moonlit window" className="w-full [image-rendering:pixelated]">
      {P(0, 0, 32, 24, '#1c1b1a')}
      {/* window */}
      {P(2, 2, 11, 10, '#2a2928')}
      {P(3, 3, 9, 8, '#0e0d0c')}
      {P(7, 3, 1, 8, '#2a2928')}
      {P(3, 7, 9, 1, '#2a2928')}
      {/* moon + stars */}
      {P(9, 4, 2, 2, '#c6ff3d')}
      {P(10, 4, 1, 1, '#0e0d0c')}
      {P(4, 4, 1, 1, '#ffffff', 'twinkle')}
      {P(5, 9, 1, 1, '#ffffff', 'twinkle')}
      {/* lamp */}
      <g className="flicker">
        {P(25, 7, 4, 2, '#f4693a')}
        {P(24, 9, 6, 1, '#ffb08f')}
      </g>
      {P(26, 9, 1, 6, '#8b8a88')}
      {P(25, 15, 3, 1, '#8b8a88')}
      {/* desk */}
      {P(0, 17, 32, 2, '#f4693a')}
      {P(2, 19, 2, 5, '#2a2928')}
      {P(28, 19, 2, 5, '#2a2928')}
      {/* laptop */}
      {P(10, 11, 12, 6, '#2a2928')}
      {P(11, 12, 10, 4, '#0e0d0c')}
      {P(8, 17, 16, 1, '#8b8a88')}
      {/* react-style atom */}
      {P(15, 13, 2, 2, '#c6ff3d')}
      {P(13, 14, 6, 1, '#c6ff3d')}
      {P(14, 13, 1, 2, '#c6ff3d')}
      {P(17, 13, 1, 2, '#c6ff3d')}
      {/* blinking cursor on screen */}
      {P(19, 15, 1, 1, '#ffffff', 'cursor-blink')}
      {/* plant */}
      {P(4, 14, 4, 3, '#8b8a88')}
      {P(5, 10, 1, 4, '#c6ff3d')}
      {P(4, 11, 1, 2, '#c6ff3d')}
      {P(6, 11, 1, 2, '#c6ff3d')}
    </svg>
  )
}
