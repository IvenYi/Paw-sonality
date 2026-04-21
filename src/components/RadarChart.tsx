import { motion, AnimatePresence } from 'framer-motion'
import { Scores } from '../App'

interface RadarChartProps {
  scores: Scores
  size?: number
  isUnlocked?: boolean // 这个解锁指的是是否展示 5 轴
  petType?: 'dog' | 'cat'
}

const RadarChart = ({ scores, size = 300, isUnlocked = false, petType = 'dog' }: RadarChartProps) => {
  const center = size / 2
  const radius = (size / 2) * 0.7

  // 计算维度的百分比逻辑
  const calculateDim = (valA: number, valB: number) => {
    const total = (valA || 0) + (valB || 0) || 10
    const ratio = (valA || 5) / total
    return 30 + ratio * 70 
  }

  // 基础 4 维度
  const labels4 = ['能量', '感知', '判断', '生活']
  const values4 = [
    calculateDim(scores.E, scores.I),
    calculateDim(scores.S, scores.N),
    calculateDim(scores.T, scores.F),
    calculateDim(scores.J, scores.P),
  ]

  // 第 5 维度 (付费解锁后显示)
  const labels5 = [...labels4, '情绪张力']
  const values5 = [...values4, calculateDim(scores.T_, scores.A)]

  const labels = isUnlocked ? labels5 : labels4
  const values = isUnlocked ? values5 : values4
  const totalAxes = labels.length

  // 获取坐标函数：角度会根据 totalAxes 动态计算
  const getCoordinates = (value: number, index: number) => {
    // 4轴是 90度，5轴是 72度
    const angle = (Math.PI * 2 * index) / totalAxes - Math.PI / 2
    const distance = (value / 100) * radius
    return {
      x: center + Math.cos(angle) * distance,
      y: center + Math.sin(angle) * distance,
    }
  }

  const points = values.map((v, i) => getCoordinates(v, i))
  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'

  const accentColor = petType === 'dog' ? '#EF5A3D' : '#FF6B9D'

  return (
    <div className="relative flex flex-col items-center">
      {/* 解锁后的能量光晕 */}
      {isUnlocked && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1.1 }}
          className="absolute inset-0 bg-primary/5 blur-3xl rounded-full pointer-events-none"
        />
      )}

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible relative z-10">
        <defs>
          <radialGradient id="radarGradient">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.1" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0.4" />
          </radialGradient>
        </defs>

        {/* 背景网格线 - 使用 polygon 实现形变 */}
        {[0.25, 0.5, 0.75, 1].map((r, i) => {
          const gridPoints = Array.from({ length: totalAxes }).map((_, j) => {
            const p = getCoordinates(r * 100, j)
            return `${p.x},${p.y}`
          }).join(' ')
          
          return (
            <motion.polygon
              key={`grid-${i}`}
              animate={{ points: gridPoints }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              fill="none"
              stroke="currentColor"
              className="text-chocolate/5"
              strokeWidth="1"
            />
          )
        })}

        {/* 轴线 */}
        {labels.map((_, i) => {
          const p = getCoordinates(100, i)
          return (
            <motion.line
              key={`axis-${i}`}
              animate={{ x1: center, y1: center, x2: p.x, y2: p.y }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              stroke="currentColor"
              className="text-chocolate/10"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          )
        })}

        {/* 数据区域 */}
        <motion.path
          animate={{ d: pathData }}
          transition={{ duration: 0.8, ease: "backOut" }}
          fill="url(#radarGradient)"
          stroke={accentColor}
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* 数据点 */}
        {points.map((p, i) => (
          <motion.circle
            key={`point-${i}-${totalAxes}`} // 加入 totalAxes 确保重新渲染
            animate={{ cx: p.x, cy: p.y }}
            transition={{ duration: 0.8, ease: "backOut" }}
            r="4"
            fill="white"
            stroke={accentColor}
            strokeWidth="2"
          />
        ))}

        {/* 标签 */}
        {labels.map((label, i) => {
          const p = getCoordinates(120, i)
          return (
            <motion.text
              key={`label-${label}-${totalAxes}`}
              animate={{ x: p.x, y: p.y }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-chocolate/60 text-[12px] font-alimama font-normal tracking-wider"
            >
              {label}
            </motion.text>
          )
        })}
      </svg>

      {/* 底部详情指示条 */}
      <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-4 px-4 w-full">
        {labels.map((label, i) => (
          <motion.div 
            key={`detail-${label}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <span className="text-[10px] text-chocolate/30 font-fredoka uppercase tracking-widest">{label}</span>
            <div className="h-1.5 w-16 bg-chocolate/5 rounded-full mt-1 overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${values[i]}%` }}
                 className="h-full bg-primary/40 rounded-full"
               />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default RadarChart
