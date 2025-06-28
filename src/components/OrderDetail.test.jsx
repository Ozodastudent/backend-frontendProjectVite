import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OrderDetail from './OrderDetail.jsx';
import axios from 'axios';

jest.mock('axios');

describe('OrderDetail Component', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: { id: 1, material_type: 'Sand', volume: 50, location: 'Site A', status: 'pending' },
    });
    localStorage.setItem('token', 'fake-token-123');
  });

  it('renders loading state initially', () => {
    render(
      <MemoryRouter initialEntries={['/orders/1']}>
        <OrderDetail />
      </MemoryRouter>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders order details after loading', async () => {
    render(
      <MemoryRouter initialEntries={['/orders/1']}>
        <OrderDetail />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByText('Order Detail #1')).toBeInTheDocument(), { timeout: 200 });
  });
});