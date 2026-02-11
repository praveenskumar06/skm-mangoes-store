import { useSeason } from '../../context/SeasonContext';

export default function SeasonBanner() {
  const { seasonActive, bannerText } = useSeason();

  if (seasonActive === null) return null;

  return seasonActive ? (
    <div className="bg-yellow-400 text-green-900 text-center py-2 font-semibold">
      🥭 {bannerText || 'Mango Season is LIVE! Order fresh mangoes now!'} 🥭
    </div>
  ) : (
    <div className="bg-red-100 text-red-800 text-center py-2 font-semibold">
      ⏳ Mango season is currently closed. Check back soon!
    </div>
  );
}
