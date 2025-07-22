import { FaLinkedin, FaGithub, FaEnvelope, FaArrowUp } from 'react-icons/fa';
import { Link } from "react-router-dom";

function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer
            style={{
                backgroundImage: "url('/images/footer.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'right',
                backgroundAttachment: 'fixed'
            }}
            className="text-white py-8 px-10 md:px-20 relative overflow-hidden"
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-[#2c3f2a]/50 backdrop-blur-xs z-0"></div>

            <div className="max-w-screen-xl mx-auto relative z-10">

                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-6 text-center md:text-left text-sm md:text-base">

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-base md:text-lg font-bold mb-3 pb-1 border-b-2 border-white inline-block">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link to="/" className="footer-link">Home</Link></li>
                            <li><Link to="/feedbacks" className="footer-link">Feedbacks</Link></li>
                            <li><Link to="/dashboard" className="footer-link">Dashboard</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-base md:text-lg font-bold mb-3 pb-1 border-b-2 border-white inline-block">Contact</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="mailto:kalpanagupta592004@email.com" className="footer-link">
                                    <FaEnvelope className="inline mr-2" />
                                    kalpanagupta592004@email.com
                                </a>
                            </li>
                            <li>
                                <a href="https://linkedin.com/in/kalpana-gupta-214526315" target="_blank" rel="noopener noreferrer" className="footer-link">
                                    <FaLinkedin className="inline mr-2" />
                                    LinkedIn
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com/kalpanaG2004" target="_blank" rel="noopener noreferrer" className="footer-link">
                                    <FaGithub className="inline mr-2" />
                                    GitHub
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-base md:text-lg font-bold mb-3 pb-1 border-b-2 border-white inline-block">Resources</h3>
                        <ul className="space-y-2">
                            <li><a href="https://ldce.ac.in" target="_blank" rel="noopener noreferrer" className="footer-link">College Website</a></li>
                            <li><Link to="/documentation.pdf" target="_blank" className="footer-link">Project Documentation</Link></li>
                            <li><Link to="/privacy-policy" className="footer-link">Privacy Policy</Link></li>
                            <li><Link to="/terms-of-use" className="footer-link">Terms of Use</Link></li>
                        </ul>
                    </div>

                </div>

                {/* Footer Credit */}
                <div className="relative z-10 text-center text-xs md:text-sm font-light text-white">
                    © {currentYear} Campus Connect | LDCE | Built with ❤️ by Kalpana Gupta
                </div>
            </div>

            {/* Back to Top Button */}
            <button
                onClick={scrollToTop}
                className="absolute bottom-1 right-1 bg-[#3A8F50] p-3 rounded-lg shadow-lg hover:bg-[#8CC866] transition-all cursor-pointer hover:scale-110"
                aria-label="Back to Top"
            >
                <FaArrowUp className="text-white text-lg" />
            </button>
        </footer>
    );
};

export default Footer;
