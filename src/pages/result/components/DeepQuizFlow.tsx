import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'

interface DeepQuizFlowProps {
  step: number
  questions: any[]
  answers: (number | null)[]
  onOptionClick: (dim: string, weight: number, index: number) => void
  onBack: () => void
  petType: 'dog' | 'cat'
  selectedColor: string
  activeHoverColor: string
}

export const DeepQuizFlow = ({ 
  step, 
  questions, 
  answers, 
  onOptionClick, 
  onBack, 
  petType, 
  selectedColor, 
  activeHoverColor 
}: DeepQuizFlowProps) => {
  return (
    <motion.div 
      key={`q-${step}`} 
      initial={{ opacity: 0, x: 50 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -50 }} 
      className="bg-white/95 p-8 rounded-[2.5rem] shadow-xl border border-primary/10 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 h-1.5 bg-primary/10 w-full">
        <motion.div animate={{ width: `${((step + 1) / 4) * 100}%` }} className="h-full bg-primary" />
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <AnimatePresence>
            {step > 0 && (
              <motion.button 
                initial={{ opacity: 0, scale: 0.5 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.5 }} 
                onClick={onBack} 
                className="p-1.5 hover:bg-primary/10 rounded-full text-primary transition-colors"
              >
                <ChevronLeft size={18} strokeWidth={3} />
              </motion.button>
            )}
          </AnimatePresence>
          <span className="text-primary font-fredoka font-bold tracking-wider text-xs">DEEP DECODING</span>
        </div>
        <span className="text-chocolate/30 text-xs font-genjyuu">{step + 1} / 4</span>
      </div>

      <h4 className="text-lg text-chocolate font-alimama mb-8">{questions[step].text}</h4>
      
      <div className="space-y-3">
        {questions[step].options.map((opt: any, i: number) => { 
          const isSelected = answers[step] === i; 
          return (
            <button 
              key={i} 
              onClick={(e) => { 
                e.currentTarget.style.backgroundColor = petType === 'dog' ? '#FEF3C7' : '#FCE7F3'; 
                onOptionClick(opt.dimension, opt.weight, i) 
              }} 
              className={`w-full p-5 text-left border-2 rounded-2xl transition-all shadow-sm group text-sm leading-relaxed ${isSelected ? selectedColor : `bg-white border-primary/5 ${activeHoverColor} text-chocolate/80`}`}
            >
              {opt.text}
            </button>
          ); 
        })}
      </div>
    </motion.div>
  )
}
