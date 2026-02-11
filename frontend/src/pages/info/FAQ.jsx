import { useState } from 'react';

const faqs = [
  {
    category: '🛒 Ordering',
    questions: [
      {
        q: 'How do I order mangoes?',
        a: 'Browse our product catalog, select the mango variety you like, choose the quantity (minimum 3 KG per variety), add to cart, and proceed to checkout. Provide your delivery address and complete the payment.',
      },
      {
        q: 'What is the minimum order quantity?',
        a: 'The minimum order is 3 KG per variety. You can order different varieties in the same order, each with a minimum of 3 KG.',
      },
      {
        q: 'Can I order multiple varieties in one order?',
        a: 'Yes! You can mix and match different mango varieties in a single order. Each variety requires a minimum of 3 KG.',
      },
      {
        q: 'When is the mango season?',
        a: 'Mango season typically runs from March to July, with peak season being April to June. Premium varieties like Alphonso, Imam Pasand, and Malgova are available during this period. Check our website for current availability.',
      },
    ],
  },
  {
    category: '💳 Payment',
    questions: [
      {
        q: 'What payment methods are accepted?',
        a: 'We accept all major payment methods through Razorpay — UPI (Google Pay, PhonePe, Paytm), credit/debit cards, net banking, and wallets.',
      },
      {
        q: 'Is the payment secure?',
        a: 'Yes, all payments are processed through Razorpay, a PCI-DSS compliant payment gateway. Your card details are never stored on our servers.',
      },
      {
        q: 'Do you offer Cash on Delivery (COD)?',
        a: 'Currently, we do not offer COD as mangoes are perishable goods. All orders must be prepaid to ensure commitment and reduce wastage.',
      },
    ],
  },
  {
    category: '🚚 Shipping & Delivery',
    questions: [
      {
        q: 'Where do you deliver?',
        a: 'We currently deliver across Tamil Nadu, Pondicherry, and Bangalore. We plan to expand to more locations in the future.',
      },
      {
        q: 'How long does delivery take?',
        a: 'Orders are dispatched the same day or next day. Delivery typically takes 2-4 business days depending on your location.',
      },
      {
        q: 'How are the mangoes packed for shipping?',
        a: 'Each mango is individually wrapped and placed in cushioned corrugated trays inside sturdy boxes. This ensures zero damage during transit.',
      },
      {
        q: 'In what condition are mangoes shipped?',
        a: 'Mangoes are shipped in a semi-ripe (firm) condition so they can withstand transport. They will ripen naturally within 1-3 days after delivery. We include ripening instructions with every order.',
      },
      {
        q: 'Can I track my order?',
        a: 'Yes! Once your order is shipped, the courier name and tracking ID will be updated on your order page. You can track your shipment on the courier\'s website.',
      },
      {
        q: 'Is shipping free?',
        a: 'Shipping charges may apply based on your location and order size. Any delivery charges will be shown at checkout before you pay.',
      },
    ],
  },
  {
    category: '🥭 About Our Mangoes',
    questions: [
      {
        q: 'Are your mangoes organic?',
        a: 'We follow natural farming practices — using organic compost, manure, and neem-based pest control. We are 100% carbide-free and do not use any chemicals for ripening.',
      },
      {
        q: 'What mango varieties do you offer?',
        a: 'We offer premium varieties including Alphonso, Banganapalli, Malgova, Imam Pasand, Kesar, Totapuri, and more depending on seasonal availability.',
      },
      {
        q: 'Why are Salem/Tamil Nadu mangoes special?',
        a: 'Tamil Nadu\'s unique geography — rich mineral soil, good sunlight, and mountain-surrounded valleys — produces mangoes with exceptional sweetness, aroma, and flavor that are renowned across India.',
      },
    ],
  },
  {
    category: '🔄 Returns & Refunds',
    questions: [
      {
        q: 'What is your return/refund policy?',
        a: 'Since mangoes are perishable goods, we do not accept returns. However, if you receive damaged or spoiled mangoes, please contact us within 24 hours of delivery with photos, and we will resolve the issue.',
      },
      {
        q: 'What if I receive damaged mangoes?',
        a: 'Please take photos of the damaged mangoes and contact us within 24 hours of delivery via phone or email. We will arrange a replacement or refund based on the extent of damage.',
      },
    ],
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  let globalIndex = 0;

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Frequently Asked <span className="text-yellow-400">Questions</span>
          </h1>
          <p className="text-lg text-green-200">
            Everything you need to know about ordering mangoes from SKM Mangoes.
          </p>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          {faqs.map((section) => (
            <div key={section.category} className="mb-10">
              <h2 className="text-2xl font-bold text-green-800 mb-4">{section.category}</h2>
              <div className="space-y-3">
                {section.questions.map((faq) => {
                  const idx = globalIndex++;
                  const isOpen = openIndex === idx;
                  return (
                    <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggle(idx)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-green-50 transition"
                      >
                        <span className="font-medium text-gray-800">{faq.q}</span>
                        <span className={`text-green-600 text-xl transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                          ▼
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Still have questions */}
          <div className="mt-12 bg-yellow-50 rounded-xl p-8 text-center">
            <h3 className="text-xl font-bold text-green-800 mb-2">Still have questions?</h3>
            <p className="text-gray-600 mb-4">We're happy to help! Reach out to us anytime.</p>
            <a
              href="/contact"
              className="inline-block bg-green-700 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-800 transition"
            >
              Contact Us →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
