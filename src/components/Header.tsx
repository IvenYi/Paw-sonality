import { PawPrint } from 'lucide-react'

const Header = () => {
  return (
    <header className="w-full bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 flex justify-center">
      <div className="w-full max-w-5xl px-6 py-4 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg text-white shadow-md shadow-primary/20">
            <PawPrint size={20} fill="currentColor" />
          </div>
          <span className="font-bold text-lg tracking-tight text-chocolate font-fredoka">PAW-SONALITY</span>
        </div>
        
        {/* Right: Loving Slogan */}
        <div className="flex flex-col items-end text-right">
          <span className="text-[10px] md:text-xs text-chocolate/30 font-bold uppercase tracking-[0.1em] font-fredoka">
            They speak. But we listen.
          </span>
          <span className="text-[11px] md:text-sm text-primary/60 font-medium mt-0.5 tracking-wider">
            听见，它没说出口的爱
          </span>
        </div>
      </div>
    </header>
  )
}

export default Header
