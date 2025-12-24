"use client";

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

const ImageUpload = ({ onUpload, multiple = false }) => {
    const cloudinaryRef = useRef();
    const widgetRef = useRef();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Check if script is already loaded (e.g. from another component or navigation)
        if (window.cloudinary && !widgetRef.current) {
            initWidget();
        }
    }, []);

    const initWidget = () => {
        if (window.cloudinary && !widgetRef.current) {
            cloudinaryRef.current = window.cloudinary;
            widgetRef.current = cloudinaryRef.current.createUploadWidget({
                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo',
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
            setIsLoaded(true);
        }
    };

    const handleOnLoad = () => {
        initWidget();
    };

    const openWidget = (e) => {
        e.preventDefault();
        if (widgetRef.current) {
            widgetRef.current.open();
        } else {
            // Retry init if for some reason it wasn't ready
            if (window.cloudinary) {
                initWidget();
                // Brief timeout to let it init
                setTimeout(() => {
                    if (widgetRef.current) widgetRef.current.open();
                }, 100);
            } else {
                alert('Widget đang tải, vui lòng đợi thêm giây lát...');
            }
        }
    };

    return (
        <>
            <Script
                src="https://upload-widget.cloudinary.com/global/all.js"
                onLoad={handleOnLoad}
                onError={(e) => console.error("Cloudinary script failed to load", e)}
            />
            <button
                className={`btn btn-primary ${!isLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={openWidget}
                style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
            // We permit clicking even if not "loaded" state to trigger the retry logic in openWidget
            >
                {multiple ? "Tải Nhiều Ảnh" : "Tải Ảnh Lên"}
            </button>
        </>
    );
};

export default ImageUpload;
