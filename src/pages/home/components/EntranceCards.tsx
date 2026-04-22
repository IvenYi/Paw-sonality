import { Dog, Cat } from 'lucide-react'
import { SpotlightCard } from '../../../components/ui/SpotlightCard'

interface EntranceCardsProps {
  onStart: (type: 'dog' | 'cat') => void
}

export const EntranceCards = ({ onStart }: EntranceCardsProps) => {
  return (
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
  )
}
