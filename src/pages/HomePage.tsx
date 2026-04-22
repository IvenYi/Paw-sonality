import { motion } from 'framer-motion'
import { HeroSection } from './home/components/HeroSection'
import { EntranceCards } from './home/components/EntranceCards'
import { SocialProof } from './home/components/SocialProof'
import { AmbientLight } from '../components/ui/AmbientLight'

interface HomePageProps {
  onStart: (type: 'dog' | 'cat') => void
}

const HomePage = ({ onStart }: HomePageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col w-full font-genjyuu relative overflow-hidden"
    >
      {/* 巧思：背景漂浮光点 */}
      <AmbientLight />

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 pt-16 pb-20 flex flex-col items-center text-center relative z-10">
        
        {/* 1. 品牌展示区 */}
        <HeroSection />

        {/* 2. 测试入口卡片区 */}
        <EntranceCards onStart={onStart} />

        {/* 3. 社交好评展示区 */}
        <SocialProof />

      </main>
    </motion.div>
  )
}

export default HomePage
