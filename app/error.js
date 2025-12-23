'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Page Error:', error);
    }, [error]);

    return (
        <div className="container section-padding text-center">
            <h2>Đã xảy ra lỗi!</h2>
            <p className="mb-4">Chúng tôi không thể tải nội dung bạn yêu cầu.</p>

            <div className="bg-gray-100 p-4 rounded mb-4 inline-block text-left">
                <p className="text-red-500 font-mono text-sm">{error.message}</p>
                {error.digest && <p className="text-gray-400 text-xs mt-1">Digest: {error.digest}</p>}
            </div>

            <div>
                <button
                    onClick={
                        // Attempt to recover by trying to re-render the segment
                        () => reset()
                    }
                    className="btn btn-primary"
                >
                    Thử lại
                </button>
            </div>
        </div>
    );
}
