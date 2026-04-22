import { motion } from 'framer-motion'
import { Sparkles, Heart, Footprints, HelpCircle } from 'lucide-react'

interface PaywallCardProps {
  unlockCode: string
  setUnlockCode: (code: string) => void
  handleVerify: () => void
  isVerifying: boolean
  themeBg: string
}

export const PaywallCard = ({ unlockCode, setUnlockCode, handleVerify, isVerifying, themeBg }: PaywallCardProps) => {
  return (
    <motion.div 
      key="pay" 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0 }} 
      className="bg-white/90 p-8 rounded-[2.5rem] shadow-xl text-center border-2 border-primary/5 relative overflow-hidden"
    >
      <div className="mb-6">
        <h3 className="text-2xl font-normal text-chocolate mb-1 font-alimama">开启它的灵魂私语</h3>
        <p className="text-chocolate/20 text-xs md:text-sm font-bold font-fredoka uppercase tracking-[0.2em]">They speak. But we listen.</p>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-8">
        <div className="bg-primary/5 p-3 rounded-2xl flex flex-col items-center gap-2 border border-primary/5">
          <div className="text-primary bg-white p-2 rounded-xl shadow-sm"><Sparkles size={18} /></div>
          <span className="text-[10px] md:text-xs text-chocolate/60 font-genjyuu leading-tight">第 5 维度<br/>深度解码</span>
        </div>
        <div className="bg-primary/5 p-3 rounded-2xl flex flex-col items-center gap-2 border border-primary/5">
          <div className="text-primary bg-white p-2 rounded-xl shadow-sm"><Heart size={18} /></div>
          <span className="text-[10px] md:text-xs text-chocolate/60 font-genjyuu leading-tight">主宠契合<br/>灵魂报告</span>
        </div>
        <div className="bg-primary/5 p-3 rounded-2xl flex flex-col items-center gap-2 border border-primary/5">
          <div className="text-primary bg-white p-2 rounded-xl shadow-sm"><Footprints size={18} /></div>
          <span className="text-[10px] md:text-xs text-chocolate/60 font-genjyuu leading-tight">4道深度<br/>测评加题</span>
        </div>
      </div>

      <div className="space-y-4">
        <input 
          type="text" 
          value={unlockCode} 
          onChange={e => setUnlockCode(e.target.value)} 
          placeholder="输入魔法口令" 
          className="w-full bg-primary/5 rounded-2xl py-4 text-center text-xl font-bold text-primary focus:border-primary outline-none transition-all font-fredoka tracking-widest border-2 border-transparent" 
        />
        <button 
          onClick={handleVerify} 
          disabled={isVerifying} 
          className={`w-full ${themeBg} text-white py-4 rounded-2xl font-alimama text-lg shadow-lg hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50`}
        >
          {isVerifying ? '正在召唤能量...' : '立即开启'}
        </button>
      </div>
      
      <button className="mt-4 flex items-center justify-center gap-1.5 text-chocolate/30 text-sm mx-auto hover:text-primary transition-colors font-genjyuu">
        <HelpCircle size={14} /> 如何获取口令？
      </button>
    </motion.div>
  )
}
