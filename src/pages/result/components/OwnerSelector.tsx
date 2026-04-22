import { motion } from 'framer-motion'
import { User } from 'lucide-react'

const mbtiTypes = ['ENFP', 'ENTP', 'INFP', 'INTP', 'ENFJ', 'ENTJ', 'INFJ', 'INTJ', 'ESFP', 'ESTP', 'ISFP', 'ISTP', 'ESFJ', 'ESTJ', 'ISFJ', 'ISTJ']

interface OwnerSelectorProps {
  onSelect: (mbti: string) => void
}

export const OwnerSelector = ({ onSelect }: OwnerSelectorProps) => {
  return (
    <motion.div 
      key="owner" 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }} 
      className="bg-white/90 p-8 rounded-[2.5rem] shadow-xl border border-primary/10"
    >
      <h3 className="text-lg font-normal text-chocolate mb-6 text-center font-alimama flex items-center justify-center gap-2">
        <User size={18} className="text-primary" /> 请选择主人的 MBTI
      </h3>
      <div className="grid grid-cols-4 gap-2">
        {mbtiTypes.map(t => (
          <button 
            key={t} 
            onClick={() => onSelect(t)} 
            className="py-3 bg-primary/5 hover:bg-primary hover:text-white rounded-xl text-xs font-fredoka font-bold transition-all text-chocolate/60"
          >
            {t}
          </button>
        ))}
      </div>
    </motion.div>
  )
}
