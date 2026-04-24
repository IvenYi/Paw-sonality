import { Heart, Sparkles, Quote, Footprints } from 'lucide-react'
import RadarChart from '../../../components/RadarChart'
import { dogResults, catResults } from '../../../data/mbtiResults'
import { SOUL_RESILIENCE_CONTENT, getRelationshipLabel, getDeepSyncAnalysis, getLetterToOwner } from '../../../data/analysisContent'
import { Scores } from '../../../App'

interface SharePosterProps {
  result: string
  petType: 'dog' | 'cat'
  stage: string
  finalScores: Scores
  propScores: Scores
  currentMBTI5: string
  ownerMBTI: string
}

export const SharePoster = ({ 
  result, 
  petType, 
  stage, 
  finalScores, 
  propScores, 
  currentMBTI5, 
  ownerMBTI 
}: SharePosterProps) => {
  const resultData = (petType === 'dog' ? dogResults[result] : catResults[result]) || dogResults['ENFP'];
  const isFinal = stage === 'FINAL';

  const resKey = finalScores.T_ > finalScores.A ? 'T' : 'A';
  const resilience = SOUL_RESILIENCE_CONTENT[resKey];
  const relation = getRelationshipLabel(result, ownerMBTI);
  const deepSync = getDeepSyncAnalysis(result, ownerMBTI);
  const petLetter = getLetterToOwner(petType, currentMBTI5);

  return (
    <div id="share-poster" className="fixed top-[-9999px] left-0 w-[1080px] h-fit bg-[#FFFCF9] z-[-1] overflow-hidden flex flex-col items-center pt-20 pb-20 px-20" style={{ display: 'none' }}>
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
         <div className="absolute top-[-5%] left-[-10%] w-[1200px] h-[1200px] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #EF5A3D 0%, transparent 70%)' }} />
         <div className="absolute bottom-[10%] right-[-10%] w-[1000px] h-[1000px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #FFD93D 0%, transparent 70%)' }} />
      </div>

      <div className="flex flex-col items-center mb-16 relative z-10 w-full">
        <h1 className="text-[2.2rem] font-black tracking-[0.6em] text-chocolate/15 font-fredoka uppercase leading-none whitespace-nowrap">PAW-SONALITY</h1>
        <div className="h-1 w-20 bg-chocolate/5 rounded-full mt-6" />
      </div>

      <div className="flex flex-col items-center w-full relative z-10 flex-1">
        <h2 className="text-[2.6rem] text-chocolate/40 font-alimama tracking-[0.4em] mb-12 whitespace-nowrap">宠格深度解码报告</h2>
        
        <div className="relative flex justify-center items-center w-full mb-20 px-20">
          <span className="text-[15rem] font-black text-primary tracking-[0.05em] drop-shadow-[0_20px_40px_rgba(239,90,61,0.12)] font-fredoka leading-none relative z-10 whitespace-nowrap inline-block">
            {currentMBTI5}
          </span>
          <Heart size={80} className={`absolute top-[-15%] right-[2%] ${petType === 'dog' ? 'text-accent-yellow' : 'text-accent-pink'} opacity-60 z-20`} fill="currentColor" />
        </div>

        <p className="text-[3.2rem] font-normal text-chocolate/90 font-muyao text-center leading-none mb-16 px-10 whitespace-nowrap">{resultData.title}</p>
        
        <div className="w-full flex flex-col items-center relative z-10 mb-20">
          <div className="bg-white/40 p-20 rounded-[6rem] border border-white/60">
            <RadarChart 
              scores={isFinal ? finalScores : propScores} 
              size={600} 
              isUnlocked={isFinal} 
              petType={petType} 
              isPoster={true} 
            />
          </div>
        </div>

        <div className="w-full flex flex-col gap-12 relative z-10 mb-20 px-10">
          {isFinal ? (
            <>
              <div className="w-full bg-white/70 backdrop-blur-md p-16 rounded-[4.5rem] border border-white/80 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary"><Heart size={24} /></div>
                  <h4 className="text-[2.8rem] font-bold text-chocolate font-alimama">宿命羁绊：{relation.tag}</h4>
                </div>
                <p className="text-[2.4rem] text-chocolate/70 leading-[2] font-genjyuu text-justify">{relation.desc}</p>
              </div>

              <div className="w-full bg-white/70 backdrop-blur-md p-16 rounded-[4.5rem] border border-white/80 shadow-sm relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-500"><Sparkles size={24} /></div>
                  <h4 className="text-[2.8rem] font-bold text-chocolate font-alimama">{resilience.title}</h4>
                </div>
                <p className="text-[2.4rem] text-chocolate/70 leading-[2] font-genjyuu text-justify">{resilience.desc}</p>
                <div className="mt-8 pt-6 border-t border-chocolate/5 text-[2rem] text-primary italic font-genjyuu">💡 建议：{resilience.advice}</div>
              </div>

              <div className="w-full bg-white/70 backdrop-blur-md p-16 rounded-[4.5rem] border border-white/80 shadow-sm relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary"><Footprints size={24} /></div>
                  <h4 className="text-[2.8rem] font-bold text-chocolate font-alimama">灵魂共振深度分析</h4>
                </div>
                <p className="text-[2.4rem] text-chocolate/70 leading-[2] font-genjyuu text-justify">{deepSync}</p>
              </div>

              <div className="w-full bg-white/40 p-16 rounded-[4.5rem] border border-dashed border-primary/20 relative mt-4">
                <Quote className="text-primary/10 w-24 h-24 mb-6" />
                <p className="text-[3.2rem] text-chocolate/80 leading-[2.4] font-muyao italic px-4">{petLetter}</p>
                <div className="w-full flex justify-end mt-12 text-primary/40 font-alimama text-[2.4rem]">— 你的毛茸茸宝贝</div>
              </div>
            </>
          ) : (
            <div className="w-full bg-white/70 backdrop-blur-md border border-white/80 p-16 rounded-[4.5rem] shadow-[0_40px_80px_rgba(74,44,42,0.02)] relative">
              <Quote className="absolute -top-10 -left-4 text-primary/10 w-20 h-24 rotate-[168deg]" />
              <div className="text-chocolate/70 text-[2.8rem] leading-[2.4] font-genjyuu relative z-10 text-justify tracking-wide px-4">{resultData.summary}</div>
              <Quote className="absolute -bottom-10 -right-4 text-primary/10 w-20 h-24 rotate-[-12deg]" />
            </div>
          )}
        </div>
      </div>

      <div className="w-full flex items-center justify-between px-10 mt-20 pt-16 border-t-2 border-chocolate/5 relative z-10">
        <div className="flex flex-col items-start gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-[2.2rem] text-chocolate/20 font-bold font-fredoka tracking-[0.3em] uppercase leading-tight">They speak.</p>
            <p className="text-[2.2rem] text-chocolate/20 font-bold font-fredoka tracking-[0.3em] uppercase leading-tight">But we listen.</p>
          </div>
          <div className="flex flex-col gap-1 mt-2">
            <p className="text-[1.8rem] text-primary/40 font-fredoka font-bold tracking-[0.15em] uppercase whitespace-nowrap">Pawti.fun</p>
            <p className="text-[1.4rem] font-alimama text-chocolate/25 tracking-[0.2em] leading-none font-normal whitespace-nowrap">扫描即刻解锁它的宇宙</p>
          </div>
        </div>
        <div className="w-48 h-48 bg-white p-4 rounded-[2.2rem] shadow-xl border border-primary/5 flex items-center justify-center">
          <div className="w-full h-full bg-primary/5 rounded-2xl border-2 border-dashed border-primary/10 flex flex-col items-center justify-center text-primary/15">
            <Sparkles size={40} />
          </div>
        </div>
      </div>
    </div>
  )
}
