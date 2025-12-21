import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaYoutube, FaLeaf, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer id="contact">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-col">
                        <Link href="/" className="logo footer-logo">
                            <FaLeaf /> Thái Nguyên<span>Tea</span>
                        </Link>
                        <p>Tinh hoa trà Việt - Hương vị của đất trời.</p>
                    </div>

                    <div className="footer-col">
                        <h3>Liên Hệ</h3>
                        <p><span style={{ width: 20, display: 'inline-block' }}><FaMapMarkerAlt /></span> Tân Cương, Thái Nguyên</p>
                        <p><span style={{ width: 20, display: 'inline-block' }}><FaPhone /></span> 0987 654 321</p>
                        <p><span style={{ width: 20, display: 'inline-block' }}><FaEnvelope /></span> contact@thainguyentea.vn</p>
                    </div>

                    <div className="footer-col">
                        <h3>Kết Nối</h3>
                        <div className="social-links">
                            <a href="#" className="social-icon"><FaFacebookF /></a>
                            <a href="#" className="social-icon"><FaInstagram /></a>
                            <a href="#" className="social-icon"><FaYoutube /></a>
                        </div>
                    </div>
                </div>

                <div className="copyright">
                    <p>&copy; 2024 Thai Nguyen Tea. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
