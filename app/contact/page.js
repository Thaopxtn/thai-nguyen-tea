export const metadata = {
    title: 'Liên Hệ - Trà Thái Nguyên',
};

export default function ContactPage() {
    return (
        <main className="section-padding page-section">
            <div className="container">
                <h1 className="section-title">Liên Hệ Với Chúng Tôi</h1>
                <p className="subtitle" style={{ marginBottom: '3rem' }}>Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn.</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>

                    {/* Contact Info */}
                    <div className="contact-info">
                        <div style={{ marginBottom: '2rem' }}>
                            <h3><i className="fas fa-map-marker-alt" style={{ marginRight: 10, color: 'var(--color-primary)' }}></i> Địa Chỉ</h3>
                            <p>Xóm Bá Vân 1, Xã Tân Cương, TP. Thái Nguyên, Tỉnh Thái Nguyên</p>
                        </div>
                        <div style={{ marginBottom: '2rem' }}>
                            <h3><i className="fas fa-phone" style={{ marginRight: 10, color: 'var(--color-primary)' }}></i> Điện Thoại</h3>
                            <p>093 693 8848</p>
                        </div>
                        <div style={{ marginBottom: '2rem' }}>
                            <h3><i className="fas fa-envelope" style={{ marginRight: 10, color: 'var(--color-primary)' }}></i> Email</h3>
                            <p>lethaopxtn@gmail.com</p>
                        </div>

                        <div className="map">
                            <iframe
                                src="https://maps.google.com/maps?q=21.518362,105.803743&hl=vi&z=14&output=embed"
                                width="100%"
                                height="250"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referencePolicy="no-referrer-when-downgrade">
                            </iframe>
                        </div>
                    </div>

                    {/* Form */}
                    <form style={{ background: 'white', padding: '2rem', borderRadius: 8, boxShadow: 'var(--shadow-sm)' }}>
                        <div className="mb-1">
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Họ và tên</label>
                            <input type="text" className="qty-input" style={{ width: '100%', borderRadius: 4 }} required />
                        </div>
                        <div className="mb-1">
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Số điện thoại</label>
                            <input type="tel" className="qty-input" style={{ width: '100%', borderRadius: 4 }} required pattern="[0-9]{10,11}" placeholder=" " />
                        </div>
                        <div className="mb-1">
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Chủ đề</label>
                            <input type="text" className="qty-input" style={{ width: '100%', borderRadius: 4 }} required />
                        </div>
                        <div className="mb-1">
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nội dung</label>
                            <textarea className="qty-input" rows="5" style={{ width: '100%', borderRadius: 4 }} required></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Gửi Tin Nhắn</button>
                    </form>
                </div>
            </div>
        </main>
    );
}
