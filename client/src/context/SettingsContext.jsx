import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';

const Ctx = createContext(null);
export const useSettings = () => useContext(Ctx);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get('/settings').then(setSettings).catch(() => setSettings({
      siteName: 'Vrindavan Hotel', tagline: '', phone: '', email: '',
      address: '', whatsapp: '', social: {}, mapEmbed: '',
    }));
  }, []);

  const refresh = async () => setSettings(await api.get('/settings'));

  return <Ctx.Provider value={{ settings, setSettings, refresh }}>{children}</Ctx.Provider>;
}
