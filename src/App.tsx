import { useState, useEffect } from 'react'
import { initDB } from './utils/db'
import { scheduleService, type Schedule } from './services/scheduleService'
import ScheduleList from './components/ScheduleList'
import ScheduleForm from './components/ScheduleForm'
import './App.css'

function App() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | undefined>()
  // 默认使用当天日期
  const [filterDate, setFilterDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(true)

  // 初始化数据库并加载日程
  useEffect(() => {
    const init = async () => {
      try {
        await initDB()
        loadSchedules()
      } catch (error) {
        console.error('Failed to initialize database:', error)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const loadSchedules = async () => {
    try {
      await initDB()
      const allSchedules = scheduleService.getAll()
      setSchedules(allSchedules)
    } catch (error) {
      console.error('Failed to load schedules:', error)
    }
  }

  const handleAddSchedule = async (scheduleData: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('Adding schedule:', scheduleData)

      // 确保数据库已初始化
      await initDB()

      scheduleService.add(scheduleData)
      loadSchedules()
      setShowForm(false)
      console.log('Schedule added successfully')
    } catch (error) {
      console.error('Failed to add schedule:', error)
      const errorMessage = error instanceof Error ? error.message : '未知错误'
      alert(`创建日程失败：${errorMessage}\n\n请查看控制台获取详细信息`)
    }
  }

  const handleEditSchedule = async (scheduleData: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingSchedule?.id) {
      try {
        await initDB()
        scheduleService.update(editingSchedule.id, scheduleData)
        loadSchedules()
        setShowForm(false)
        setEditingSchedule(undefined)
      } catch (error) {
        console.error('Failed to update schedule:', error)
        const errorMessage = error instanceof Error ? error.message : '未知错误'
        alert(`更新日程失败：${errorMessage}`)
      }
    }
  }

  const handleDeleteSchedule = async (id: number) => {
    if (confirm('确定要删除这个日程吗？')) {
      try {
        await initDB()
        scheduleService.delete(id)
        loadSchedules()
      } catch (error) {
        console.error('Failed to delete schedule:', error)
        alert('删除日程失败')
      }
    }
  }

  const handleToggleComplete = async (id: number) => {
    try {
      await initDB()
      scheduleService.toggleComplete(id)
      loadSchedules()
    } catch (error) {
      console.error('Failed to toggle complete:', error)
      alert('更新状态失败')
    }
  }

  const handleEditClick = (schedule: Schedule) => {
    setEditingSchedule(schedule)
    setShowForm(true)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingSchedule(undefined)
  }

  const filteredSchedules = filterDate
    ? schedules.filter(s => s.date === filterDate)
    : schedules

  if (loading) {
    return <div className="loading">加载中...</div>
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>📅 日程管理</h1>
        <button onClick={() => setShowForm(true)} className="btn-add">
          + 新建日程
        </button>
      </header>

      <div className="app-content">
        <div className="filter-section">
          <label htmlFor="filter-date">筛选日期：</label>
          <input
            type="date"
            id="filter-date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
          {filterDate && (
            <button onClick={() => setFilterDate('')} className="btn-clear-filter">
              清除筛选
            </button>
          )}
        </div>

        <ScheduleList
          schedules={filteredSchedules}
          onEdit={handleEditClick}
          onDelete={handleDeleteSchedule}
          onToggleComplete={handleToggleComplete}
        />
      </div>

      {showForm && (
        <ScheduleForm
          onSubmit={editingSchedule ? handleEditSchedule : handleAddSchedule}
          onCancel={handleCancelForm}
          initialData={editingSchedule}
        />
      )}
    </div>
  )
}

export default App
