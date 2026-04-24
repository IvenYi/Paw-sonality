import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

export const SocialProof = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="flex flex-col items-center gap-4 max-w-lg"
    >
      <Quote size={24} className="text-primary/20 rotate-180" />
      <p className="text-chocolate/50 text-base md:text-xl font-medium italic font-genjyuu leading-relaxed px-4 relative">
        <span className="absolute -left-2 -top-2 text-4xl text-primary/10 font-serif">"</span>
        原来我家 dog 是 <span className="text-primary/70 font-bold font-fredoka text-xl bg-accent-yellow/30 px-2 rounded-md">ENFP</span>怪不得每天像个快乐的傻瓜～
        <span className="absolute -right-2 -bottom-4 text-4xl text-primary/10 font-serif">"</span>
      </p>
      <div className="flex items-center gap-3 mt-4">
         <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-chocolate/20" />
         <span className="text-chocolate/40 font-bold text-sm tracking-widest uppercase font-fredoka">@momo</span>
         <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-chocolate/20" />
      </div>
    </motion.div>
  )
}
