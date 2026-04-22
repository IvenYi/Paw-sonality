import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { LayoutDashboard, PieChart, Users, Ticket, LogOut, Sparkles } from 'lucide-react'

import { LoginWall } from './admin/components/LoginWall'
import { DashboardTab } from './admin/components/DashboardTab'
import { InsightsTab } from './admin/components/InsightsTab'
import { ServiceTab } from './admin/components/ServiceTab'
import { GenerateTab } from './admin/components/GenerateTab'

const AdminPage = () => {
  const [isLogged, setIsLogged] = useState(false)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'insights' | 'service' | 'generate'>('dashboard')

  if (!isLogged) {
    return <LoginWall onLogin={() => setIsLogged(true)} />
  }

  const tabClass = (tab: string) => `flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-alimama text-lg ${activeTab === tab ? 'bg-primary text-white shadow-md' : 'text-chocolate/50 hover:bg-white hover:text-chocolate'}`

  return (
    <div className="min-h-screen bg-[#FFFCF9] flex font-genjyuu">
      {/* 侧边栏 */}
      <div className="w-64 bg-white/60 backdrop-blur-xl border-r border-primary/5 flex flex-col p-6 shadow-sm z-20 relative">
        <div className="flex items-center gap-3 mb-12 mt-4 px-2">
          <div className="bg-primary text-white p-2 rounded-xl"><Sparkles size={20} /></div>
          <h1 className="text-xl text-chocolate font-black font-fredoka tracking-widest">PAW-ADMIN</h1>
        </div>

        <nav className="flex flex-col gap-3 flex-1">
          <button onClick={() => setActiveTab('dashboard')} className={tabClass('dashboard')}><LayoutDashboard size={20} /> 转化概览</button>
          <button onClick={() => setActiveTab('insights')} className={tabClass('insights')}><PieChart size={20} /> 引流大盘</button>
          <button onClick={() => setActiveTab('service')} className={tabClass('service')}><Users size={20} /> 订单客服</button>
          <button onClick={() => setActiveTab('generate')} className={tabClass('generate')}><Ticket size={20} /> 发卡中心</button>
        </nav>

        <button onClick={() => window.location.reload()} className="mt-auto flex items-center gap-3 px-6 py-4 text-chocolate/40 hover:text-primary transition-colors font-alimama">
          <LogOut size={20} /> 退出系统
        </button>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 p-10 overflow-y-auto relative">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && <DashboardTab key="dashboard" />}
            {activeTab === 'insights' && <InsightsTab key="insights" />}
            {activeTab === 'service' && <ServiceTab key="service" />}
            {activeTab === 'generate' && <GenerateTab key="generate" />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
