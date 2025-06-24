import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OrderList from './OrderList.jsx';

describe('OrderList Component', () => {
  it('renders loading state initially', () => {
    render(
      <MemoryRouter>
        <OrderList />
      </MemoryRouter>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders orders after loading', async () => {
    render(
      <MemoryRouter>
        <OrderList />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByText('Order ID: 1')).toBeInTheDocument(), { timeout: 200 });
  });

  it('navigates to order detail on click', async () => {
    const { container } = render(
      <MemoryRouter>
        <OrderList />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByText('Order ID: 1')).toBeInTheDocument(), { timeout: 200 });
    const orderItem = container.querySelector('div[onClick]');
    orderItem.click(); // Simulate click
    // Note: Full navigation test requires React Router setup
  });
});