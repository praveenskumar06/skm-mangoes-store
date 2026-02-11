import { Link } from 'react-router-dom';
import { useSeason } from '../../context/SeasonContext';
import SeasonBanner from '../../components/common/SeasonBanner';
import { STORE_NAME } from '../../constants';

export default function Home() {
  const { seasonActive } = useSeason();

  return (
    <div>
      <SeasonBanner />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-green-700 via-green-800 to-green-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10 text-[200px] leading-none select-none pointer-events-none flex items-center justify-center">
          🥭🥭🥭
        </div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            SKM <span className="text-yellow-400">MANGOES</span>
          </h1>
          <p className="text-xl md:text-2xl text-green-200 mb-4 max-w-3xl mx-auto">
            Hand-picked, naturally ripened premium mangoes from the finest orchards — delivered fresh to your doorstep.
          </p>
          <p className="text-sm text-green-300 mb-8">
            🌱 100% Organic &nbsp;•&nbsp; 🧺 Min. 3 KG per variety &nbsp;•&nbsp; 💛 Carbide-free ripening
          </p>
          <Link
            to="/products"
            className="inline-block bg-yellow-400 text-green-900 px-10 py-4 rounded-full text-lg font-bold hover:bg-yellow-300 hover:scale-105 transition-all shadow-xl"
          >
            {seasonActive ? '🥭 Shop Fresh Mangoes →' : '👀 Browse Our Varieties →'}
          </Link>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-yellow-400 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-6 md:gap-12 text-green-900 font-semibold text-sm md:text-base">
          <span>✅ 100% Organic</span>
          <span>🚫 No Chemicals</span>
          <span>📦 Safe Packaging</span>
          <span>⭐ Premium Quality</span>
          <span>🔒 Secure Payment</span>
        </div>
      </section>

      {/* Why SKM Mangoes */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-4">
            Why Choose SKM Mangoes?
          </h2>
          <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
            We bring you the best of Indian mangoes — organically grown, hand-sorted, and delivered with care.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🌿', title: 'Farm Fresh & Organic', desc: 'Directly sourced from certified organic farms. No pesticides, no artificial ripening.' },
              { icon: '📦', title: 'Premium Packaging', desc: 'Each mango is individually wrapped and cushioned in corrugated trays for zero damage.' },
              { icon: '🚚', title: 'Doorstep Delivery', desc: 'We deliver across Tamil Nadu, Pondicherry & Bangalore with real-time tracking.' },
              { icon: '⚖️', title: 'Minimum 3 KG Order', desc: 'Order a minimum of 3 KG per variety to ensure freshness and value for money.' },
              { icon: '💳', title: 'Secure Payments', desc: 'Pay safely via UPI, cards, net banking or wallets through Razorpay.' },
              { icon: '🥭', title: 'Seasonal Freshness', desc: 'We operate only during mango season to guarantee peak ripeness and flavor.' },
            ].map((f) => (
              <div key={f.title} className="text-center p-6 rounded-xl bg-green-50 hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Zones */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">
            📍 Delivery Available In
          </h2>
          <p className="text-gray-500 mb-10">
            We currently deliver to the following regions. More locations coming soon!
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {[
              { name: 'Tamil Nadu', icon: '🏛️' },
              { name: 'Pondicherry', icon: '🏖️' },
              { name: 'Bangalore', icon: '🌆' },
            ].map((zone) => (
              <div
                key={zone.name}
                className="bg-white border-2 border-green-200 rounded-xl px-8 py-5 shadow-sm hover:border-green-500 hover:shadow-md transition-all"
              >
                <div className="text-3xl mb-2">{zone.icon}</div>
                <p className="font-semibold text-green-800 text-lg">{zone.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Varieties Preview */}
      <section className="py-16 bg-yellow-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">
            🥭 Premium Mango Varieties
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Alphonso, Banganapalli, Malgova, Imam Pasand, Kesar and more seasonal favorites — each variety hand-picked for quality.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {['Alphonso', 'Banganapalli', 'Malgova', 'Imam Pasand', 'Kesar', 'Totapuri'].map((v) => (
              <span key={v} className="bg-white text-green-800 border border-green-200 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                {v}
              </span>
            ))}
          </div>
          <Link
            to="/products"
            className="inline-block bg-green-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-800 hover:scale-105 transition-all shadow"
          >
            View All Products →
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', icon: '🔍', title: 'Browse', desc: 'Explore our seasonal mango varieties' },
              { step: '2', icon: '🛒', title: 'Add to Cart', desc: 'Select quantity (min 3 KG per variety)' },
              { step: '3', icon: '💳', title: 'Pay Securely', desc: 'Checkout via UPI, cards or net banking' },
              { step: '4', icon: '📦', title: 'Get Delivered', desc: 'Fresh mangoes at your doorstep!' },
            ].map((s) => (
              <div key={s.step} className="text-center relative">
                <div className="w-12 h-12 bg-yellow-400 text-green-900 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  {s.step}
                </div>
                <div className="text-3xl mb-2">{s.icon}</div>
                <h3 className="font-semibold text-green-800 mb-1">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-yellow-400 to-yellow-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">
            {seasonActive ? '🥭 Mango Season is ON!' : '🔔 Get Notified for Next Season'}
          </h2>
          <p className="text-green-800 text-lg mb-8">
            {seasonActive
              ? 'Order now and taste the best organic mangoes from South India.'
              : 'We\'ll be back with fresh mangoes soon. Stay tuned!'}
          </p>
          <Link
            to={seasonActive ? '/products' : '/register'}
            className="inline-block bg-green-800 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-green-700 hover:scale-105 transition-all shadow-xl"
          >
            {seasonActive ? 'Order Now →' : 'Create Account →'}
          </Link>
        </div>
      </section>
    </div>
  );
}
