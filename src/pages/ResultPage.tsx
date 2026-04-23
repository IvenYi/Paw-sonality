import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Heart, Quote, Share2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import html2canvas from 'html2canvas'
import { Scores } from '../App'
import RadarChart from '../components/RadarChart'
import { dogDeepQuestions, catDeepQuestions } from '../data/questions'
import { dogResults, catResults } from '../data/mbtiResults'
import { verifyRedemptionCode, updateFinalResult } from '../api/verification'

import { PaywallCard } from './result/components/PaywallCard'
import { OwnerSelector } from './result/components/OwnerSelector'
import { DeepQuizFlow } from './result/components/DeepQuizFlow'
import { FinalReport } from './result/components/FinalReport'
import { SharePoster } from './result/components/SharePoster'

type ResultStage = 'BASIC' | 'SELECT_OWNER' | 'DEEP_QUIZ' | 'FINAL'

interface ResultPageProps {
  result: string
  scores: Scores
  petType: 'dog' | 'cat'
  onReset: () => void
}

const ResultPage = ({ result, scores: propScores, petType, onReset }: ResultPageProps) => {
  const [stage, setStage] = useState<ResultStage>('BASIC')
  const [isGenerating, setIsGenerating] = useState(false)
  const [unlockCode, setUnlockCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [ownerMBTI, setOwnerMBTI] = useState('')
  const [deepQuizStep, setDeepQuizStep] = useState(0)
  const [deepScores, setDeepScores] = useState({ T_: 0, A: 0 })
  const [deepAnswers, setDeepAnswers] = useState<(number | null)[]>([])
  const [finalScores, setFinalScores] = useState<Scores>(propScores)

  const deepQuestions = petType === 'dog' ? dogDeepQuestions : catDeepQuestions;
  const resultData = (petType === 'dog' ? dogResults[result] : catResults[result]) || dogResults['ENFP'];

  useEffect(() => {
    const saved = localStorage.getItem('paws_unlocked_session')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data && data.code) {
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
    const res = await verifyRedemptionCode(unlockCode, petType, result)
    if (res.success) {
      localStorage.setItem('paws_unlocked_session', JSON.stringify({ code: unlockCode, isFinished: false }))
      setStage('SELECT_OWNER')
    } else {
      alert(res.message)
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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col w-full min-h-screen items-center font-genjyuu relative overflow-hidden pb-20">
      
      <SharePoster 
        result={result}
        petType={petType}
        stage={stage}
        finalScores={finalScores}
        propScores={propScores}
        currentMBTI5={currentMBTI5}
        ownerMBTI={ownerMBTI}
      />

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
          <RadarChart scores={stage === 'FINAL' ? finalScores : propScores} size={window.innerWidth < 768 ? 260 : 320} isUnlocked={stage === 'FINAL'} petType={petType} />
        </div>
        
        <div className="w-full max-w-[500px] mb-12 min-h-[400px]">
          <AnimatePresence mode="wait">
            {stage === 'BASIC' && (
              <PaywallCard 
                unlockCode={unlockCode}
                setUnlockCode={setUnlockCode}
                handleVerify={handleVerify}
                isVerifying={isVerifying}
                themeBg={themeBg}
              />
            )}
            {stage === 'SELECT_OWNER' && (
              <OwnerSelector onSelect={(t) => { setOwnerMBTI(t); setStage('DEEP_QUIZ') }} />
            )}
            {stage === 'DEEP_QUIZ' && (
              <DeepQuizFlow 
                step={deepQuizStep}
                questions={deepQuestions}
                answers={deepAnswers}
                onOptionClick={handleDeepOptionClick}
                onBack={handleDeepBack}
                petType={petType}
                selectedColor={selectedColor}
                activeHoverColor={activeHoverColor}
              />
            )}
            {stage === 'FINAL' && (
              <FinalReport 
                result={result}
                ownerMBTI={ownerMBTI}
                finalScores={finalScores}
                petType={petType}
                currentMBTI5={currentMBTI5}
                themeAccent={themeAccent}
                themeBg={themeBg}
                onResetDeepQuiz={() => { setStage('SELECT_OWNER'); setDeepQuizStep(0); setDeepAnswers([]); setDeepScores({ T_: 0, A: 0 }); }}
              />
            )}
          </AnimatePresence>
        </div>
        <div className="flex flex-col items-center gap-6 w-full mt-6">
          <motion.button onClick={downloadPoster} disabled={isGenerating} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} className={`flex items-center gap-2.5 px-6 py-3 transition-all duration-300 group relative ${themeAccent}`}><Share2 size={20} strokeWidth={2.2} className="group-hover:rotate-12 transition-transform duration-300" /><span className="font-alimama text-xl tracking-widest font-medium relative">{isGenerating ? '正在生成...' : '分享'}<span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[1.5px] transition-all group-hover:w-full opacity-40 ${themeBg}`} /></span></motion.button>
          <button onClick={onReset} className="flex items-center gap-2 text-chocolate/20 hover:text-chocolate/40 transition-colors text-sm font-genjyuu"><RotateCcw size={14} /><span>换个崽重测</span></button>
        </div>
      </div>
    </motion.div>
  )
}

export default ResultPage
