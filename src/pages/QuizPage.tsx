import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bone, Fish, Footprints, ChevronLeft } from 'lucide-react'
import { Scores } from '../App'
import { dogQuestions, catQuestions, dogDeepQuestions, catDeepQuestions } from '../data/questions'
import { calculateMBTIResult } from '../utils/mbtiLogic'

interface QuizPageProps {
  petType: 'dog' | 'cat'
  onComplete: (result: string, scores: Scores) => void
  isDeep?: boolean
}

const QuizPage = ({ petType, onComplete, isDeep = false }: QuizPageProps) => {
  const [step, setStep] = useState(0); 
  const [scores, setScores] = useState<Scores>({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0, A: 0, T_: 0 });
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  
  // 动态选择题库
  const questions = isDeep 
    ? (petType === 'dog' ? dogDeepQuestions : catDeepQuestions)
    : (petType === 'dog' ? dogQuestions : catQuestions);
    
  const totalSteps = questions.length;
  const currentQuestion = questions[step];

  const finalizeResult = (finalScores: Scores) => {
    const resultString = calculateMBTIResult(finalScores, isDeep);
    onComplete(resultString, finalScores);
  };

  const handleOptionClick = (dimension: keyof Scores, weight: number, optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[step] = optionIndex;
    setAnswers(newAnswers);

    const newScores = { ...scores, [dimension]: scores[dimension] + weight };
    setScores(newScores);

    setTimeout(() => {
      if (step + 1 < totalSteps) {
        setStep(step + 1);
      } else {
        finalizeResult(newScores);
      }
    }, 400); 
  };

  const handleBack = () => {
    if (step > 0) {
      const prevStep = step - 1;
      const lastOptionIndex = answers[prevStep];
      if (lastOptionIndex !== null) {
        const lastOption = questions[prevStep].options[lastOptionIndex];
        const newScores = { ...scores, [lastOption.dimension]: scores[lastOption.dimension] - lastOption.weight };
        setScores(newScores);
      }
      setStep(prevStep);
    }
  };

  const themeColor = petType === 'dog' ? 'bg-accent-yellow/30' : 'bg-accent-pink/30'
  const progressBg = petType === 'dog' ? 'bg-accent-yellow/40' : 'bg-accent-pink/40'
  const activeHoverColor = petType === 'dog' ? 'hover:bg-accent-yellow/10 hover:border-accent-yellow' : 'hover:bg-accent-pink/10 hover:border-accent-pink'
  const selectedColor = petType === 'dog' ? 'bg-accent-yellow/40 border-accent-yellow shadow-md' : 'bg-accent-pink/40 border-accent-pink shadow-md'

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col w-full min-h-screen items-center font-genjyuu relative overflow-hidden">
      <div className="w-full max-w-2xl px-6 flex flex-col flex-1 pb-12 z-10 relative">
        <header className="flex items-center justify-between mb-10 pt-10">
          <div className="flex items-center gap-3">
            <AnimatePresence>
              {step > 0 && (
                <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} onClick={handleBack} className="p-2.5 bg-white/60 backdrop-blur-md rounded-full shadow-sm border border-primary/5 text-primary hover:bg-primary hover:text-white transition-all">
                  <ChevronLeft size={20} strokeWidth={2.5} />
                </motion.button>
              )}
            </AnimatePresence>
            <motion.div layout className="flex items-center gap-3 bg-white/60 backdrop-blur-md px-5 py-2.5 rounded-full shadow-sm border border-primary/5">
              <Footprints className="text-primary" size={20} />
              <h2 className="text-primary font-normal text-lg md:text-xl font-alimama tracking-wider">
                第 {step + 1} 题 <span className="text-primary/40 font-fredoka mx-1">/</span> 共 {totalSteps} 题
              </h2>
            </motion.div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => window.location.reload()} className="text-chocolate/30 hover:text-primary hover:bg-white/80 backdrop-blur-sm p-3 rounded-full transition-all shadow-sm border border-transparent hover:border-primary/10"><X size={24} strokeWidth={2.5} /></button>
          </div>
        </header>

        <div className={`w-full h-4 ${progressBg} rounded-full mb-12 overflow-hidden shadow-inner relative`}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${((step + 1) / totalSteps) * 100}%` }} transition={{ type: "spring", stiffness: 80, damping: 15 }} className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-[#FF8E6E] rounded-full">
            <div className="absolute right-1 top-[2px] w-2 h-2 bg-white/50 rounded-full blur-[1px]" />
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 1.05, y: -10 }} transition={{ duration: 0.4, type: "spring", bounce: 0.3 }} className="flex-1 flex flex-col">
            <div className="bg-white/80 backdrop-blur-xl border border-white/50 p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(74,44,42,0.05)] mb-8 flex-1 flex flex-col relative overflow-hidden">
              <div className={`absolute -top-20 -right-20 w-40 h-40 ${themeColor} blur-3xl rounded-full pointer-events-none`} />
              <div className="mb-6 md:mb-10 relative z-10 flex gap-4 items-start">
                {petType === 'dog' ? <motion.div animate={{ rotate: [-10, 10, -10] }} transition={{ duration: 4, repeat: Infinity }} className="shrink-0 mt-1 md:mt-0"><Bone className="text-[#FFD93D] drop-shadow-sm" size={32} strokeWidth={2.5} /></motion.div> : <motion.div animate={{ rotate: [-10, 10, -10] }} transition={{ duration: 4, repeat: Infinity }} className="shrink-0 mt-1 md:mt-0"><Fish className="text-[#FF87B2] drop-shadow-sm" size={32} strokeWidth={2.5} /></motion.div>}
                <h3 className="text-2xl md:text-4xl font-normal text-chocolate leading-snug md:leading-relaxed font-alimama tracking-wide">{currentQuestion.text}</h3>
              </div>

              <div className="w-full flex flex-col gap-4 md:gap-5 mt-4 md:mt-6 relative z-10 max-w-[340px] md:max-w-[480px] mx-auto">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = answers[step] === index;
                  const match = option.text.match(/^【(.*?)】(.*)$/);
                  const label = match ? match[1] : '';
                  const desc = match ? match[2] : option.text;

                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleOptionClick(option.dimension, option.weight, index)}
                      whileHover={{ y: -3, scale: 1.01 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full p-5 md:p-7 text-left border-2 rounded-[2rem] transition-all duration-300 group flex flex-col gap-1.5 ${isSelected ? selectedColor : `bg-white border-primary/5 ${activeHoverColor} shadow-[0_8px_24px_rgba(74,44,42,0.06)]`}`}
                    >
                      {label && <span className={`font-bold text-sm md:text-base font-fredoka tracking-widest ${isSelected ? 'text-primary opacity-100' : 'text-primary opacity-80 group-hover:opacity-100'}`}>{label}</span>}
                      <span className={`text-base md:text-lg font-medium font-genjyuu leading-relaxed ${isSelected ? 'text-chocolate' : 'text-chocolate/80 group-hover:text-chocolate'}`}>{desc}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <footer className="text-center opacity-60 hover:opacity-100 transition-opacity pb-6">
          <p className="text-chocolate/40 text-xs md:text-sm italic leading-relaxed font-genjyuu">基于 500+ 宠物行为学专家的临床观察得出... <br className="hidden md:block" />开玩笑的，但真的很准！</p>
        </footer>
      </div>
    </motion.div>
  )
}

export default QuizPage
