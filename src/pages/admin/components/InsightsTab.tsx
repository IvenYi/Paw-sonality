import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Dog, Cat } from 'lucide-react'
import { getMarketingInsights } from '../../../api/verification'

export const InsightsTab = () => {
  const [insights, setInsights] = useState({ petTypes: { dog: 0, cat: 0 }, topMbtis: [] as any[] })

  useEffect(() => {
    getMarketingInsights().then(setInsights)
  }, [])

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <h2 className="text-3xl font-alimama text-chocolate mb-8 flex items-center gap-3"><PieChart className="text-primary"/> 引流素材大盘</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-primary/5">
          <h3 className="text-xl font-alimama text-chocolate mb-6">全网猫狗阵营比</h3>
          <div className="flex items-center justify-between mb-4 px-4">
            <div className="flex items-center gap-2 text-accent-yellow font-alimama text-lg"><Dog /> 狗狗 {insights.petTypes.dog}只</div>
            <div className="flex items-center gap-2 text-accent-pink font-alimama text-lg">{insights.petTypes.cat}只 猫咪 <Cat /></div>
          </div>
          <div className="h-12 w-full rounded-2xl overflow-hidden flex shadow-inner">
            <div className="bg-accent-yellow h-full flex items-center px-4 text-white font-fredoka font-bold" style={{ width: `${insights.petTypes.dog / ((insights.petTypes.dog + insights.petTypes.cat)||1) * 100}%` }}>
              {Math.round(insights.petTypes.dog / ((insights.petTypes.dog + insights.petTypes.cat)||1) * 100)}%
            </div>
            <div className="bg-accent-pink h-full flex items-center justify-end px-4 text-white font-fredoka font-bold" style={{ width: `${insights.petTypes.cat / ((insights.petTypes.dog + insights.petTypes.cat)||1) * 100}%` }}>
              {Math.round(insights.petTypes.cat / ((insights.petTypes.dog + insights.petTypes.cat)||1) * 100)}%
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-primary/5">
          <h3 className="text-xl font-alimama text-chocolate mb-6">TOP 5 爆款宠格</h3>
          <div className="space-y-4">
            {insights.topMbtis.length === 0 ? (
              <div className="text-chocolate/30 text-center py-8">暂无足够数据</div>
            ) : insights.topMbtis.map((item, i) => (
              <div key={item.mbti} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-fredoka font-bold ${i===0?'bg-[#FFD93D] text-white':i===1?'bg-slate-200 text-slate-500':i===2?'bg-orange-200 text-orange-600':'bg-primary/5 text-primary'}`}>
                  {i+1}
                </div>
                <div className="flex-1 bg-primary/5 h-10 rounded-xl overflow-hidden relative flex items-center">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${(item.count / insights.topMbtis[0].count) * 100}%` }} 
                    className="absolute left-0 top-0 h-full bg-primary/20"
                  />
                  <span className="relative z-10 ml-4 font-fredoka font-bold text-chocolate tracking-widest">{item.mbti}</span>
                </div>
                <div className="w-12 text-right font-fredoka text-chocolate/50">{item.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
