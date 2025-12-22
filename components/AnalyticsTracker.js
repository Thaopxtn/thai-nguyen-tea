"use client";

import { useEffect } from 'react';

export default function AnalyticsTracker() {
    useEffect(() => {
        // Prevent tracking on localhost dev sometimes, or track everything? 
        // Let's track everything for now so user sees data.

        const trackVisit = async () => {
            // Basic Device Detection
            const userAgent = navigator.userAgent;
            let device = 'Desktop';
            if (/Mobi|Android/i.test(userAgent)) device = 'Mobile';
            else if (/iPad|Tablet/i.test(userAgent)) device = 'Tablet';

            // Try to get location (client-side simple lookup or just send blank)
            // Using a free public API for IP geo (optional, standard practice for simple demos)
            let city = 'Unknown';
            let country = 'Unknown';

            try {
                // Determine path
                const path = window.location.pathname;

                // Log visit
                await fetch('/api/analytics', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        device,
                        path,
                        city,
                        country
                    })
                });
            } catch (err) {
                // Silent fail
            }
        };

        // Only track once per session logic? Or every page load?
        // User asked for "visits" typically implies page views or sessions.
        // Let's tracking page views (every load).
        trackVisit();
    }, []);

    return null;
}
