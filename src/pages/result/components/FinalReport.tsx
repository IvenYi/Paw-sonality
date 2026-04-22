import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, RefreshCw, Sparkles, Heart, Footprints, Trophy } from 'lucide-react'
import { useState } from 'react'
import { SOUL_RESILIENCE_CONTENT, getRelationshipLabel, getDeepSyncAnalysis, getLetterToOwner } from '../../../data/analysisContent'
import { Scores } from '../../../App'

interface FinalReportProps {
  result: string
  ownerMBTI: string
  finalScores: Scores
  petType: 'dog' | 'cat'
  currentMBTI5: string
  themeAccent: string
  themeBg: string
  onResetDeepQuiz: () => void
}

export const FinalReport = ({ 
  result, 
  ownerMBTI, 
  finalScores, 
  petType, 
  currentMBTI5, 
  themeAccent, 
  themeBg, 
  onResetDeepQuiz 
}: FinalReportProps) => {
  const [currentCard, setCurrentCard] = useState(0)

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

  const handleNext = () => setCurrentCard(prev => Math.min(finalCards.length - 1, prev + 1))
  const handlePrev = () => setCurrentCard(prev => Math.max(0, prev - 1))

  return (
    <motion.div 
      key="final" 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="w-full flex flex-col gap-6"
    >
      <div className="bg-primary/5 p-8 rounded-[2.5rem] border-2 border-primary/10 relative overflow-hidden flex flex-col items-center">
        <div className="flex justify-between items-center w-full mb-6">
          <button 
            onClick={handlePrev} 
            className={`p-2 rounded-full ${currentCard === 0 ? 'opacity-20 pointer-events-none' : 'hover:bg-primary/10 text-primary'}`}
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex flex-col items-center">
            <div className={`flex items-center gap-2 font-alimama text-lg ${themeAccent}`}>
              {finalCards[currentCard].icon} {finalCards[currentCard].title}
            </div>
            <div className="flex gap-1.5 mt-2">
              {finalCards.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentCard ? `w-6 ${themeBg}` : 'w-1.5 bg-chocolate/10'}`} />
              ))}
            </div>
          </div>
          <button 
            onClick={handleNext} 
            className={`p-2 rounded-full ${currentCard === finalCards.length - 1 ? 'opacity-20 pointer-events-none' : 'hover:bg-primary/10 text-primary'}`}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="w-full min-h-[260px] flex flex-col items-center text-center touch-none">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentCard} 
              drag="x" 
              dragConstraints={{ left: 0, right: 0 }} 
              dragElastic={0.2} 
              onDragEnd={(_, info) => { 
                const swipeThreshold = 50; 
                if (info.offset.x < -swipeThreshold && currentCard < finalCards.length - 1) { 
                  handleNext(); 
                } else if (info.offset.x > swipeThreshold && currentCard > 0) { 
                  handlePrev(); 
                } 
              }} 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }} 
              className="flex flex-col items-center cursor-grab active:cursor-grabbing w-full px-2"
            >
              <h5 className="text-chocolate font-bold text-xl mb-4 font-alimama">{finalCards[currentCard].sub}</h5>
              <p className="text-chocolate/70 leading-[1.8] text-justify font-genjyuu text-base">{finalCards[currentCard].content}</p>
              {finalCards[currentCard].advice && (
                <div className="mt-6 p-4 bg-white/60 rounded-2xl border border-primary/10 text-sm text-primary italic font-genjyuu">
                  💡 养宠建议：{finalCards[currentCard].advice}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button 
          onClick={onResetDeepQuiz} 
          className="text-xs text-primary/40 hover:text-primary flex items-center gap-1.5 transition-colors font-genjyuu"
        >
          <RefreshCw size={12} /> 重新测评灵魂韧性
        </button>
      </div>
    </motion.div>
  )
}
