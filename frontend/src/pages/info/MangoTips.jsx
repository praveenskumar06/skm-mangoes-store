export default function MangoTips() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Mango <span className="text-yellow-400">Tips & Guide</span>
          </h1>
          <p className="text-lg text-green-200">
            Everything you need to know about ripening, storing, cutting, and enjoying your mangoes.
          </p>
        </div>
      </section>

      {/* Why mangoes arrive raw */}
      <section className="py-12 bg-yellow-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center gap-6">
            <div className="text-6xl">📦</div>
            <div>
              <h2 className="text-xl font-bold text-green-800 mb-2">Why do mangoes arrive raw/semi-ripe?</h2>
              <p className="text-gray-600">
                We ship mangoes in a <strong>semi-ripe (firm and green) condition</strong> so they can withstand 
                transport vibrations without getting damaged. They will naturally ripen within 1-3 days after delivery. 
                This ensures you receive fresh, bruise-free mangoes at your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to ripen */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">🥭 How to Ripen Mangoes</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-green-800 mb-3">⚡ Faster Ripening</h3>
              <ol className="space-y-3 text-gray-600">
                <li className="flex gap-3">
                  <span className="bg-yellow-400 text-green-900 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0">1</span>
                  <span>Keep mangoes inside the box with the hay/newspaper wrapping</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-yellow-400 text-green-900 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0">2</span>
                  <span>Close the box and keep it in a warm, dry place (not in sunlight)</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-yellow-400 text-green-900 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0">3</span>
                  <span>You can also place mangoes in a paper bag with a banana to speed up ripening</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-yellow-400 text-green-900 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0">4</span>
                  <span>Check daily — mangoes should ripen in <strong>1-2 days</strong></span>
                </li>
              </ol>
            </div>

            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-green-800 mb-3">🐌 Slower Ripening</h3>
              <ol className="space-y-3 text-gray-600">
                <li className="flex gap-3">
                  <span className="bg-green-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0">1</span>
                  <span>Remove mangoes from the box and hay wrapping</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-green-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0">2</span>
                  <span>Keep them in an open, well-ventilated area at room temperature</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-green-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0">3</span>
                  <span>Do <strong>NOT</strong> keep near heat sources or in direct sunlight</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-green-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0">4</span>
                  <span>Mangoes will ripen slowly over <strong>3-5 days</strong></span>
                </li>
              </ol>
            </div>
          </div>

          {/* Pro Tip */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-5 flex items-start gap-4">
            <span className="text-3xl">💡</span>
            <div>
              <h4 className="font-semibold text-green-800 mb-1">Pro Tip</h4>
              <p className="text-gray-600 text-sm">
                Want to enjoy mangoes over several days? Keep half inside the box to ripen faster and half 
                outside to ripen slowly. This way you get a steady supply of perfectly ripe mangoes!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to identify ripe mango */}
      <section className="py-16 bg-green-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">✅ How to Know When a Mango is Ripe</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '👃', title: 'Aroma', desc: 'A ripe mango gives off a sweet, fruity fragrance near the stem.' },
              { icon: '🤏', title: 'Touch', desc: 'Gently press — a ripe mango gives slightly like a peach. Not too soft, not too firm.' },
              { icon: '🎨', title: 'Color', desc: 'Skin turns from green to yellow/orange, though color alone isn\'t the best indicator.' },
              { icon: '🔍', title: 'Skin', desc: 'Small wrinkles appear on the skin as the mango ripens. This is completely normal.' },
            ].map((sign) => (
              <div key={sign.title} className="bg-white rounded-xl p-5 text-center shadow-sm">
                <div className="text-4xl mb-3">{sign.icon}</div>
                <h3 className="font-semibold text-green-800 mb-1">{sign.title}</h3>
                <p className="text-gray-600 text-sm">{sign.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Storage */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">❄️ How to Store Mangoes</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border-2 border-green-200 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-green-700 mb-4">✅ Do's</h3>
              <ul className="space-y-3">
                {[
                  'Refrigerate only AFTER the mango is fully ripe',
                  'Ripe mangoes can last 4-5 days in the fridge',
                  'Store unripe mangoes at room temperature',
                  'Keep away from direct sunlight',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-600">
                    <span className="text-green-500 mt-0.5">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-2 border-red-200 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-red-600 mb-4">❌ Don'ts</h3>
              <ul className="space-y-3">
                {[
                  'Do NOT refrigerate unripe mangoes — it halts ripening permanently',
                  'Do NOT keep in air-conditioned rooms before ripening',
                  'Do NOT press too hard — it damages the flesh',
                  'Do NOT use plastic bags — mangoes need air circulation',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-600">
                    <span className="text-red-500 mt-0.5">✗</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How to Cut */}
      <section className="py-16 bg-yellow-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">🔪 How to Cut a Mango</h2>

          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm max-w-3xl mx-auto">
            <p className="text-gray-600 mb-6 text-center italic">
              "The best way to eat a mango is to wash, peel, and eat with your bare hands 😋"
            </p>

            <h3 className="font-semibold text-green-800 mb-4">If you prefer to slice:</h3>
            <ol className="space-y-4 text-gray-600">
              <li className="flex gap-3">
                <span className="bg-yellow-400 text-green-900 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0">1</span>
                <span><strong>Wash</strong> the mango under running water</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-yellow-400 text-green-900 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0">2</span>
                <span><strong>Stand upright</strong> — the seed runs vertically through the center</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-yellow-400 text-green-900 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0">3</span>
                <span><strong>Slice</strong> from top to bottom, about 1 cm from the center on each side (avoiding the flat seed)</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-yellow-400 text-green-900 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0">4</span>
                <span><strong>Score</strong> the flesh in a grid pattern without cutting through the skin</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-yellow-400 text-green-900 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0">5</span>
                <span><strong>Invert</strong> the cheek and scoop out the cubes with a spoon</span>
              </li>
            </ol>

            <div className="mt-6 p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-700">
                ⚠️ <strong>Tip:</strong> Don't cut too close to the seed — the flesh near the seed can be slightly sour or fibrous.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nutrition */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">💪 Mango Nutrition & Health Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '👁️', title: 'Eye Health', desc: 'Rich in Vitamin A and zeaxanthin, which protect against macular degeneration.' },
              { icon: '💪', title: 'Immunity Boost', desc: 'One cup of mango provides 100% of daily Vitamin C needs.' },
              { icon: '🦴', title: 'Bone Health', desc: 'Vitamin K in mangoes improves calcium absorption for stronger bones.' },
              { icon: '❤️', title: 'Heart Health', desc: 'Fiber, potassium, and vitamins help reduce risk of heart disease.' },
              { icon: '🧠', title: 'Digestion', desc: 'High fiber and water content promote a healthy digestive system.' },
              { icon: '✨', title: 'Skin & Hair', desc: 'Vitamin A promotes healthy skin and hair growth. Vitamin C builds collagen.' },
            ].map((b) => (
              <div key={b.title} className="bg-green-50 rounded-xl p-5 text-center">
                <div className="text-4xl mb-3">{b.icon}</div>
                <h3 className="font-semibold text-green-800 mb-1">{b.title}</h3>
                <p className="text-gray-600 text-sm">{b.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-yellow-50 rounded-xl p-6 max-w-2xl mx-auto text-center">
            <h3 className="font-bold text-green-800 mb-2">🥭 Nutrition per 100g of Mango</h3>
            <div className="grid grid-cols-4 gap-4 mt-4">
              {[
                { label: 'Calories', value: '60 kcal' },
                { label: 'Carbs', value: '15g' },
                { label: 'Fiber', value: '1.6g' },
                { label: 'Vitamin C', value: '36mg' },
              ].map((n) => (
                <div key={n.label}>
                  <p className="text-xl font-bold text-green-800">{n.value}</p>
                  <p className="text-xs text-gray-500">{n.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
