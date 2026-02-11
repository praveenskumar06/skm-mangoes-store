import { Link } from 'react-router-dom';

export default function AboutUs() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            About <span className="text-yellow-400">SKM Mangoes</span>
          </h1>
          <p className="text-lg text-green-200 max-w-2xl mx-auto">
            A family of mango farmers bringing the finest organic mangoes from Tamil Nadu to your doorstep.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-green-800 mb-4">🌳 Our Story</h2>
              <p className="text-gray-600 mb-4">
                SKM Mangoes is a family-owned business rooted in generations of mango farming in Tamil Nadu. 
                Our family has been growing and trading premium mangoes for decades, with deep knowledge 
                passed down through each generation.
              </p>
              <p className="text-gray-600 mb-4">
                What started as a small family orchard has grown into a trusted name for quality mangoes. 
                We started this online store to bring the authentic taste of Tamil Nadu mangoes directly 
                to mango lovers across South India.
              </p>
              <p className="text-gray-600">
                Every mango we sell is hand-picked from our own farms and partner orchards, ensuring 
                only the best quality reaches our customers.
              </p>
            </div>
            <div className="bg-yellow-50 rounded-2xl p-8 text-center">
              <div className="text-7xl mb-4">🥭</div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">Farm to Doorstep</h3>
              <p className="text-gray-600">
                No middlemen. Direct from our orchards in Tamil Nadu to your home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-green-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-2xl font-bold text-green-800 mb-3">Our Mission</h3>
              <p className="text-gray-600">
                To share the sweetness of Tamil Nadu's finest mangoes with every home. We are committed to 
                providing 100% naturally ripened, carbide-free mangoes at fair prices while supporting 
                local farmers and sustainable farming practices.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="text-4xl mb-3">👁️</div>
              <h3 className="text-2xl font-bold text-green-800 mb-3">Our Vision</h3>
              <p className="text-gray-600">
                To become Tamil Nadu's most trusted online mango store — known for quality, freshness, 
                and customer satisfaction. We envision expanding our reach while staying true to our 
                roots of organic and sustainable mango farming.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-10">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🌾', title: 'Support Farmers', desc: 'We work directly with local farmers, ensuring they receive fair prices for their produce.' },
              { icon: '✅', title: 'Quality First', desc: '100% carbide-free, naturally ripened mangoes. We never compromise on quality.' },
              { icon: '💛', title: 'Customer Love', desc: 'From careful packaging to doorstep delivery, every step is designed with you in mind.' },
            ].map((v) => (
              <div key={v.title} className="text-center p-6 rounded-xl bg-yellow-50">
                <div className="text-5xl mb-4">{v.icon}</div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">{v.title}</h3>
                <p className="text-gray-600 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-16 bg-yellow-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-10">What Makes Us Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: '🚫', text: 'No carbide or chemical ripening — ever' },
              { icon: '🌿', text: 'Organic farming practices with natural pest control' },
              { icon: '📦', text: 'Individual wrapping and cushioned packaging' },
              { icon: '🚚', text: 'Same-day or next-day dispatch for fresh delivery' },
              { icon: '⚖️', text: 'Honest weights — we give what we promise' },
              { icon: '🤝', text: 'Direct from farmer — no middlemen markup' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-white rounded-lg p-4 shadow-sm">
                <span className="text-2xl">{item.icon}</span>
                <p className="text-gray-700 font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-green-800 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to taste the best mangoes?</h2>
          <p className="text-green-200 mb-6">Order fresh, organic mangoes delivered to your doorstep.</p>
          <Link
            to="/products"
            className="inline-block bg-yellow-400 text-green-900 px-8 py-3 rounded-full font-bold hover:bg-yellow-300 transition-all"
          >
            Shop Now →
          </Link>
        </div>
      </section>
    </div>
  );
}
