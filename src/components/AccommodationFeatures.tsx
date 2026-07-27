import { Wifi, Snowflake, Waves, Car, Droplets } from 'lucide-react';

const FEATURE_ICONS: Record<string, { icon: typeof Wifi; label: string }> = {
  wifi:    { icon: Wifi,       label: 'Wi-Fi' },
  clim:    { icon: Snowflake,  label: 'Climatisation' },
  vue_mer: { icon: Waves,      label: 'Vue mer' },
  parking: { icon: Car,        label: 'Parking' },
  piscine: { icon: Droplets,   label: 'Piscine' },
};

export function AccommodationFeatures({ features }: { features: string[] }) {
  return (
    <div className="flex flex-wrap gap-3 mt-4">
      {features.map((f) => {
        const item = FEATURE_ICONS[f];
        if (!item) return null;
        const Icon = item.icon;
        return (
          <div
            key={f}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-ocean-pale px-2.5 py-1.5 rounded-lg"
            title={item.label}
          >
            <Icon className="w-4 h-4 text-ocean" />
            {item.label}
          </div>
        );
      })}
    </div>
  );
}

export { FEATURE_ICONS };
