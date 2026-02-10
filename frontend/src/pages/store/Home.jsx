import { Link } from 'react-router-dom';
import SeasonBanner from '../../components/common/SeasonBanner';

export default function Home() {
  return (
    <div>
      <SeasonBanner />

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            🥭 Fresh Seasonal Mangoes
          </h1>
          <p className="text-xl text-green-200 mb-8 max-w-2xl mx-auto">
            Hand-picked premium mangoes from the finest orchards of Tamil Nadu,
            delivered fresh to your doorstep.
          </p>
          <Link
            to="/products"
            className="inline-block bg-yellow-400 text-green-900 px-8 py-3 rounded-lg text-lg font-bold hover:bg-yellow-300 transition shadow-lg"
          >
            Shop Mangoes →
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-12">
            Why SKM Mangoes?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🌿', title: 'Farm Fresh', desc: 'Directly sourced from organic farms in Tamil Nadu' },
              { icon: '📦', title: 'Careful Packaging', desc: 'Each mango is wrapped and cushioned for safe delivery' },
              { icon: '🚚', title: 'Fast Delivery', desc: 'Delivery across Tamil Nadu, Pondicherry & Karnataka' },
            ].map((f) => (
              <div key={f.title} className="text-center p-6 rounded-xl bg-green-50">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Varieties preview */}
      <section className="py-16 bg-yellow-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-green-800 mb-4">
            Premium Mango Varieties
          </h2>
          <p className="text-gray-600 mb-8">
            Alphonso, Banganapalli, Malgova, Imam Pasand and more seasonal favorites.
          </p>
          <Link
            to="/products"
            className="inline-block bg-green-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-800 transition"
          >
            View All Products
          </Link>
        </div>
      </section>
    </div>
  );
}
