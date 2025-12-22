'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="container section-padding text-center">
            <h2>Đã xảy ra lỗi!</h2>
            <p className="mb-4 text-red-500">{error.message || "Lỗi không xác định"}</p>
            <p className="text-sm text-gray-500 mb-4">Mã lỗi: {error.digest}</p>
            <button
                className="btn btn-primary"
                onClick={() => reset()}
            >
                Thử lại
            </button>
        </div>
    );
}
