import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OrderList from './OrderList.jsx';
import axios from 'axios';

jest.mock('axios');

describe('OrderList Component', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: { results: [{ id: 1, material_type: 'Sand', volume: 50, location: 'Site A', status: 'pending' }] },
    });
    localStorage.setItem('token', 'fake-token-123');
  });

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
});