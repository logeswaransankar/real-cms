import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

interface SettingsContextType {
  settings: Record<string, string>;
  siteName: string;
  currency: string;
  contactEmail: string;
  contactPhone: string;
  officeAddress: string;
  formatPrice: (amount: number, curr?: string) => string;
  refreshSettings: () => Promise<void>;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Record<string, string>>({
    site_name: 'ELYSIAN ESTATES',
    site_tagline: 'Curated Architectural Masterpieces & Luxury Residences',
    default_currency: 'AED',
    currency_symbol: 'AED',
    contact_email: 'concierge@elysian-estates.com',
    contact_phone: '+971 4 800 ELYSIAN',
    office_address: 'Level 48, Boulevard Plaza Tower 1, Downtown Dubai, UAE',
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const data = await api.public.getSettings();
      if (data && Object.keys(data).length > 0) {
        setSettings((prev) => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.warn('Could not load dynamic settings from backend, using default luxury configuration', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const formatPrice = (amount: number, curr?: string) => {
    const activeCurrency = curr || settings.default_currency || 'AED';
    const formattedNum = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    }).format(amount);
    return `${activeCurrency} ${formattedNum}`;
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        siteName: settings.site_name || 'ELYSIAN ESTATES',
        currency: settings.default_currency || 'AED',
        contactEmail: settings.contact_email || 'concierge@elysian-estates.com',
        contactPhone: settings.contact_phone || '+971 4 800 ELYSIAN',
        officeAddress: settings.office_address || 'Level 48, Boulevard Plaza Tower 1, Downtown Dubai, UAE',
        formatPrice,
        refreshSettings: fetchSettings,
        loading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
