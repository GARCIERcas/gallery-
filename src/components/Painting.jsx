// Generative abstract paintings rendered as SVG.
const W = 100

function Fields({ h, p, uid }) {
  const [bg, a, b, c] = p
  return (
    <>
      <rect width={W} height={h} fill={c} />
      <g filter={`url(#soft-${uid})`}>
        <rect x="8" y={h * 0.07} width="84" height={h * 0.36} fill={a} />
        <rect x="8" y={h * 0.47} width="84" height={h * 0.18} fill={b} />
        <rect x="8" y={h * 0.69} width="84" height={h * 0.24} fill={bg} opacity="0.85" />
      </g>
    </>
  )
}

function Circle({ h, p }) {
  const [bg, a, c] = p
  const r = Math.min(W, h) * 0.26
  return (
    <>
      <rect width={W} height={h} fill={bg} />
      <circle cx={W * 0.5} cy={h * 0.4} r={r} fill={a} />
      <rect x="0" y={h * 0.72} width={W} height={h * 0.28} fill={c} opacity="0.92" />
      <line x1="14" y1={h * 0.72} x2="86" y2={h * 0.72} stroke={bg} strokeWidth="0.3" opacity="0.5" />
    </>
  )
}

function Horizon({ h, p }) {
  const [sky, mid, deep, light] = p
  return (
    <>
      <rect width={W} height={h} fill={sky} />
      <rect y={h * 0.55} width={W} height={h * 0.45} fill={mid} />
      <rect y={h * 0.78} width={W} height={h * 0.22} fill={deep} />
      <circle cx={W * 0.7} cy={h * 0.34} r={Math.min(W, h) * 0.09} fill={light} />
    </>
  )
}

function Lines({ h, p }) {
  const [bg, ink] = p
  const rows = 22
  const lines = Array.from({ length: rows }, (_, i) => {
    const y = h * 0.12 + (h * 0.76 * i) / (rows - 1)
    const len = 40 + 40 * Math.abs(Math.sin(i * 0.55))
    const x = (W - len) / 2
    return <line key={i} x1={x} y1={y} x2={x + len} y2={y} stroke={ink} strokeWidth={0.35 + (i % 4 === 0 ? 0.35 : 0)} strokeLinecap="round" />
  })
  return (
    <>
      <rect width={W} height={h} fill={bg} />
      {lines}
    </>
  )
}

function Arcs({ h, p }) {
  const [bg, c1, c2, c3, ink] = p
  const s = W / 3
  const top = (h - s * 3) / 2
  const cell = (col, row, color, rot) => {
    const x = col * s, y = top + row * s
    return (
      <path
        key={`${col}${row}`}
        d={`M ${x} ${y + s} A ${s} ${s} 0 0 1 ${x + s} ${y} L ${x + s} ${y + s} Z`}
        fill={color}
        transform={`rotate(${rot} ${x + s / 2} ${y + s / 2})`}
      />
    )
  }
  return (
    <>
      <rect width={W} height={h} fill={bg} />
      {cell(0, 0, c1, 0)}
      {cell(1, 0, c3, 90)}
      {cell(2, 1, c2, 180)}
      {cell(0, 2, ink, 270)}
      {cell(1, 1, c1, 180)}
      {cell(2, 2, c3, 0)}
      <circle cx={s * 2.5} cy={top + s * 0.5} r={s * 0.22} fill={ink} />
      <circle cx={s * 1.5} cy={top + s * 2.5} r={s * 0.3} fill={c2} />
    </>
  )
}

function Blocks({ h, p }) {
  const [bg, ink, grey, accent] = p
  return (
    <>
      <rect width={W} height={h} fill={bg} />
      <rect x="14" y={h * 0.12} width="30" height={h * 0.5} fill={grey} />
      <rect x="50" y={h * 0.22} width="36" height={h * 0.18} fill={ink} />
      <rect x="50" y={h * 0.46} width="16" height={h * 0.42} fill={accent} />
      <rect x="14" y={h * 0.68} width="30" height={h * 0.2} fill={ink} />
      <rect x="72" y={h * 0.46} width="14" height={h * 0.42} fill={grey} opacity="0.6" />
    </>
  )
}

const styles = { fields: Fields, circle: Circle, horizon: Horizon, lines: Lines, arcs: Arcs, blocks: Blocks }

export default function Painting({ art, className }) {
  const h = W * art.ratio
  const Comp = styles[art.style] || Fields
  const uid = art.id
  return (
    <svg
      className={className}
      viewBox={`0 0 ${W} ${h}`}
      style={{ '--r': art.ratio }}
      role="img"
      aria-label={art.title}
    >
      <defs>
        <filter id={`soft-${uid}`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="0.9" />
        </filter>
        <filter id={`grain-${uid}`}>
          <feTurbulence type="fractalNoise" baseFrequency="1.8" numOctaves="2" seed={uid.length} />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.09 0" />
        </filter>
      </defs>
      <Comp h={h} p={art.palette} uid={uid} />
      <rect width={W} height={h} filter={`url(#grain-${uid})`} />
    </svg>
  )
}
