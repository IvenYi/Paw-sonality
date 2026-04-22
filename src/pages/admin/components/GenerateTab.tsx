import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Ticket } from 'lucide-react'
import { getBatchStats, generateCodes } from '../../../api/verification'

export const GenerateTab = () => {
  const defaultBatchId = `batch_${new Date().toISOString().split('T')[0].replace(/-/g, '')}`
  const [batchId, setBatchId] = useState(defaultBatchId)
  const [count, setCount] = useState(50)
  const [isGenerating, setIsGenerating] = useState(false)
  const [batchStats, setBatchStats] = useState<any[]>([])

  const loadBatchStats = async () => {
    setBatchStats(await getBatchStats())
  }

  useEffect(() => {
    loadBatchStats()
  }, [])

  const handleGenerate = async () => {
    setIsGenerating(true)
    const res = await generateCodes(count, batchId)
    if (res.success) {
      alert(`成功生成 ${count} 个口令！`)
      loadBatchStats()
    } else {
      alert('生成失败，请检查数据库配置')
    }
    setIsGenerating(false)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <h2 className="text-3xl font-alimama text-chocolate mb-8 flex items-center gap-3"><Ticket className="text-primary"/> 批量发卡中心</h2>
      
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-primary/5 mb-8">
        <div className="flex flex-wrap gap-6 items-end">
          <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
            <label className="text-sm font-alimama text-chocolate/60 pl-2">生成数量</label>
            <input type="number" value={count} onChange={e => setCount(Number(e.target.value))} className="bg-primary/5 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 py-4 outline-none transition-all text-xl text-chocolate font-fredoka" />
          </div>
          <div className="flex flex-col gap-2 flex-[2] min-w-[250px]">
            <label className="text-sm font-alimama text-chocolate/60 pl-2">批次号 (Batch ID)</label>
            <input type="text" value={batchId} onChange={e => setBatchId(e.target.value)} className="bg-primary/5 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 py-4 outline-none transition-all text-xl text-chocolate font-mono" />
          </div>
          <button onClick={handleGenerate} disabled={isGenerating} className="bg-primary text-white h-[64px] px-10 rounded-2xl font-alimama text-lg shadow-lg hover:-translate-y-1 transition-all disabled:opacity-50">
            {isGenerating ? '生成中...' : '立即生成口令'}
          </button>
        </div>
      </div>

      <h3 className="text-xl font-alimama text-chocolate mb-4 px-2">历史批次追踪</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batchStats.map(b => (
          <div key={b.batchId} className="bg-white p-6 rounded-[2rem] border border-primary/5 shadow-sm">
            <div className="text-sm text-chocolate/50 font-mono mb-4">{b.batchId}</div>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-3xl font-black font-fredoka text-primary">{b.used} <span className="text-lg text-chocolate/30">/ {b.total}</span></div>
                <div className="text-sm text-chocolate/50 font-alimama mt-1">已核销</div>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-primary/10 flex items-center justify-center font-fredoka font-bold text-chocolate">
                {Math.round((b.used / (b.total || 1)) * 100)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
