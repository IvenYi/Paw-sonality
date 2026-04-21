import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import HomePage from './pages/HomePage'
import QuizPage from './pages/QuizPage'
import ResultPage from './pages/ResultPage'

export type Page = 'home' | 'quiz' | 'result'
export type PetType = 'dog' | 'cat'

export interface Scores {
  E: number; I: number;
  S: number; N: number;
  T: number; F: number;
  J: number; P: number;
  A: number; T_: number; // 第5维度：Assertive vs Turbulent
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [petType, setPetType] = useState<PetType>('dog')
  const [mbtiResult, setMbtiResult] = useState('ENFP')
  const [scores, setScores] = useState<Scores>({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0, A: 0, T_: 0 })

  const startQuiz = (type: PetType) => {
    setPetType(type)
    setCurrentPage('quiz')
  }

  const showResult = (result: string, scores: Scores) => {
    setMbtiResult(result)
    setScores(scores)
    setCurrentPage('result')
  }

  const reset = () => {
    setCurrentPage('home')
  }

  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden flex flex-col">
      {/* 增强版背景光晕 - 仅在基础版使用，设计版已内置 */}
      <div className="absolute top-[-5%] left-[-10%] w-[80%] h-[60%] bg-[#FFD93D]/30 blur-[100px] rounded-full z-0 pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-10%] w-[70%] h-[50%] bg-[#FF87B2]/20 blur-[100px] rounded-full z-0 pointer-events-none" />
      
      {/* 内容层 */}
      <div className="relative z-10 flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <HomePage key="home" onStart={startQuiz} />
          )}
          {currentPage === 'quiz' && (
            <QuizPage key="quiz" petType={petType} onComplete={showResult} />
          )}
          {currentPage === 'result' && (
            <ResultPage key="result" result={mbtiResult} scores={scores} petType={petType} onReset={reset} />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App
