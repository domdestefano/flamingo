import React, { useEffect, useState } from 'react';
import theme from '@site/tokens/theme.json';

const STORAGE_KEY = 'flamingo-brand';
const DEFAULT_BRAND = 'foodora';

const brands = Object.entries(theme as Record<string, { name: string }>).map(
  ([slug, brand]) => ({ slug, name: brand.name })
);

export default function BrandSwitcher(): React.ReactElement {
  const [brand, setBrand] = useState(DEFAULT_BRAND);

  // Read the persisted brand on mount (client-only — localStorage/document
  // aren't available during SSR).
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const initial = stored && theme[stored] ? stored : DEFAULT_BRAND;
    setBrand(initial);
    document.documentElement.setAttribute('data-brand', initial);
  }, []);

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value;
    setBrand(next);
    document.documentElement.setAttribute('data-brand', next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <div className="flamingo-brand-switcher-wrapper">
      <span className="flamingo-brand-switcher-label" aria-hidden="true">
        🎨 Preview brand
      </span>
      <select
        value={brand}
        onChange={handleChange}
        aria-label="Preview a different brand"
        className="flamingo-brand-switcher"
      >
        {brands.map(({ slug, name }) => (
          <option key={slug} value={slug}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}
