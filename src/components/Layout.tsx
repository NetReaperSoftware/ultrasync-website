import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Activity, Menu, X } from 'lucide-react';

const APP_STORE_URL = 'https://apps.apple.com/us/app/fitsync-fitness-tracker/id6749923790';

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `font-medium transition-colors ${isActive ? 'text-teal-600' : 'text-slate-600 hover:text-slate-900'}`;

  return (
    <div className="min-h-screen flex flex-col">
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHome ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">UltraSync</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <NavLink to="/about" className={navLinkClass}>About</NavLink>
              <a href="/#features" className="font-medium text-slate-600 hover:text-slate-900 transition-colors">Features</a>
              <NavLink to="/faq" className={navLinkClass}>FAQ</NavLink>
              <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Download
              </a>
            </div>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden bg-white rounded-2xl shadow-xl mt-2 mb-2 p-4">
              <div className="flex flex-col gap-3">
                <NavLink to="/about" className={navLinkClass}>About</NavLink>
                <a href="/#features" className="font-medium text-slate-600 hover:text-slate-900 transition-colors py-1">Features</a>
                <NavLink to="/faq" className={navLinkClass}>FAQ</NavLink>
                <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
                <a
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full font-semibold text-center mt-1"
                >
                  Download
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">UltraSync</span>
              </Link>
              <p className="text-slate-400 leading-relaxed text-sm">
                The revolutionary all-in-one fitness platform for tracking workouts, nutrition, and health.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/#features" className="text-slate-400 hover:text-white transition-colors">Features</a></li>
                <li>
                  <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                    Download
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="text-slate-400 hover:text-white transition-colors">About UltraSync</Link></li>
                <li><Link to="/about-creator" className="text-slate-400 hover:text-white transition-colors">About the Creator</Link></li>
                <li><Link to="/contact" className="text-slate-400 hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/faq" className="text-slate-400 hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/privacy-policy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-of-use" className="text-slate-400 hover:text-white transition-colors">Terms of Use</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
            &copy; 2025 UltraSync. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
