import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { Dog, Cat, PawPrint, Quote, Sparkles } from 'lucide-react'
import { MouseEvent } from 'react'

interface HomePageProps {
  onStart: (type: 'dog' | 'cat') => void
}

// 聚光灯卡片组件 (Spotlight Card from motion library)
function SpotlightCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      className={`relative overflow-hidden group ${className}`}
      onMouseMove={handleMouseMove}
      whileHover={{ y: -10, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.95 }}
      animate={{ y: [0, -8, 0] }}
      transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(239, 90, 61, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      {children}
    </motion.div>
  );
}

const HomePage = ({ onStart }: HomePageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col w-full font-genjyuu relative overflow-hidden"
    >
      {/* 巧思：漂浮的随机光点 (Signature Ambient Motion) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/10 blur-xl"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 pt-16 pb-20 flex flex-col items-center text-center relative z-10">
        
        {/* Horizontal Stylized Logo Area (Playful Style) */}
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

        {/* Dynamic Stacked Headline with Shiny Effect */}
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

        {/* Slogan with Reveal */}
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

        {/* Test Buttons Area - Spotlight Cards */}
        <div className="w-full max-w-[340px] md:max-w-[480px] space-y-6 mb-24">
          <SpotlightCard className="w-full bubbly-card p-6 md:p-8 flex items-center gap-6 md:gap-8 border-2 border-primary/5 cursor-pointer bg-white/80 backdrop-blur-sm">
            <div className="w-16 md:w-20 shrink-0 flex justify-center" onClick={() => onStart('dog')}>
              <div className="bg-accent-yellow p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] group-hover:scale-110 transition-transform shadow-inner relative z-10">
                <Dog size={32} className="text-chocolate md:w-10 md:h-10" />
              </div>
            </div>
            <div className="text-left flex-1 relative z-10" onClick={() => onStart('dog')}>
              <h3 className="font-normal text-xl md:text-2xl text-chocolate tracking-tight font-alimama whitespace-nowrap">
                测测我家修勾
              </h3>
              <p className="text-chocolate/40 font-bold font-fredoka mt-1.5 text-xs md:text-sm tracking-wide italic">
                Bark, fetch, and vibes.
              </p>
            </div>
          </SpotlightCard>

          <SpotlightCard className="w-full bubbly-card p-6 md:p-8 flex items-center gap-6 md:gap-8 border-2 border-primary/5 cursor-pointer bg-white/80 backdrop-blur-sm">
            <div className="w-16 md:w-20 shrink-0 flex justify-center" onClick={() => onStart('cat')}>
              <div className="bg-accent-pink p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] group-hover:scale-110 transition-transform shadow-inner relative z-10">
                <Cat size={32} className="text-chocolate md:w-10 md:h-10" />
              </div>
            </div>
            <div className="text-left flex-1 relative z-10" onClick={() => onStart('cat')}>
              <h3 className="font-normal text-xl md:text-2xl text-chocolate tracking-tight font-alimama whitespace-nowrap">
                测测我家猫咪
              </h3>
              <p className="text-chocolate/40 font-bold font-fredoka mt-1.5 text-xs md:text-sm tracking-wide italic">
                Naps, snacks, and sass.
              </p>
            </div>
          </SpotlightCard>
        </div>

        {/* Social Proof with Staggered Reveal */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center gap-4 max-w-lg"
        >
          <Quote size={24} className="text-primary/20 rotate-180" />
          <p className="text-chocolate/50 text-base md:text-xl font-medium italic font-genjyuu leading-relaxed px-4 relative">
            <span className="absolute -left-2 -top-2 text-4xl text-primary/10 font-serif">"</span>
            原来我家 dog 是 <span className="text-primary/70 font-bold font-fredoka text-xl bg-accent-yellow/30 px-2 rounded-md">ENFP</span>！怪不得每天像个快乐的傻瓜，治愈死我了～
            <span className="absolute -right-2 -bottom-4 text-4xl text-primary/10 font-serif">"</span>
          </p>
          <div className="flex items-center gap-3 mt-4">
             <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-chocolate/20" />
             <span className="text-chocolate/40 font-bold text-sm tracking-widest uppercase font-fredoka">@momo</span>
             <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-chocolate/20" />
          </div>
        </motion.div>
      </main>
    </motion.div>
  )
}

export default HomePage
