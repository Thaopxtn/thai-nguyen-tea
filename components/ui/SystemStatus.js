'use client';

export default function SystemStatus({ isOffline }) {
    if (!isOffline) return null;

    return (
        <div style={{
            backgroundColor: '#ef4444',
            color: 'white',
            textAlign: 'center',
            padding: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999
        }}>
            ⚠️ Chế độ An toàn (Offline Mode): Không kết nối được Database. Đang hiển thị dữ liệu mẫu.
        </div>
    );
}
