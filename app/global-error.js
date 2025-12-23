'use client';

export default function GlobalError({ error, reset }) {
    return (
        <html>
            <body>
                <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
                    <h2>Đã xảy ra lỗi nghiêm trọng</h2>
                    <p>Xin lỗi, hệ thống gặp sự cố không mong muốn.</p>
                    <button
                        onClick={() => reset()}
                        style={{
                            padding: '10px 20px',
                            marginTop: '20px',
                            cursor: 'pointer',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px'
                        }}
                    >
                        Thử lại
                    </button>
                    <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '5px', textAlign: 'left', display: 'inline-block' }}>
                        <small style={{ color: '#666' }}>Error: {error.message}</small>
                        <br />
                        <small style={{ color: '#999' }}>Digest: {error.digest}</small>
                    </div>
                </div>
            </body>
        </html>
    );
}
