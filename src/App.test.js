import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the site header with brand name', () => {
  render(<App />);
  const brands = screen.getAllByText(/BetterEarthToday/i);
  expect(brands.length).toBeGreaterThanOrEqual(1);
});

test('renders navigation links', () => {
  render(<App />);
  const nav = screen.getByRole('navigation');
  expect(nav).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /^home$/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /^events$/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /^about$/i })).toBeInTheDocument();
});
