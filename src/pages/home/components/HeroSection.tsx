import { motion } from 'framer-motion'
import { PawPrint, Sparkles } from 'lucide-react'

export const HeroSection = () => {
  return (
    <>
      {/* Horizontal Stylized Logo Area */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="flex flex-col items-center mb-16"
      >
        <div className="relative flex items-center justify-center mb-4 mt-4">
          <motion.div
            animate={{ rotate: [-15, 15, -15], y: [0, -3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-10 md:-left-14 text-primary"
          >
            <PawPrint size={32} strokeWidth={2.5} fill="currentColor" className="drop-shadow-sm opacity-90" />
          </motion.div>
          
          <span className="text-3xl md:text-5xl font-black tracking-wider text-chocolate font-fredoka uppercase px-4 drop-shadow-sm z-10">
            PAW<span className="text-primary">-</span>SONALITY
          </span>

          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-10 md:-right-14 text-[#FFD93D]"
          >
            <Sparkles size={32} strokeWidth={2.5} fill="currentColor" className="drop-shadow-sm" />
          </motion.div>
        </div>
        <div className="h-[4px] w-24 bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-full mt-2" />
      </motion.div>

      {/* Dynamic Stacked Headline */}
      <div className="flex flex-col items-center mb-16 relative">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.2, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-6xl md:text-8xl font-bold text-primary tracking-[0.4em] font-fredoka mb-4 absolute -top-8 -z-10 blur-[2px]"
        >
          MBTI
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="text-5xl md:text-7xl font-normal text-primary leading-tight tracking-normal font-alimama relative overflow-hidden"
        >
          解码它的<span className="relative inline-block">小宇宙
            <motion.div 
              animate={{ left: ['-100%', '200%'] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
              className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
            />
          </span>
        </motion.h1>
      </div>

      {/* Slogan */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col items-center mb-20"
      >
        <p className="text-chocolate/20 font-bold text-sm md:text-base uppercase tracking-[0.3em] font-fredoka mb-3">
          They speak. But we listen.
        </p>
        <p className="text-primary/70 text-2xl md:text-4xl font-normal tracking-wide font-muyao bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-pink">
          听见，它没说出口的爱
        </p>
      </motion.div>
    </>
  )
}
