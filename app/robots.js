export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/admin/',
        },
        sitemap: 'https://thai-nguyen-tea.vercel.app/sitemap.xml',
    }
}
