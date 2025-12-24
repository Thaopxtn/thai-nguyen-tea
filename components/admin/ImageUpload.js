"use client";

import Script from 'next/script';
import { useEffect, useRef } from 'react';

const ImageUpload = ({ onUpload, multiple = false }) => {
    const cloudinaryRef = useRef();
    const widgetRef = useRef();

    useEffect(() => {
        // Just checking if script loaded is not enough, as window.cloudinary might be set later
        // We use the onLoad callback of Script component instead
    }, []);

    const handleOnLoad = () => {
        if (window.cloudinary) {
            cloudinaryRef.current = window.cloudinary;
            widgetRef.current = cloudinaryRef.current.createUploadWidget({
                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo', // Fallback to 'demo' if not set
                uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset',
                multiple: multiple,
                maxFiles: multiple ? 10 : 1,
                sources: ['local', 'url', 'camera'],
                clientAllowedFormats: ['image'],
                maxImageFileSize: 2000000, // 2MB
            }, function (error, result) {
                if (!error && result && result.event === "success") {
                    console.log('Done! Here is the image info: ', result.info);
                    onUpload(result.info.secure_url);
                }
            });
        }
    };

    const openWidget = (e) => {
        e.preventDefault(); // Prevent form submission
        if (widgetRef.current) {
            widgetRef.current.open();
        } else {
            alert('Widget chưa được tải. Vui lòng thử lại sau vài giây hoặc kiểm tra kết nối mạng.');
        }
    };

    return (
        <>
            <Script
                src="https://upload-widget.cloudinary.com/global/all.js"
                onLoad={handleOnLoad}
            />
            <button className="btn btn-primary" onClick={openWidget} style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                {multiple ? "Tải Nhiều Ảnh" : "Tải Ảnh Lên"}
            </button>
        </>
    );
};

export default ImageUpload;
