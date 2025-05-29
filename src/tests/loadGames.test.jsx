import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { server } from '../mocks/server';
import { beforeAll, afterAll, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Testes de Carregamento de Jogos', () => {
  test('deve carregar jogos da API ao iniciar', async () => {
    server.use(
      http.get('http://localhost:3000/api/jogos', () => {
        return HttpResponse.json([
          {
            id: 1,
            nome: "Catan",
            codigoBarras: "7896016582210",
            precoCusto: 89.9,
            precoVenda: 199.9,
            quantidade: 15,
            categoria: "Estratégia"
          }
        ]);
      })
    );

    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Catan')).toBeInTheDocument();
      expect(screen.getByText('R$ 199.90')).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
    });
  });

  test('deve mostrar mensagem de erro quando falhar o carregamento', async () => {
    server.use(
      http.get('http://localhost:3000/api/jogos', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar jogos')).toBeInTheDocument();
    });
  });
});