import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Heart, Footprints, HelpCircle, Copy, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

interface PaywallCardProps {
  unlockCode: string
  setUnlockCode: (code: string) => void
  handleVerify: () => void
  isVerifying: boolean
  themeBg: string
}

export const PaywallCard = ({ unlockCode, setUnlockCode, handleVerify, isVerifying, themeBg }: PaywallCardProps) => {
  const [showTip, setShowTip] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText('Paw-sonality');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败', err);
    }
  };

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
      
      <button 
        onClick={() => setShowTip(!showTip)} 
        className="mt-4 flex items-center justify-center gap-1.5 text-chocolate/30 text-sm mx-auto hover:text-primary transition-colors font-genjyuu"
      >
        <HelpCircle size={14} /> 如何获取口令？
      </button>

      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-primary/5 rounded-2xl p-4 md:p-5 text-left border border-primary/10 flex flex-col gap-4">
              {/* 方式一：店铺转化 */}
              <div>
                <h4 className="text-primary font-bold text-sm mb-1.5 flex items-center gap-1.5">
                  <span className="bg-primary/10 px-1.5 py-0.5 rounded text-[10px] tracking-wider">方式一</span> 
                  ⚡️ 快速获取口令
                </h4>
                <p className="text-chocolate/70 text-xs font-genjyuu leading-relaxed">
                  前往小红书关注 <strong className="text-primary font-bold">@Paw-sonality</strong>，进入主页<strong className="text-primary font-bold">店铺</strong>即可直接带走【魔法口令】，支持一下深夜秃头的主理人吧 🥺
                </p>
              </div>

              <div className="h-px w-full border-t border-dashed border-primary/15"></div>

              {/* 方式二：裂变传播 */}
              <div>
                <h4 className="text-primary font-bold text-sm mb-1.5 flex items-center gap-1.5">
                  <span className="bg-primary/10 px-1.5 py-0.5 rounded text-[10px] tracking-wider">方式二</span> 
                  🎁 动动发财小手
                </h4>
                <p className="text-chocolate/70 text-xs font-genjyuu leading-relaxed">
                  分享海报，在小红书发布测试结果并 <strong className="text-primary font-bold">@Paw-sonality</strong>。带上笔记截图私信，客服人工掉落免费口令！✨
                </p>
              </div>

              <button 
                onClick={copyToClipboard}
                className="mt-1 flex items-center justify-center w-full gap-1.5 text-xs md:text-sm font-bold font-genjyuu text-primary bg-white/80 hover:bg-white transition-colors px-4 py-2.5 rounded-xl shadow-sm border border-primary/10 active:scale-[0.98]"
              >
                {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                {copied ? '已复制账号，快去打开小红书吧' : '一键复制小红书账号'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
