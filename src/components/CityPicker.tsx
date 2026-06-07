import { useEffect, useRef, useState } from 'react';
import { type City, searchCities, flagEmoji } from '../data/cities';

interface Props {
  value: City | null;
  onChange: (city: City) => void;
}

export default function CityPicker({ value, onChange }: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);

  const results = searchCities(query);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  function select(city: City) {
    onChange(city);
    setQuery('');
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setOpen(true);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[active]) select(results[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div className="relative" ref={boxRef}>
      <input
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls="city-listbox"
        autoComplete="off"
        placeholder={value ? `${value.name}, ${value.country}` : 'Search a city…'}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActive(0);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        className={`w-full rounded-xl border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-ink/40 ${
          value && !query ? 'text-ink' : ''
        }`}
      />
      {value && !query && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm">
          <span className="mr-1">{flagEmoji(value.cc)}</span>
        </span>
      )}

      {open && results.length > 0 && (
        <ul
          id="city-listbox"
          role="listbox"
          className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-ink/15 bg-white shadow-lg"
        >
          {results.map((c, i) => (
            <li
              key={`${c.name}-${c.tz}-${c.lng}`}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                select(c);
              }}
              className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-sm ${
                i === active ? 'bg-ink/5' : ''
              }`}
            >
              <span>{flagEmoji(c.cc)}</span>
              <span className="font-medium">{c.name}</span>
              <span className="text-ink/40">{c.country}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
