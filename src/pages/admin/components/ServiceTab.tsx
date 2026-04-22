import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Search, CheckCircle2, Ticket, RefreshCw, Trash2 } from 'lucide-react'
import { fetchCodes, getBatchStats, resetCodeDevice, invalidateCode } from '../../../api/verification'

export const ServiceTab = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterBatch, setFilterBatch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterStartDate, setFilterStartDate] = useState('')
  const [filterEndDate, setFilterEndDate] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [page, setPage] = useState(1)
  const [totalCodes, setTotalCodes] = useState(0)
  const [batchStats, setBatchStats] = useState<any[]>([])

  const PAGE_SIZE = 20

  useEffect(() => {
    getBatchStats().then(setBatchStats)
  }, [])

  useEffect(() => {
    if (!searchQuery) {
      loadFilteredData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filterBatch, filterStatus, filterStartDate, filterEndDate])

  const loadFilteredData = async () => {
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

  const handleSearch = async () => {
    if (!searchQuery) {
      setPage(1)
      loadFilteredData()
      return
    }
    setIsSearching(true)
    const filters = { query: searchQuery }
    const { data } = await fetchCodes(1, 20, filters)
    setSearchResults(data)
    setIsSearching(false)
  }

  const handleReset = async (id: string) => {
    if (confirm('确定要解绑该口令的设备吗？解绑后，用户可以在新手机上重新输入此码解锁。')) {
      const ok = await resetCodeDevice(id)
      if (ok) {
        alert('解绑成功')
        searchQuery ? handleSearch() : loadFilteredData()
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
        searchQuery ? handleSearch() : loadFilteredData()
      } else {
        alert('作废失败')
      }
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
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
              className="w-full bg-primary/5 border-2 border-transparent focus:border-primary/20 rounded-2xl py-3 pl-14 pr-6 outline-none transition-all font-fredoka text-lg text-chocolate uppercase"
            />
          </div>
          <select 
            value={filterBatch} 
            onChange={e => {setFilterBatch(e.target.value); setPage(1); setSearchQuery('');}}
            className="bg-primary/5 border-2 border-transparent focus:border-primary/20 rounded-2xl px-4 py-3 outline-none font-genjyuu text-chocolate min-w-[140px]"
          >
            <option value="">所有批次</option>
            {batchStats.map(b => <option key={b.batchId} value={b.batchId}>{b.batchId}</option>)}
          </select>
          <select 
            value={filterStatus} 
            onChange={e => {setFilterStatus(e.target.value); setPage(1); setSearchQuery('');}}
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
              onChange={e => {setFilterStartDate(e.target.value); setPage(1); setSearchQuery('');}}
              className="bg-transparent outline-none font-genjyuu text-chocolate w-32"
            />
            <span className="text-chocolate/30">-</span>
            <input 
              type="date" 
              value={filterEndDate} 
              onChange={e => {setFilterEndDate(e.target.value); setPage(1); setSearchQuery('');}}
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
  )
}
