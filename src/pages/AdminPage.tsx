import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, PieChart, Users, Ticket, Search, Trash2, RefreshCw, LogOut, ShieldAlert, Sparkles, CheckCircle2, Dog, Cat, TrendingUp } from 'lucide-react'
import { getDashboardStats, getMarketingInsights, getBatchStats, generateCodes, resetCodeDevice, invalidateCode, fetchCodes } from '../api/verification'

const AdminPage = () => {
  const [isLogged, setIsLogged] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState<'dashboard' | 'insights' | 'service' | 'generate'>('dashboard')

  // States
  const [stats, setStats] = useState({ total: 0, used: 0, todayUsed: 0 })
  const [insights, setInsights] = useState({ petTypes: { dog: 0, cat: 0 }, topMbtis: [] as any[] })
  const [searchQuery, setSearchQuery] = useState('')
  const [filterBatch, setFilterBatch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterStartDate, setFilterStartDate] = useState('')
  const [filterEndDate, setFilterEndDate] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Pagination and filtering states
  const [page, setPage] = useState(1)
  const [totalCodes, setTotalCodes] = useState(0)
  const PAGE_SIZE = 20
  
  const defaultBatchId = `batch_${new Date().toISOString().split('T')[0].replace(/-/g, '')}`
  const [batchId, setBatchId] = useState(defaultBatchId)
  const [count, setCount] = useState(50)
  const [isGenerating, setIsGenerating] = useState(false)
  const [batchStats, setBatchStats] = useState<any[]>([])

  useEffect(() => {
    if (isLogged) {
      loadData()
    }
  }, [isLogged, activeTab, page])

  const loadData = async () => {
    if (activeTab === 'dashboard') {
      setStats(await getDashboardStats())
    } else if (activeTab === 'insights') {
      setInsights(await getMarketingInsights())
    } else if (activeTab === 'generate') {
      setBatchStats(await getBatchStats())
    } else if (activeTab === 'service') {
      if (!searchQuery) {
        setIsSearching(true)
        const filters = {
          batchId: filterBatch || undefined,
          status: filterStatus !== 'all' ? filterStatus : undefined,
          startDate: filterStartDate || undefined,
          endDate: filterEndDate || undefined
        }
        const { data, total } = await fetchCodes(page, PAGE_SIZE, filters)
        setSearchResults(data)
        setTotalCodes(total)
        setIsSearching(false)
      }
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === 'admin' && password === '19940509Wen.') {
      setIsLogged(true)
    } else {
      alert('账号或密码错误')
    }
  }

  const handleSearch = async () => {
    if (!searchQuery) {
      setPage(1)
      loadData()
      return
    }
    setIsSearching(true)
    const filters = { query: searchQuery }
    const { data } = await fetchCodes(1, 20, filters)
    setSearchResults(data)
    setIsSearching(false)
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    const res = await generateCodes(count, batchId)
    if (res.success) {
      alert(`成功生成 ${count} 个口令！`)
      loadData()
    } else {
      alert('生成失败，请检查数据库配置')
    }
    setIsGenerating(false)
  }

  const handleReset = async (id: string) => {
    if (confirm('确定要解绑该口令的设备吗？解绑后，用户可以在新手机上重新输入此码解锁。')) {
      const ok = await resetCodeDevice(id)
      if (ok) {
        alert('解绑成功')
        handleSearch()
      } else {
        alert('解绑失败')
      }
    }
  }

  const handleInvalidate = async (id: string) => {
    if (confirm('确定要彻底作废该口令吗？此操作不可逆！')) {
      const ok = await invalidateCode(id)
      if (ok) {
        alert('作废成功')
        handleSearch()
      } else {
        alert('作废失败')
      }
    }
  }

  if (!isLogged) {
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

  const tabClass = (tab: string) => `flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-alimama text-lg ${activeTab === tab ? 'bg-primary text-white shadow-md' : 'text-chocolate/50 hover:bg-white hover:text-chocolate'}`

  return (
    <div className="min-h-screen bg-[#FFFCF9] flex font-genjyuu">
      {/* 侧边栏 */}
      <div className="w-64 bg-white/60 backdrop-blur-xl border-r border-primary/5 flex flex-col p-6 shadow-sm z-20 relative">
        <div className="flex items-center gap-3 mb-12 mt-4 px-2">
          <div className="bg-primary text-white p-2 rounded-xl"><Sparkles size={20} /></div>
          <h1 className="text-xl text-chocolate font-black font-fredoka tracking-widest">PAW-ADMIN</h1>
        </div>

        <nav className="flex flex-col gap-3 flex-1">
          <button onClick={() => setActiveTab('dashboard')} className={tabClass('dashboard')}><LayoutDashboard size={20} /> 转化概览</button>
          <button onClick={() => setActiveTab('insights')} className={tabClass('insights')}><PieChart size={20} /> 引流大盘</button>
          <button onClick={() => setActiveTab('service')} className={tabClass('service')}><Users size={20} /> 订单客服</button>
          <button onClick={() => setActiveTab('generate')} className={tabClass('generate')}><Ticket size={20} /> 发卡中心</button>
        </nav>

        <button onClick={() => window.location.reload()} className="mt-auto flex items-center gap-3 px-6 py-4 text-chocolate/40 hover:text-primary transition-colors font-alimama">
          <LogOut size={20} /> 退出系统
        </button>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 p-10 overflow-y-auto relative">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <AnimatePresence mode="wait">
            
            {/* Tab 1: 转化概览 */}
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h2 className="text-3xl font-alimama text-chocolate mb-8 flex items-center gap-3"><LayoutDashboard className="text-primary"/> 转化概览</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-primary/5 flex flex-col relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 text-primary/5"><Ticket size={120} /></div>
                    <span className="text-chocolate/50 font-alimama mb-2">累计发行口令</span>
                    <span className="text-5xl font-black text-chocolate font-fredoka">{stats.total}</span>
                  </div>
                  <div className="bg-primary text-white p-8 rounded-[2.5rem] shadow-lg shadow-primary/20 flex flex-col relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 text-white/10"><CheckCircle2 size={120} /></div>
                    <span className="text-white/80 font-alimama mb-2">已成功核销</span>
                    <span className="text-5xl font-black font-fredoka">{stats.used}</span>
                    <div className="mt-4 bg-white/20 h-2 rounded-full overflow-hidden">
                      <div className="bg-white h-full" style={{ width: `${stats.total ? (stats.used/stats.total)*100 : 0}%` }} />
                    </div>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-primary/5 flex flex-col relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 text-accent-yellow/10"><TrendingUp size={120} /></div>
                    <span className="text-chocolate/50 font-alimama mb-2">今日新增核销</span>
                    <span className="text-5xl font-black text-accent-yellow font-fredoka">+{stats.todayUsed}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab 2: 引流大盘 */}
            {activeTab === 'insights' && (
              <motion.div key="insights" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h2 className="text-3xl font-alimama text-chocolate mb-8 flex items-center gap-3"><PieChart className="text-primary"/> 引流素材大盘</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* 猫狗比例 */}
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-primary/5">
                    <h3 className="text-xl font-alimama text-chocolate mb-6">全网猫狗阵营比</h3>
                    <div className="flex items-center justify-between mb-4 px-4">
                      <div className="flex items-center gap-2 text-accent-yellow font-alimama text-lg"><Dog /> 狗狗 {insights.petTypes.dog}只</div>
                      <div className="flex items-center gap-2 text-accent-pink font-alimama text-lg">{insights.petTypes.cat}只 猫咪 <Cat /></div>
                    </div>
                    <div className="h-12 w-full rounded-2xl overflow-hidden flex shadow-inner">
                      <div className="bg-accent-yellow h-full flex items-center px-4 text-white font-fredoka font-bold" style={{ width: `${insights.petTypes.dog / ((insights.petTypes.dog + insights.petTypes.cat)||1) * 100}%` }}>
                        {Math.round(insights.petTypes.dog / ((insights.petTypes.dog + insights.petTypes.cat)||1) * 100)}%
                      </div>
                      <div className="bg-accent-pink h-full flex items-center justify-end px-4 text-white font-fredoka font-bold" style={{ width: `${insights.petTypes.cat / ((insights.petTypes.dog + insights.petTypes.cat)||1) * 100}%` }}>
                        {Math.round(insights.petTypes.cat / ((insights.petTypes.dog + insights.petTypes.cat)||1) * 100)}%
                      </div>
                    </div>
                  </div>

                  {/* TOP 5 宠格 */}
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-primary/5">
                    <h3 className="text-xl font-alimama text-chocolate mb-6">TOP 5 爆款宠格</h3>
                    <div className="space-y-4">
                      {insights.topMbtis.length === 0 ? (
                        <div className="text-chocolate/30 text-center py-8">暂无足够数据</div>
                      ) : insights.topMbtis.map((item, i) => (
                        <div key={item.mbti} className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-fredoka font-bold ${i===0?'bg-[#FFD93D] text-white':i===1?'bg-slate-200 text-slate-500':i===2?'bg-orange-200 text-orange-600':'bg-primary/5 text-primary'}`}>
                            {i+1}
                          </div>
                          <div className="flex-1 bg-primary/5 h-10 rounded-xl overflow-hidden relative flex items-center">
                            <motion.div 
                              initial={{ width: 0 }} 
                              animate={{ width: `${(item.count / insights.topMbtis[0].count) * 100}%` }} 
                              className="absolute left-0 top-0 h-full bg-primary/20"
                            />
                            <span className="relative z-10 ml-4 font-fredoka font-bold text-chocolate tracking-widest">{item.mbti}</span>
                          </div>
                          <div className="w-12 text-right font-fredoka text-chocolate/50">{item.count}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab 3: 客服订单 */}
            {activeTab === 'service' && (
              <motion.div key="service" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h2 className="text-3xl font-alimama text-chocolate mb-8 flex items-center gap-3"><Users className="text-primary"/> 客服与订单管理</h2>
                
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-primary/5 mb-8 flex flex-col gap-4">
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex-1 min-w-[200px] relative">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-chocolate/30" />
                      <input 
                        type="text" 
                        placeholder="输入 8 位口令精确查询..." 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        className="w-full bg-primary/5 border-2 border-transparent focus:border-primary/20 rounded-2xl py-3 pl-14 pr-6 outline-none transition-all font-fredoka text-lg text-chocolate"
                      />
                    </div>
                    <select 
                      value={filterBatch} 
                      onChange={e => {setFilterBatch(e.target.value); setPage(1)}}
                      className="bg-primary/5 border-2 border-transparent focus:border-primary/20 rounded-2xl px-4 py-3 outline-none font-genjyuu text-chocolate min-w-[140px]"
                    >
                      <option value="">所有批次</option>
                      {batchStats.map(b => <option key={b.batchId} value={b.batchId}>{b.batchId}</option>)}
                    </select>
                    <select 
                      value={filterStatus} 
                      onChange={e => {setFilterStatus(e.target.value); setPage(1)}}
                      className="bg-primary/5 border-2 border-transparent focus:border-primary/20 rounded-2xl px-4 py-3 outline-none font-genjyuu text-chocolate min-w-[120px]"
                    >
                      <option value="all">所有状态</option>
                      <option value="unused">未使用</option>
                      <option value="used">已核销</option>
                    </select>
                    <div className="flex items-center gap-2 bg-primary/5 border-2 border-transparent focus-within:border-primary/20 rounded-2xl px-4 py-3 transition-all">
                      <input 
                        type="date" 
                        value={filterStartDate} 
                        onChange={e => {setFilterStartDate(e.target.value); setPage(1)}}
                        className="bg-transparent outline-none font-genjyuu text-chocolate w-32"
                      />
                      <span className="text-chocolate/30">-</span>
                      <input 
                        type="date" 
                        value={filterEndDate} 
                        onChange={e => {setFilterEndDate(e.target.value); setPage(1)}}
                        className="bg-transparent outline-none font-genjyuu text-chocolate w-32"
                      />
                    </div>
                    <button onClick={handleSearch} disabled={isSearching} className="bg-primary text-white px-8 rounded-2xl font-alimama text-lg hover:shadow-lg transition-all py-3">
                      {isSearching ? '查询中...' : '检索'}
                    </button>
                  </div>
                </div>

                {searchResults.length > 0 && (
                  <div className="bg-white rounded-[2.5rem] shadow-sm border border-primary/5 overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-primary/5 border-b border-primary/10">
                        <tr>
                          <th className="p-5 font-alimama text-chocolate">口令 Code</th>
                          <th className="p-5 font-alimama text-chocolate">状态</th>
                          <th className="p-5 font-alimama text-chocolate">绑定设备 (截断)</th>
                          <th className="p-5 font-alimama text-chocolate">测试结果</th>
                          <th className="p-5 font-alimama text-chocolate">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {searchResults.map(r => (
                          <tr key={r.id} className="border-b border-primary/5 hover:bg-primary/5 transition-colors">
                            <td className="p-5 font-fredoka font-bold text-primary tracking-widest text-lg">{r.code}</td>
                            <td className="p-5">
                              {r.is_used ? (
                                <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm"><CheckCircle2 size={14}/> 已核销</span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-sm"><Ticket size={14}/> 未使用</span>
                              )}
                            </td>
                            <td className="p-5 text-sm text-chocolate/50 font-mono">
                              {r.device_id ? r.device_id.substring(0, 10) + '...' : '-'}
                            </td>
                            <td className="p-5">
                              {r.final_mbti ? (
                                <span className="font-fredoka font-bold text-accent-pink">{r.final_mbti}</span>
                              ) : r.base_mbti ? (
                                <span className="font-fredoka text-chocolate/60">{r.base_mbti} (未完)</span>
                              ) : '-'}
                            </td>
                            <td className="p-5 flex gap-2">
                              {r.is_used && (
                                <button onClick={() => handleReset(r.id)} className="p-2 bg-amber-100 text-amber-600 hover:bg-amber-200 rounded-xl transition-colors tooltip-trigger" title="解绑设备，允许新手机使用">
                                  <RefreshCw size={18} />
                                </button>
                              )}
                              <button onClick={() => handleInvalidate(r.id)} className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-xl transition-colors tooltip-trigger" title="彻底作废该口令">
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {!searchQuery && totalCodes > PAGE_SIZE && (
                  <div className="flex justify-center items-center gap-4 mt-6">
                    <button 
                      disabled={page === 1}
                      onClick={() => setPage(p => p - 1)}
                      className="px-6 py-2 bg-white text-primary border border-primary/10 rounded-xl disabled:opacity-50 hover:bg-primary/5 transition-all font-alimama shadow-sm"
                    >
                      上一页
                    </button>
                    <span className="text-chocolate/50 font-alimama">第 {page} 页 / 共 {Math.ceil(totalCodes / PAGE_SIZE)} 页</span>
                    <button 
                      disabled={page * PAGE_SIZE >= totalCodes}
                      onClick={() => setPage(p => p + 1)}
                      className="px-6 py-2 bg-white text-primary border border-primary/10 rounded-xl disabled:opacity-50 hover:bg-primary/5 transition-all font-alimama shadow-sm"
                    >
                      下一页
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Tab 4: 发卡中心 */}
            {activeTab === 'generate' && (
              <motion.div key="generate" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h2 className="text-3xl font-alimama text-chocolate mb-8 flex items-center gap-3"><Ticket className="text-primary"/> 批量发卡中心</h2>
                
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-primary/5 mb-8">
                  <div className="flex flex-wrap gap-6 items-end">
                    <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
                      <label className="text-sm font-alimama text-chocolate/60 pl-2">生成数量</label>
                      <input type="number" value={count} onChange={e => setCount(Number(e.target.value))} className="bg-primary/5 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 py-4 outline-none transition-all text-xl text-chocolate font-fredoka" />
                    </div>
                    <div className="flex flex-col gap-2 flex-[2] min-w-[250px]">
                      <label className="text-sm font-alimama text-chocolate/60 pl-2">批次号 (Batch ID)</label>
                      <input type="text" value={batchId} onChange={e => setBatchId(e.target.value)} className="bg-primary/5 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 py-4 outline-none transition-all text-xl text-chocolate font-mono" />
                    </div>
                    <button onClick={handleGenerate} disabled={isGenerating} className="bg-primary text-white h-[64px] px-10 rounded-2xl font-alimama text-lg shadow-lg hover:-translate-y-1 transition-all disabled:opacity-50">
                      {isGenerating ? '生成中...' : '立即生成口令'}
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-alimama text-chocolate mb-4 px-2">历史批次追踪</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {batchStats.map(b => (
                    <div key={b.batchId} className="bg-white p-6 rounded-[2rem] border border-primary/5 shadow-sm">
                      <div className="text-sm text-chocolate/50 font-mono mb-4">{b.batchId}</div>
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-3xl font-black font-fredoka text-primary">{b.used} <span className="text-lg text-chocolate/30">/ {b.total}</span></div>
                          <div className="text-sm text-chocolate/50 font-alimama mt-1">已核销</div>
                        </div>
                        <div className="w-16 h-16 rounded-full border-4 border-primary/10 flex items-center justify-center font-fredoka font-bold text-chocolate">
                          {Math.round((b.used / (b.total || 1)) * 100)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
