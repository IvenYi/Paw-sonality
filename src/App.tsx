import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import HomePage from './pages/HomePage'
import QuizPage from './pages/QuizPage'
import ResultPage from './pages/ResultPage'

export type Page = 'home' | 'quiz' | 'result'
export type PetType = 'dog' | 'cat'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [petType, setPetType] = useState<PetType>('dog')
  const [mbtiResult, setMbtiResult] = useState('ENFP')

  const startQuiz = (type: PetType) => {
    setPetType(type)
    setCurrentPage('quiz')
  }

  const showResult = (result: string) => {
    setMbtiResult(result)
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
            <ResultPage key="result" result={mbtiResult} petType={petType} onReset={reset} />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App
