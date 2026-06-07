import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SajuResult from './SajuResult';
import { computeSaju } from '../lib/saju';

vi.mock('../lib/log', () => ({ logResultView: vi.fn() }));

describe('<SajuResult>', () => {
  const data = computeSaju({
    calendar: 'solar',
    year: 1971,
    month: 11,
    day: 16,
    hour: 9,
    minute: 0,
    timeKnown: true,
    timezone: 'Asia/Seoul',
    longitude: 126.98,
  });

  it('shows the day-pillar romanization as the headline', () => {
    render(<SajuResult data={data} onReset={() => {}} />);
    // Headline is capitalized romanization, e.g. "Sinhae".
    const headline = screen.getByRole('heading', { level: 2 });
    expect(headline.textContent?.toLowerCase()).toBe(data.dayPillar.roman);
  });

  it('renders all four pillar labels', () => {
    render(<SajuResult data={data} onReset={() => {}} />);
    ['Year', 'Month', 'Day', 'Hour'].forEach((label) => {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    });
  });

  it('shows the privacy-respecting day boundary detail when expanded', () => {
    render(<SajuResult data={data} onReset={() => {}} />);
    expect(screen.getByText(/Your Day Pillar/i)).toBeInTheDocument();
  });
});
