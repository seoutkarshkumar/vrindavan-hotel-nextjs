import { MessageCircle, Phone } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function FloatingCTA() {
  const { settings } = useSettings();
  if (!settings) return null;
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {settings.whatsapp && (
        <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer"
           className="p-4 rounded-full bg-green-500 text-white shadow-soft hover:scale-110 transition" aria-label="WhatsApp">
          <MessageCircle size={22} />
        </a>
      )}
      {settings.phone && (
        <a href={`tel:${settings.phone}`}
           className="p-4 rounded-full bg-brand-600 text-white shadow-soft hover:scale-110 transition" aria-label="Call">
          <Phone size={22} />
        </a>
      )}
    </div>
  );
}
