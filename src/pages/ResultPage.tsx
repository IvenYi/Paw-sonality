import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Heart, Quote, Share2, Sparkles, User, Trophy, RefreshCw, HelpCircle, Trash2, Footprints, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import html2canvas from 'html2canvas'
import { Scores } from '../App'
import RadarChart from '../components/RadarChart'
import { dogDeepQuestions, catDeepQuestions } from './QuizPage'
import { dogResults, catResults } from '../data/mbtiResults'
import { SOUL_RESILIENCE_CONTENT, getRelationshipLabel, getDeepSyncAnalysis, getLetterToOwner } from '../data/analysisContent'
import { verifyRedemptionCode, updateFinalResult } from '../api/verification'

type ResultStage = 'BASIC' | 'SELECT_OWNER' | 'DEEP_QUIZ' | 'FINAL'

interface ResultPageProps {
  result: string
  scores: Scores
  petType: 'dog' | 'cat'
  onReset: () => void
}

const mbtiTypes = ['ENFP', 'ENTP', 'INFP', 'INTP', 'ENFJ', 'ENTJ', 'INFJ', 'INTJ', 'ESFP', 'ESTP', 'ISFP', 'ISTP', 'ESFJ', 'ESTJ', 'ISFJ', 'ISTJ']

const ResultPage = ({ result, scores: propScores, petType, onReset }: ResultPageProps) => {
  const [stage, setStage] = useState<ResultStage>('BASIC')
  const [, setIsUnlocked] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [unlockCode, setUnlockCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [ownerMBTI, setOwnerMBTI] = useState('')
  const [deepQuizStep, setDeepQuizStep] = useState(0)
  const [deepScores, setDeepScores] = useState({ T_: 0, A: 0 })
  const [deepAnswers, setDeepAnswers] = useState<(number | null)[]>([])
  const [finalScores, setFinalScores] = useState<Scores>(propScores)
  const [currentCard, setCurrentCard] = useState(0)

  const deepQuestions = petType === 'dog' ? dogDeepQuestions : catDeepQuestions;
  const resultData = (petType === 'dog' ? dogResults[result] : catResults[result]) || dogResults['ENFP'];

  useEffect(() => {
    const saved = localStorage.getItem('paws_unlocked_session')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data && data.code) { // 只要有 code 就认为是解锁过
          setIsUnlocked(true)
          if (data.isFinished && data.finalScores) {
            setStage('FINAL'); setOwnerMBTI(data.ownerMBTI || 'ENFP'); setFinalScores(data.finalScores)
          } else { setStage('SELECT_OWNER') }
        }
      } catch (e) { localStorage.removeItem('paws_unlocked_session') }
    }
  }, [])

  const handleVerify = async () => {
    if (!unlockCode) return
    setIsVerifying(true)
    
    // 真实调用 Supabase API 校验，并录入 4 轴分析数据
    const res = await verifyRedemptionCode(unlockCode, petType, result)
    
    if (res.success) {
      localStorage.setItem('paws_unlocked_session', JSON.stringify({ code: unlockCode, isFinished: false }))
      setIsUnlocked(true)
      setStage('SELECT_OWNER')
    } else {
      alert(res.message) // '口令无效' 或 '已在其他设备使用' 等
    }
    setIsVerifying(false)
  }

  const handleDeepOptionClick = (dim: string, weight: number, index: number) => {
    const key = (dim === 'T' || dim === 'T_') ? 'T_' : 'A'
    const newAnswers = [...deepAnswers];
    newAnswers[deepQuizStep] = index;
    setDeepAnswers(newAnswers);
    const newScores = { ...deepScores, [key]: (deepScores as any)[key] + weight }
    setDeepScores(newScores)
    setTimeout(async () => {
      if (deepQuizStep + 1 < deepQuestions.length) {
        setDeepQuizStep(deepQuizStep + 1)
      } else {
        const final = { ...propScores, ...newScores }
        setFinalScores(final); setStage('FINAL')
        
        // 动态获取存储里的 code，避免硬编码 8888
        const saved = localStorage.getItem('paws_unlocked_session')
        const currentCode = saved ? JSON.parse(saved).code : unlockCode
        localStorage.setItem('paws_unlocked_session', JSON.stringify({ code: currentCode, isFinished: true, ownerMBTI, finalScores: final }))

        const currentMBTI5 = `${result}-${final.T_ > final.A ? 'T' : 'A'}`
        await updateFinalResult(currentCode, currentMBTI5, ownerMBTI)
      }
    }, 400)
  }

  const handleDeepBack = () => {
    if (deepQuizStep > 0) {
      const prevStep = deepQuizStep - 1;
      const lastIndex = deepAnswers[prevStep];
      if (lastIndex !== null) {
        const lastOpt = deepQuestions[prevStep].options[lastIndex];
        const key = (lastOpt.dimension === 'T' || lastOpt.dimension === 'T_') ? 'T_' : 'A';
        const newScores = { ...deepScores, [key]: (deepScores as any)[key] - lastOpt.weight };
        setDeepScores(newScores);
      }
      setDeepQuizStep(prevStep);
    }
  }

  const downloadPoster = async () => {
    const node = document.getElementById('share-poster');
    if (!node) return;
    try {
      setIsGenerating(true); node.style.display = 'flex';
      await new Promise(r => setTimeout(r, 600));
      const canvas = await html2canvas(node, { scale: 3, backgroundColor: '#FFFCF9', useCORS: true, logging: false });
      const link = document.createElement('a');
      link.download = `宠格解码-${result}${stage === 'FINAL' ? '-PRO' : ''}.png`;
      link.href = canvas.toDataURL('image/png'); link.click();
    } catch (err) { alert('生成失败') } finally { setIsGenerating(false); node.style.display = 'none'; }
  }

  const currentMBTI5 = stage === 'FINAL' ? `${result}-${finalScores.T_ > finalScores.A ? 'T' : 'A'}` : result
  const themeAccent = petType === 'dog' ? 'text-primary' : 'text-[#FF6B9D]'
  const themeBg = petType === 'dog' ? 'bg-primary' : 'bg-[#FF6B9D]'
  const selectedColor = petType === 'dog' ? 'bg-accent-yellow/40 border-accent-yellow shadow-md' : 'bg-accent-pink/40 border-accent-pink shadow-md'
  const activeHoverColor = petType === 'dog' ? 'hover:bg-accent-yellow/10 hover:border-accent-yellow' : 'hover:bg-accent-pink/10 hover:border-accent-pink'

  const resKey = finalScores.T_ > finalScores.A ? 'T' : 'A';
  const resilience = SOUL_RESILIENCE_CONTENT[resKey];
  const relation = getRelationshipLabel(result, ownerMBTI);
  const deepSync = getDeepSyncAnalysis(result, ownerMBTI);
  const petLetter = getLetterToOwner(petType, currentMBTI5);

  const finalCards = [
    { title: '维度揭秘', icon: <Sparkles size={20} />, content: resilience.desc, sub: resilience.title, advice: resilience.advice },
    { title: '宿命羁绊', icon: <Heart size={20} />, content: relation.desc, sub: relation.tag },
    { title: '灵魂共振', icon: <Footprints size={20} />, content: deepSync, sub: '深度契合分析' },
    { title: '它的私语', icon: <Trophy size={20} />, content: petLetter, sub: '来自毛茸茸的情书' }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col w-full min-h-screen items-center font-genjyuu relative overflow-hidden pb-20">
      
      {/* 隐藏海报层 - isPoster 分流逻辑版 */}
      <div id="share-poster" className="fixed top-[-9999px] left-0 w-[1080px] h-fit bg-[#FFFCF9] z-[-1] overflow-hidden flex flex-col items-center pt-20 pb-20 px-20" style={{ display: 'none' }}>
        <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
           <div className="absolute top-[-5%] left-[-10%] w-[1200px] h-[1200px] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #EF5A3D 0%, transparent 70%)' }} />
           <div className="absolute bottom-[10%] right-[-10%] w-[1000px] h-[1000px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #FFD93D 0%, transparent 70%)' }} />
        </div>

        <div className="flex flex-col items-center mb-16 relative z-10 w-full">
          <h1 className="text-[2.2rem] font-black tracking-[0.6em] text-chocolate/15 font-fredoka uppercase leading-none whitespace-nowrap">PAW-SONALITY</h1>
          <div className="h-1 w-20 bg-chocolate/5 rounded-full mt-6" />
        </div>

        <div className="flex flex-col items-center w-full relative z-10 flex-1">
          <h2 className="text-[2.6rem] text-chocolate/40 font-alimama tracking-[0.4em] mb-12 whitespace-nowrap">宠格深度解码报告</h2>
          
          <div className="relative flex justify-center items-center w-full mb-20 px-20">
            <span className="text-[15rem] font-black text-primary tracking-[0.05em] drop-shadow-[0_20px_40px_rgba(239,90,61,0.12)] font-fredoka leading-none relative z-10 whitespace-nowrap inline-block">
              {currentMBTI5}
            </span>
            <Heart size={80} className={`absolute top-[-15%] right-[2%] ${petType === 'dog' ? 'text-accent-yellow' : 'text-accent-pink'} opacity-60 z-20`} fill="currentColor" />
          </div>

          <p className="text-[3.2rem] font-normal text-chocolate/90 font-muyao text-center leading-none mb-16 px-10 whitespace-nowrap">{resultData.title}</p>
          
          <div className="w-full flex flex-col items-center relative z-10 mb-20">
            <div className="bg-white/40 p-20 rounded-[6rem] border border-white/60">
              {/* 【海报专属】：启用 isPoster={true}，且仅在 stage === 'FINAL' 时应用 0.55 半径缩减 */}
              <RadarChart 
                scores={stage === 'FINAL' ? finalScores : propScores} 
                size={600} 
                isUnlocked={stage === 'FINAL'} 
                petType={petType} 
                isPoster={true} 
              />
            </div>
          </div>

          <div className="w-full flex flex-col gap-12 relative z-10 mb-20 px-10">
            {stage === 'FINAL' ? (
              <>
                <div className="w-full bg-white/70 backdrop-blur-md p-16 rounded-[4.5rem] border border-white/80 shadow-sm relative overflow-hidden">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary"><Heart size={24} /></div>
                    <h4 className="text-[2.8rem] font-bold text-chocolate font-alimama">宿命羁绊：{relation.tag}</h4>
                  </div>
                  <p className="text-[2.4rem] text-chocolate/70 leading-[2] font-genjyuu text-justify">{relation.desc}</p>
                </div>

                <div className="w-full bg-white/70 backdrop-blur-md p-16 rounded-[4.5rem] border border-white/80 shadow-sm relative">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-500"><Sparkles size={24} /></div>
                    <h4 className="text-[2.8rem] font-bold text-chocolate font-alimama">{resilience.title}</h4>
                  </div>
                  <p className="text-[2.4rem] text-chocolate/70 leading-[2] font-genjyuu text-justify">{resilience.desc}</p>
                  <div className="mt-8 pt-6 border-t border-chocolate/5 text-[2rem] text-primary italic font-genjyuu">💡 建议：{resilience.advice}</div>
                </div>

                <div className="w-full bg-white/70 backdrop-blur-md p-16 rounded-[4.5rem] border border-white/80 shadow-sm relative">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary"><Footprints size={24} /></div>
                    <h4 className="text-[2.8rem] font-bold text-chocolate font-alimama">灵魂共振深度分析</h4>
                  </div>
                  <p className="text-[2.4rem] text-chocolate/70 leading-[2] font-genjyuu text-justify">{deepSync}</p>
                </div>

                <div className="w-full bg-white/40 p-16 rounded-[4.5rem] border border-dashed border-primary/20 relative mt-4">
                  <Quote className="text-primary/10 w-24 h-24 mb-6" />
                  <p className="text-[3.2rem] text-chocolate/80 leading-[2.4] font-muyao italic px-4">{petLetter}</p>
                  <div className="w-full flex justify-end mt-12 text-primary/40 font-alimama text-[2.4rem]">— 你的毛茸茸宝贝</div>
                </div>
              </>
            ) : (
              <div className="w-full bg-white/70 backdrop-blur-md border border-white/80 p-16 rounded-[4.5rem] shadow-[0_40px_80px_rgba(74,44,42,0.02)] relative">
                <Quote className="absolute -top-10 -left-4 text-primary/10 w-20 h-24 rotate-[168deg]" />
                <div className="text-chocolate/70 text-[2.8rem] leading-[2.4] font-genjyuu relative z-10 text-justify tracking-wide px-4">{resultData.summary}</div>
                <Quote className="absolute -bottom-10 -right-4 text-primary/10 w-20 h-24 rotate-[-12deg]" />
              </div>
            )}
          </div>
        </div>

        <div className="w-full flex items-center justify-between px-10 mt-20 pt-16 border-t-2 border-chocolate/5 relative z-10">
          <div className="flex flex-col items-start gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-[2.2rem] text-chocolate/20 font-bold font-fredoka tracking-[0.3em] uppercase leading-tight">They speak.</p>
              <p className="text-[2.2rem] text-chocolate/20 font-bold font-fredoka tracking-[0.3em] uppercase leading-tight">But we listen.</p>
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <p className="text-[1.8rem] text-primary/40 font-fredoka font-bold tracking-[0.15em] uppercase whitespace-nowrap">WWW.PAWSONALITY.PRO</p>
              <p className="text-[1.4rem] font-alimama text-chocolate/25 tracking-[0.2em] leading-none font-normal whitespace-nowrap">扫描即刻解锁它的宇宙</p>
            </div>
          </div>
          <div className="w-48 h-48 bg-white p-4 rounded-[2.2rem] shadow-xl border border-primary/5 flex items-center justify-center">
            <div className="w-full h-full bg-primary/5 rounded-2xl border-2 border-dashed border-primary/10 flex flex-col items-center justify-center text-primary/15">
              <Sparkles size={40} />
            </div>
          </div>
        </div>
      </div>

      {/* 真实的 UI 展现层 - 保持 isPoster={false} 找回动效 */}
      <div className="w-full max-w-3xl px-6 py-12 flex flex-col items-center z-10 relative">
        <motion.h2 className="text-3xl md:text-4xl font-normal text-chocolate mb-6 text-center font-alimama mt-6">你家毛茸茸是...</motion.h2>
        <div className="mb-8 relative flex justify-center w-full">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150" />
          <span className="text-[6rem] md:text-[8rem] font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-[#FF8E6E] font-fredoka relative z-10 leading-none tracking-wider">{currentMBTI5}</span>
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }} className={`absolute top-0 right-[10%] md:right-[20%] ${petType === 'dog' ? 'text-accent-yellow' : 'text-accent-pink'}`}><Heart size={42} fill="currentColor" /></motion.div>
        </div>
        <p className="text-xl md:text-3xl font-normal text-chocolate/80 font-muyao text-center mb-12">{resultData.title}</p>
        <div className="w-full max-w-[600px] bg-white/60 backdrop-blur-md p-8 rounded-[2rem] shadow-sm border border-white/80 mb-12 relative">
          <Quote className="absolute -top-4 -left-2 text-primary/10 w-12 h-12 rotate-[168deg]" /><p className="text-chocolate/70 text-base md:text-lg leading-loose text-justify font-genjyuu">{resultData.summary}</p><Quote className="absolute -bottom-4 -right-2 text-primary/10 w-12 h-12 rotate-[-12deg]" />
        </div>
        <div className="mb-14 flex flex-col items-center">
          {/* 这里不传递 isPoster，默认 false，显示完整动效和 0.62 半径 */}
          <RadarChart scores={stage === 'FINAL' ? finalScores : propScores} size={window.innerWidth < 768 ? 260 : 320} isUnlocked={stage === 'FINAL'} petType={petType} />
        </div>
        
        <div className="w-full max-w-[500px] mb-12 min-h-[400px]">
          <AnimatePresence mode="wait">
            {stage === 'BASIC' && (
              <motion.div key="pay" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="bg-white/90 p-8 rounded-[2.5rem] shadow-xl text-center border-2 border-primary/5 relative overflow-hidden">
                <div className="mb-6"><h3 className="text-2xl font-normal text-chocolate mb-1 font-alimama">开启它的灵魂私语</h3><p className="text-chocolate/20 text-xs md:text-sm font-bold font-fredoka uppercase tracking-[0.2em]">They speak. But we listen.</p></div>
                <div className="grid grid-cols-3 gap-2 mb-8">
                  <div className="bg-primary/5 p-3 rounded-2xl flex flex-col items-center gap-2 border border-primary/5"><div className="text-primary bg-white p-2 rounded-xl shadow-sm"><Sparkles size={18} /></div><span className="text-[10px] md:text-xs text-chocolate/60 font-genjyuu leading-tight">第 5 维度<br/>深度解码</span></div>
                  <div className="bg-primary/5 p-3 rounded-2xl flex flex-col items-center gap-2 border border-primary/5"><div className="text-primary bg-white p-2 rounded-xl shadow-sm"><Heart size={18} /></div><span className="text-[10px] md:text-xs text-chocolate/60 font-genjyuu leading-tight">主宠契合<br/>灵魂报告</span></div>
                  <div className="bg-primary/5 p-3 rounded-2xl flex flex-col items-center gap-2 border border-primary/5"><div className="text-primary bg-white p-2 rounded-xl shadow-sm"><Footprints size={18} /></div><span className="text-[10px] md:text-xs text-chocolate/60 font-genjyuu leading-tight">4道深度<br/>测评加题</span></div>
                </div>
                <div className="space-y-4">
                  <input type="text" value={unlockCode} onChange={e => setUnlockCode(e.target.value)} placeholder="输入魔法口令" className="w-full bg-primary/5 rounded-2xl py-4 text-center text-xl font-bold text-primary focus:border-primary outline-none transition-all font-fredoka tracking-widest border-2 border-transparent" />
                  <button onClick={handleVerify} disabled={isVerifying} className={`w-full ${themeBg} text-white py-4 rounded-2xl font-alimama text-lg shadow-lg hover:brightness-105 active:scale-[0.98] transition-all`}>{isVerifying ? '正在召唤能量...' : '立即开启'}</button>
                </div>
                <button className="mt-4 flex items-center justify-center gap-1.5 text-chocolate/30 text-sm mx-auto hover:text-primary transition-colors font-genjyuu"><HelpCircle size={14} /> 如何获取口令？</button>
              </motion.div>
            )}
            {stage === 'SELECT_OWNER' && (
              <motion.div key="owner" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white/90 p-8 rounded-[2.5rem] shadow-xl border border-primary/10">
                <h3 className="text-lg font-normal text-chocolate mb-6 text-center font-alimama flex items-center justify-center gap-2"><User size={18} className="text-primary" /> 请选择主人的 MBTI</h3>
                <div className="grid grid-cols-4 gap-2">{mbtiTypes.map(t => (<button key={t} onClick={() => { setOwnerMBTI(t); setStage('DEEP_QUIZ') }} className="py-3 bg-primary/5 hover:bg-primary hover:text-white rounded-xl text-xs font-fredoka font-bold transition-all text-chocolate/60">{t}</button>))}</div>
              </motion.div>
            )}
            {stage === 'DEEP_QUIZ' && (
              <motion.div key={`q-${deepQuizStep}`} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="bg-white/95 p-8 rounded-[2.5rem] shadow-xl border border-primary/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 h-1.5 bg-primary/10 w-full"><motion.div animate={{ width: `${((deepQuizStep + 1) / 4) * 100}%` }} className="h-full bg-primary" /></div>
                <div className="flex justify-between items-center mb-6"><div className="flex items-center gap-2"><AnimatePresence>{deepQuizStep > 0 && (<motion.button initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} onClick={handleDeepBack} className="p-1.5 hover:bg-primary/10 rounded-full text-primary transition-colors"><ChevronLeft size={18} strokeWidth={3} /></motion.button>)}</AnimatePresence><span className="text-primary font-fredoka font-bold tracking-wider text-xs">DEEP DECODING</span></div><span className="text-chocolate/30 text-xs font-genjyuu">{deepQuizStep + 1} / 4</span></div>
                <h4 className="text-lg text-chocolate font-alimama mb-8">{deepQuestions[deepQuizStep].text}</h4>
                <div className="space-y-3">{deepQuestions[deepQuizStep].options.map((opt, i) => { const isSelected = deepAnswers[deepQuizStep] === i; return (<button key={i} onClick={(e) => { e.currentTarget.style.backgroundColor = petType === 'dog' ? '#FEF3C7' : '#FCE7F3'; handleDeepOptionClick(opt.dimension, opt.weight, i) }} className={`w-full p-5 text-left border-2 rounded-2xl transition-all shadow-sm group text-sm leading-relaxed ${isSelected ? selectedColor : `bg-white border-primary/5 ${activeHoverColor} text-chocolate/80`}`}>{opt.text}</button>); })}</div>
              </motion.div>
            )}
            {stage === 'FINAL' && (
              <motion.div key="final" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full flex flex-col gap-6">
                <div className="bg-primary/5 p-8 rounded-[2.5rem] border-2 border-primary/10 relative overflow-hidden flex flex-col items-center">
                  <div className="flex justify-between items-center w-full mb-6">
                    <button onClick={() => setCurrentCard(prev => Math.max(0, prev - 1))} className={`p-2 rounded-full ${currentCard === 0 ? 'opacity-20 pointer-events-none' : 'hover:bg-primary/10 text-primary'}`}><ChevronLeft size={24} /></button>
                    <div className="flex flex-col items-center"><div className={`flex items-center gap-2 font-alimama text-lg ${themeAccent}`}>{finalCards[currentCard].icon} {finalCards[currentCard].title}</div><div className="flex gap-1.5 mt-2">{finalCards.map((_, i) => (<div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentCard ? `w-6 ${themeBg}` : 'w-1.5 bg-chocolate/10'}`} />))}</div></div>
                    <button onClick={() => setCurrentCard(prev => Math.min(finalCards.length - 1, prev + 1))} className={`p-2 rounded-full ${currentCard === finalCards.length - 1 ? 'opacity-20 pointer-events-none' : 'hover:bg-primary/10 text-primary'}`}><ChevronRight size={24} /></button>
                  </div>
                  <div className="w-full min-h-[260px] flex flex-col items-center text-center touch-none">
                    <AnimatePresence mode="wait"><motion.div key={currentCard} drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2} onDragEnd={(_, info) => { const swipeThreshold = 50; if (info.offset.x < -swipeThreshold && currentCard < finalCards.length - 1) { setCurrentCard(prev => prev + 1); } else if (info.offset.x > swipeThreshold && currentCard > 0) { setCurrentCard(prev => prev - 1); } }} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center cursor-grab active:cursor-grabbing w-full px-2"><h5 className="text-chocolate font-bold text-xl mb-4 font-alimama">{finalCards[currentCard].sub}</h5><p className="text-chocolate/70 leading-[1.8] text-justify font-genjyuu text-base">{finalCards[currentCard].content}</p>{finalCards[currentCard].advice && (<div className="mt-6 p-4 bg-white/60 rounded-2xl border border-primary/10 text-sm text-primary italic font-genjyuu">💡 养宠建议：{finalCards[currentCard].advice}</div>)}</motion.div></AnimatePresence>
                  </div>
                </div>
                <div className="flex justify-center gap-4"><button onClick={() => { setStage('SELECT_OWNER'); setDeepQuizStep(0); setDeepAnswers([]); setDeepScores({ T_: 0, A: 0 }); setCurrentCard(0) }} className="text-xs text-primary/40 hover:text-primary flex items-center gap-1.5 transition-colors font-genjyuu"><RefreshCw size={12} /> 重新测评灵魂韧性</button></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex flex-col items-center gap-6 w-full mt-6">
          <motion.button onClick={downloadPoster} disabled={isGenerating} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} className={`flex items-center gap-2.5 px-6 py-3 transition-all duration-300 group relative ${themeAccent}`}><Share2 size={20} strokeWidth={2.2} className="group-hover:rotate-12 transition-transform duration-300" /><span className="font-alimama text-xl tracking-widest font-medium relative">{isGenerating ? '正在生成...' : '分享'}<span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[1.5px] transition-all group-hover:w-full opacity-40 ${themeBg}`} /></span></motion.button>
          <button onClick={onReset} className="flex items-center gap-2 text-chocolate/20 hover:text-chocolate/40 transition-colors text-sm font-genjyuu"><RotateCcw size={14} /><span>换个崽重测</span></button>
          <button onClick={() => { localStorage.removeItem('paws_unlocked_session'); window.location.reload() }} className="mt-8 px-4 py-1.5 border border-dashed border-chocolate/10 text-chocolate/10 hover:text-red-400 hover:border-red-400/30 rounded-lg text-xs font-genjyuu transition-all flex items-center gap-2 tracking-widest"><Trash2 size={12} /> 清除设备指纹 (仅调试可见)</button>
        </div>
      </div>
    </motion.div>
  )
}

export default ResultPage
