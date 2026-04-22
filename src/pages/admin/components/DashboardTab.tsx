import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LayoutDashboard, Ticket, CheckCircle2, TrendingUp } from 'lucide-react'
import { getDashboardStats } from '../../../api/verification'

export const DashboardTab = () => {
  const [stats, setStats] = useState({ total: 0, used: 0, todayUsed: 0 })

  useEffect(() => {
    getDashboardStats().then(setStats)
  }, [])

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <h2 className="text-3xl font-alimama text-chocolate mb-8 flex items-center gap-3"><LayoutDashboard className="text-primary"/> 转化概览</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-primary/5 flex flex-col relative overflow-hidden">
          <div className="absolute -right-6 -top-6 text-primary/5"><Ticket size={120} /></div>
          <span className="text-chocolate/50 font-alimama mb-2">累计发行口令</span>
          <span className="text-5xl font-black text-chocolate font-fredoka">{stats.total}</span>
        </div>
        <div className="bg-primary text-white p-8 rounded-[2.5rem] shadow-lg shadow-primary/20 flex flex-col relative overflow-hidden">
          <div className="absolute -right-6 -top-6 text-white/10"><CheckCircle2 size={120} /></div>
          <span className="text-white/80 font-alimama mb-2">已成功核销</span>
          <span className="text-5xl font-black font-fredoka">{stats.used}</span>
          <div className="mt-4 bg-white/20 h-2 rounded-full overflow-hidden">
            <div className="bg-white h-full" style={{ width: `${stats.total ? (stats.used/stats.total)*100 : 0}%` }} />
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-primary/5 flex flex-col relative overflow-hidden">
          <div className="absolute -right-6 -top-6 text-accent-yellow/10"><TrendingUp size={120} /></div>
          <span className="text-chocolate/50 font-alimama mb-2">今日新增核销</span>
          <span className="text-5xl font-black text-accent-yellow font-fredoka">+{stats.todayUsed}</span>
        </div>
      </div>
    </motion.div>
  )
}
