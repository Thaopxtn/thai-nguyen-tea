"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = (e) => {
        e.preventDefault();
        // Simple hardcoded check
        if (username === 'admin' && password === 'admin123') {
            setCookie('admin_auth', 'true', { maxAge: 60 * 60 * 24 }); // 1 day
            router.push('/admin');
        } else {
            setError('Sai tên đăng nhập hoặc mật khẩu');
        }
    };

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f0f2f5'
        }}>
            <form onSubmit={handleLogin} style={{
                background: 'white',
                padding: '2rem',
                borderRadius: 8,
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                width: '350px'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#0F4C3A' }}>Admin Login</h2>

                {error && <p style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}

                <div className="mb-1">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        style={{ width: '100%', padding: '10px', marginBottom: '1rem' }}
                    />
                </div>
                <div className="mb-1">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '10px', marginBottom: '1.5rem' }}
                    />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Đăng Nhập</button>
            </form>
        </div>
    );
}
