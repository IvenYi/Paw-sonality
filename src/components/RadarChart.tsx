import { motion } from 'framer-motion'
import { Scores } from '../App'

interface RadarChartProps {
  scores: Scores
  size?: number
  isUnlocked?: boolean
  petType?: 'dog' | 'cat'
  isPoster?: boolean // 新增：是否为海报渲染模式
}

const RadarChart = ({ scores, size = 300, isUnlocked = false, petType = 'dog', isPoster = false }: RadarChartProps) => {
  const center = size / 2
  
  // 【核心修复】：仅针对付费版海报 (isPoster && isUnlocked) 使用 0.55 半径比例，其他场景维持 0.62
  const radiusScale = (isPoster && isUnlocked) ? 0.55 : 0.62;
  const radius = (size / 2) * radiusScale

  const calculateDim = (valA: number, valB: number) => {
    const total = (valA || 0) + (valB || 0) || 10
    const ratio = (valA || 5) / total
    return 30 + ratio * 70 
  }

  const labels4 = ['能量', '感知', '判断', '生活']
  const values4 = [
    calculateDim(scores.E, scores.I),
    calculateDim(scores.S, scores.N),
    calculateDim(scores.T, scores.F),
    calculateDim(scores.J, scores.P),
  ]

  const labels5 = [...labels4, '灵魂韧性']
  const values5 = [...values4, calculateDim(scores.A, scores.T_)]

  const labels = isUnlocked ? labels5 : labels4
  const values = isUnlocked ? values5 : values4
  const totalAxes = labels.length

  const getCoordinates = (value: number, index: number, extraOffset = 0) => {
    const angle = (Math.PI * 2 * index) / totalAxes - Math.PI / 2
    const distance = (value / 100) * radius + extraOffset
    return {
      x: center + Math.cos(angle) * distance,
      y: center + Math.sin(angle) * distance,
      angle: angle
    }
  }

  const points = values.map((v, i) => getCoordinates(v, i))
  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
  const accentColor = petType === 'dog' ? '#EF5A3D' : '#FF6B9D'

  const getTextAnchor = (angle: number) => {
    const cos = Math.cos(angle)
    if (Math.abs(cos) < 0.1) return 'middle'
    return cos > 0 ? 'start' : 'end'
  }

  const getDominantBaseline = (angle: number) => {
    const sin = Math.sin(angle)
    if (Math.abs(sin) < 0.1) return 'middle'
    return sin > 0 ? 'hanging' : 'auto'
  }

  const labelFontSize = Math.max(13, (size / 300) * 13.5)
  const legendLabelSize = Math.max(11, (size / 300) * 11)
  const legendValueSize = Math.max(12, (size / 300) * 12)
  const barHeight = Math.max(6, (size / 300) * 6)

  return (
    <div className="relative flex flex-col items-center w-full">
      {isUnlocked && (
        <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full pointer-events-none opacity-50" />
      )}

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible relative z-10">
        <defs>
          <radialGradient id="radarGradient">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.1" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0.4" />
          </radialGradient>
        </defs>

        {/* 背景网格线 */}
        {[0.25, 0.5, 0.75, 1].map((r, i) => {
          const gridPoints = Array.from({ length: totalAxes }).map((_, j) => {
            const p = getCoordinates(r * 100, j)
            return `${p.x},${p.y}`
          }).join(' ')
          
          return isPoster ? (
            <polygon key={`grid-${i}`} points={gridPoints} fill="none" stroke="currentColor" className="text-chocolate/5" strokeWidth="1" />
          ) : (
            <motion.polygon key={`grid-${i}`} animate={{ points: gridPoints }} fill="none" stroke="currentColor" className="text-chocolate/5" strokeWidth="1" />
          )
        })}

        {/* 轴线 */}
        {labels.map((_, i) => {
          const p = getCoordinates(100, i)
          return isPoster ? (
            <line key={`axis-${i}`} x1={center} y1={center} x2={p.x} y2={p.y} stroke="currentColor" className="text-chocolate/10" strokeWidth="1" strokeDasharray="4 4" />
          ) : (
            <motion.line key={`axis-${i}`} animate={{ x1: center, y1: center, x2: p.x, y2: p.y }} stroke="currentColor" className="text-chocolate/10" strokeWidth="1" strokeDasharray="4 4" />
          )
        })}

        {/* 数据区域 */}
        {isPoster ? (
          <path d={pathData} fill={`${accentColor}33`} stroke={accentColor} strokeWidth={Math.max(2, (size/300)*3)} strokeLinejoin="round" />
        ) : (
          <motion.path animate={{ d: pathData }} fill="url(#radarGradient)" stroke={accentColor} strokeWidth={Math.max(2, (size/300)*3)} strokeLinejoin="round" />
        )}

        {/* 轴标签 */}
        {labels.map((label, i) => {
          const p = getCoordinates(100, i, Math.max(12, (size/300)*18))
          return isPoster ? (
            <text
              key={`label-${label}-${totalAxes}`}
              x={p.x} y={p.y}
              textAnchor={getTextAnchor(p.angle)}
              dominantBaseline={getDominantBaseline(p.angle)}
              className="fill-chocolate/60 font-alimama font-bold tracking-tight"
              style={{ fontSize: `${labelFontSize}px` }}
            >
              {label}
            </text>
          ) : (
            <motion.text
              key={`label-${label}-${totalAxes}`}
              animate={{ x: p.x, y: p.y }}
              textAnchor={getTextAnchor(p.angle)}
              dominantBaseline={getDominantBaseline(p.angle)}
              className="fill-chocolate/70 font-alimama font-bold tracking-wide"
              style={{ fontSize: `${labelFontSize}px` }}
            >
              {label}
            </motion.text>
          )
        })}
      </svg>

      {/* 底部图例 */}
      <div className={`grid grid-cols-2 gap-x-8 gap-y-4 w-full mt-10 px-4`} style={{ maxWidth: `${size * 1.2}px` }}>
        {labels.map((label, i) => (
          <div key={`legend-${i}`} className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center font-alimama">
              <span className="text-chocolate/40 tracking-wider" style={{ fontSize: `${legendLabelSize}px` }}>{label}</span>
              <span className="text-chocolate/60 font-fredoka font-bold" style={{ fontSize: `${legendValueSize}px` }}>{Math.round(values[i])}%</span>
            </div>
            <div className="w-full bg-primary/10 rounded-full overflow-hidden" style={{ height: `${barHeight}px` }}>
               {isPoster ? (
                 <div className="h-full rounded-full" style={{ width: `${values[i]}%`, backgroundColor: `${accentColor}88` }} />
               ) : (
                 <motion.div
                   initial={{ width: 0 }}
                   animate={{ width: `${values[i]}%` }}
                   className="h-full rounded-full"
                   style={{ backgroundColor: `${accentColor}66` }}
                 />
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RadarChart
