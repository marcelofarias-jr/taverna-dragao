import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

let mockJogos = [
  {
    id: 1,
    nome: "Catan",
    codigoBarras: "7896016582210",
    precoCusto: 89.9,
    precoVenda: 199.9,
    quantidade: 15,
    categoria: "Estratégia"
  },
  {
    id: 2,
    nome: "Ticket to Ride",
    codigoBarras: "7896016582227",
    precoCusto: 95.0,
    precoVenda: 219.5,
    quantidade: 8,
    categoria: "Família"
  }
];

export const server = setupServer(
  http.get('http://localhost:3000/api/jogos', () => {
    return HttpResponse.json(mockJogos);
  }),
  
  http.post('http://localhost:3000/api/jogos', async ({ request }) => {
    const novoJogo = await request.json();
    const jogoExistente = mockJogos.find(j => 
      j.codigoBarras && novoJogo.codigoBarras && 
      j.codigoBarras === novoJogo.codigoBarras
    );
    
    if (jogoExistente) {
      jogoExistente.quantidade += novoJogo.quantidade;
      return HttpResponse.json(jogoExistente);
    }
    
    const novoId = Math.max(...mockJogos.map(j => j.id)) + 1;
    const jogoComId = { ...novoJogo, id: novoId };
    mockJogos = [...mockJogos, jogoComId];
    return HttpResponse.json(jogoComId, { status: 201 });
  })
);