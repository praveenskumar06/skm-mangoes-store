export default function Footer() {
  return (
    <footer className="bg-green-900 text-green-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-yellow-400 font-bold text-lg mb-2">🥭 SKM Mangoes</h3>
            <p className="text-sm">
              Premium seasonal mangoes delivered fresh from our farms in Tamil Nadu.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Delivery Zones</h4>
            <ul className="text-sm space-y-1">
              <li>Tamil Nadu</li>
              <li>Pondicherry</li>
              <li>Karnataka</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Contact</h4>
            <p className="text-sm">📞 +91 99999 99999</p>
            <p className="text-sm">📧 info@skmmangoes.com</p>
          </div>
        </div>
        <div className="border-t border-green-700 mt-6 pt-4 text-center text-sm">
          © {new Date().getFullYear()} SKM Mangoes. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
