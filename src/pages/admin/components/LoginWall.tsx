import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldAlert } from 'lucide-react'

export const LoginWall = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === 'admin' && password === '19940509Wen.') {
      onLogin()
    } else {
      alert('账号或密码错误')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFCF9] p-6 font-genjyuu relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#FF87B2]/10 blur-[80px] rounded-full pointer-events-none" />
      
      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleLogin} 
        className="bg-white/80 backdrop-blur-xl p-10 rounded-[3rem] shadow-[0_20px_60px_rgba(74,44,42,0.05)] border border-white w-full max-w-sm flex flex-col gap-6 relative z-10"
      >
        <div className="flex flex-col items-center mb-4">
          <div className="bg-primary/10 p-4 rounded-full text-primary mb-4"><ShieldAlert size={32} /></div>
          <h2 className="text-2xl text-chocolate font-alimama text-center">管理中枢</h2>
        </div>
        
        <input 
          type="text" 
          placeholder="管理员账号" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
          className="bg-primary/5 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 py-4 outline-none transition-all font-fredoka tracking-wider text-chocolate"
        />
        <input 
          type="password" 
          placeholder="管理密码" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          className="bg-primary/5 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 py-4 outline-none transition-all tracking-wider text-chocolate"
        />
        <button type="submit" className="bg-primary text-white py-4 rounded-2xl font-alimama text-lg shadow-lg hover:shadow-primary/30 hover:-translate-y-1 transition-all mt-2">
          安全登录
        </button>
      </motion.form>
    </div>
  )
}
