import { Link } from 'react-router-dom';
import { STORE_NAME, STORE_PHONE, STORE_EMAIL, BUSINESS_HOURS_SHORT, SOCIAL_LINKS } from '../../constants';

export default function Footer() {
  return (
    <footer className="bg-green-900 text-green-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-yellow-400 font-bold text-lg mb-3">🥭 {STORE_NAME}</h3>
            <p className="text-sm">
              Premium seasonal mangoes delivered fresh from our organic farms in Tamil Nadu.
            </p>
            <p className="text-sm mt-2">100% Carbide-free • Naturally ripened</p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Quick Links</h4>
            <ul className="text-sm space-y-2">
              <li><Link to="/products" className="hover:text-yellow-400 transition">Shop Mangoes</Link></li>
              <li><Link to="/mango-tips" className="hover:text-yellow-400 transition">Mango Tips & Guide</Link></li>
              <li><Link to="/about" className="hover:text-yellow-400 transition">About Us</Link></li>
              <li><Link to="/faq" className="hover:text-yellow-400 transition">FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Contact Us</h4>
            <ul className="text-sm space-y-2">
              <li>📞 {STORE_PHONE}</li>
              <li>📧 {STORE_EMAIL}</li>
              <li>🕐 {BUSINESS_HOURS_SHORT}</li>
            </ul>
            <Link
              to="/contact"
              className="inline-block mt-3 text-yellow-400 hover:text-yellow-300 text-sm font-semibold transition"
            >
              Send us a message →
            </Link>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Follow Us</h4>
            <div className="flex flex-wrap gap-3 mb-4">
              {SOCIAL_LINKS.instagram && (
                <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 bg-green-800 hover:bg-pink-600 rounded-full flex items-center justify-center text-lg transition" title="Instagram">
                  📸
                </a>
              )}
              {SOCIAL_LINKS.youtube && (
                <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 bg-green-800 hover:bg-red-600 rounded-full flex items-center justify-center text-lg transition" title="YouTube">
                  ▶️
                </a>
              )}
              {SOCIAL_LINKS.facebook && (
                <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 bg-green-800 hover:bg-blue-600 rounded-full flex items-center justify-center text-lg transition" title="Facebook">
                  📘
                </a>
              )}
              {SOCIAL_LINKS.whatsapp && (
                <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 bg-green-800 hover:bg-green-500 rounded-full flex items-center justify-center text-lg transition" title="WhatsApp">
                  💬
                </a>
              )}
              {SOCIAL_LINKS.googleMaps && (
                <a href={SOCIAL_LINKS.googleMaps} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 bg-green-800 hover:bg-blue-500 rounded-full flex items-center justify-center text-lg transition" title="Our Location">
                  📍
                </a>
              )}
            </div>
            <p className="text-xs text-green-400">Delivery across Tamil Nadu, Pondicherry & Karnataka</p>
          </div>
        </div>

        <div className="border-t border-green-700 mt-8 pt-4 text-center text-sm">
          © {new Date().getFullYear()} {STORE_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
