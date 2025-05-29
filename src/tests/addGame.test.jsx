import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { server } from '../mocks/server'
import { rest } from 'msw'

describe('Testes de Integração - Cadastro de Jogos', () => {
  test('deve cadastrar novo jogo via API', async () => {
    render(<App />)
    const user = userEvent.setup()

    await user.type(screen.getByLabelText('Nome do jogo:'), 'Novo Jogo')
    await user.type(screen.getByLabelText('Código de barras:'), '7891234567890')
    await user.type(screen.getByLabelText('Preço de custo:'), '100')
    await user.type(screen.getByLabelText('Preço de venda:'), '200')
    await user.type(screen.getByLabelText('Quantidade:'), '5')
    await user.selectOptions(screen.getByLabelText('Categoria:'), 'Estratégia')
    
    await user.click(screen.getByText('Adicionar'))
    
    await waitFor(() => {
        expect(screen.getByText('Novo Jogo')).toBeInTheDocument()
        expect(screen.getByText('R$ 200.00')).toBeInTheDocument()
    })
  })

  test('deve atualizar estoque quando código existir', async () => {
    server.use(
      rest.post('http://localhost:3000/api/jogos', (req, res, ctx) => {
        return res(
          ctx.json({
            id: 1,
            nome: "Catan",
            codigoBarras: "7896016582210",
            precoCusto: 89.9,
            precoVenda: 199.9,
            quantidade: 16, // 15 + 1
            categoria: "Estratégia"
          })
        )
      })
    )

    render(<App />)
    const user = userEvent.setup()

    await user.type(screen.getByLabelText('Código de barras:'), '7896016582210')
    await user.type(screen.getByLabelText('Quantidade:'), '1')
    await user.click(screen.getByText('Adicionar'))
    
    await waitFor(() => {
      expect(screen.getByText('16')).toBeInTheDocument()
    })
  })
})