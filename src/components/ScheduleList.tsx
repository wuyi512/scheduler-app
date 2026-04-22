import type { Schedule } from '../services/scheduleService';

interface ScheduleListProps {
    schedules: Schedule[];
    onEdit: (schedule: Schedule) => void;
    onDelete: (id: number) => void;
    onToggleComplete: (id: number) => void;
}

const ScheduleList = ({ schedules, onEdit, onDelete, onToggleComplete }: ScheduleListProps) => {
    const getPriorityColor = (priority?: string) => {
        switch (priority) {
            case 'high': return '#ff4757';
            case 'medium': return '#ffa502';
            case 'low': return '#2ed573';
            default: return '#ffa502';
        }
    };

    const getPriorityLabel = (priority?: string) => {
        switch (priority) {
            case 'high': return '高';
            case 'medium': return '中';
            case 'low': return '低';
            default: return '中';
        }
    };

    if (schedules.length === 0) {
        return (
            <div className="empty-state">
                <p>暂无日程安排</p>
            </div>
        );
    }

    return (
        <div className="schedule-list">
            {schedules.map((schedule) => (
                <div
                    key={schedule.id}
                    className={`schedule-item ${schedule.completed ? 'completed' : ''}`}
                >
                    <div className="schedule-header">
                        <div className="schedule-title-section">
                            <input
                                type="checkbox"
                                checked={schedule.completed || false}
                                onChange={() => schedule.id && onToggleComplete(schedule.id)}
                                className="complete-checkbox"
                            />
                            <h3 className={`schedule-title ${schedule.completed ? 'completed-text' : ''}`}>
                                {schedule.title}
                            </h3>
                        </div>
                        <div className="schedule-actions">
                            <button
                                onClick={() => onEdit(schedule)}
                                className="btn-edit"
                                title="编辑"
                            >
                                ✏️
                            </button>
                            <button
                                onClick={() => schedule.id && onDelete(schedule.id)}
                                className="btn-delete"
                                title="删除"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>

                    {schedule.description && (
                        <p className="schedule-description">{schedule.description}</p>
                    )}

                    <div className="schedule-meta">
                        <div className="schedule-date">
                            📅 {schedule.date}
                        </div>
                        {(schedule.startTime || schedule.endTime) && (
                            <div className="schedule-time">
                                ⏰ {schedule.startTime || '--:--'} - {schedule.endTime || '--:--'}
                            </div>
                        )}
                        <div
                            className="schedule-priority"
                            style={{ backgroundColor: getPriorityColor(schedule.priority) }}
                        >
                            {getPriorityLabel(schedule.priority)}优先级
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ScheduleList;
