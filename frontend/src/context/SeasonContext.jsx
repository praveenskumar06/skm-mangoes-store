import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const SeasonContext = createContext(null);

export function SeasonProvider({ children }) {
  const [seasonActive, setSeasonActive] = useState(null);

  const fetchSeason = () => {
    api.get('/settings/public')
      .then(({ data }) => setSeasonActive(data?.season_active === 'true'))
      .catch(() => setSeasonActive(false));
  };

  useEffect(() => { fetchSeason(); }, []);

  return (
    <SeasonContext.Provider value={{ seasonActive, refreshSeason: fetchSeason }}>
      {children}
    </SeasonContext.Provider>
  );
}

export const useSeason = () => useContext(SeasonContext);
