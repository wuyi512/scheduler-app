import { useState } from 'react';
import type { Schedule } from '../services/scheduleService';

interface ScheduleFormProps {
    onSubmit: (schedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>) => void;
    onCancel: () => void;
    initialData?: Schedule;
}

const ScheduleForm = ({ onSubmit, onCancel, initialData }: ScheduleFormProps) => {
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
    const [startTime, setStartTime] = useState(initialData?.startTime || '');
    const [endTime, setEndTime] = useState(initialData?.endTime || '');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(initialData?.priority || 'medium');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            alert('请输入日程标题');
            return;
        }

        console.log('Form submitted with data:', {
            title: title.trim(),
            description: description.trim() || undefined,
            date,
            startTime: startTime || undefined,
            endTime: endTime || undefined,
            priority,
            completed: initialData?.completed || false
        });

        onSubmit({
            title: title.trim(),
            description: description.trim() || undefined,
            date,
            startTime: startTime || undefined,
            endTime: endTime || undefined,
            priority,
            completed: initialData?.completed || false
        });
    };

    return (
        <div className="schedule-form-overlay">
            <div className="schedule-form">
                <h2>{initialData ? '编辑日程' : '新建日程'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">标题 *</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="输入日程标题"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">描述</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="输入日程描述（可选）"
                            rows={3}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="date">日期 *</label>
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="startTime">开始时间</label>
                            <input
                                type="time"
                                id="startTime"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="endTime">结束时间</label>
                            <input
                                type="time"
                                id="endTime"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="priority">优先级</label>
                        <select
                            id="priority"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                        >
                            <option value="low">低</option>
                            <option value="medium">中</option>
                            <option value="high">高</option>
                        </select>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onCancel} className="btn-cancel">
                            取消
                        </button>
                        <button type="submit" className="btn-submit">
                            {initialData ? '保存' : '创建'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ScheduleForm;
