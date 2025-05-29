import { useState } from 'react';
import styles from './main.module.scss'

const initialData = [
  {
    "id": 1,
    "nome": "Catan",
    "codigoBarras": "7896016582210",
    "precoCusto": 89.90,
    "precoVenda": 199.90,
    "quantidade": 15,
    "categoria": "Estratégia"
  },
  {
    "id": 2,
    "nome": "Novo Jogo RPG 2024",
    "precoCusto": 120.00,
    "precoVenda": 249.90,
    "quantidade": 0,
    "categoria": "Pré-venda"
  }
];

const Main = () => {
  const [data, setData] = useState(initialData);
  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');
  const [custo, setCusto] = useState('');
  const [venda, setVenda] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [categoria, setCategoria] = useState('');
  
  const [categorias] = useState([
    'Ação', 'Aventura', 'RPG', 'Estratégia', 'Esportes', 
    'Corrida', 'Luta', 'Pré-venda', 'Outros'
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!nome || !custo || !venda || !quantidade || !categoria) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }
    
    if (parseFloat(venda) <= parseFloat(custo)) {
      alert('O preço de venda deve ser maior que o preço de custo');
      return;
    }

    const qtd = parseInt(quantidade);
    if (isNaN(qtd) || qtd < 0) {
      alert('Quantidade deve ser um número positivo');
      return;
    }

    if (categoria === 'Pré-venda') {
      const nomeExistente = data.find(jogo => 
        jogo.nome.toLowerCase() === nome.toLowerCase() && 
        jogo.categoria === 'Pré-venda'
      );
      
      if (nomeExistente) {
        alert('Já existe um produto em Pré-venda com este nome');
        return;
      }
      
      const novoJogo = {
        id: Math.max(...data.map(jogo => jogo.id)) + 1,
        nome,
        precoCusto: parseFloat(custo),
        precoVenda: parseFloat(venda),
        quantidade: qtd,
        categoria
      };
      
      setData([...data, novoJogo]);
      alert(`Pré-venda "${nome}" cadastrada com sucesso!`);
    } 
    else {
      if (!codigo) {
        alert('Para categorias diferentes de Pré-venda, o código de barras é obrigatório');
        return;
      }
      
      const jogoExistenteIndex = data.findIndex(jogo => 
        jogo.codigoBarras && jogo.codigoBarras === codigo
      );
      
      if (jogoExistenteIndex >= 0) {
        const novaData = [...data];
        novaData[jogoExistenteIndex] = {
          ...novaData[jogoExistenteIndex],
          quantidade: novaData[jogoExistenteIndex].quantidade + qtd
        };
        
        setData(novaData);
        alert(`Estoque de "${novaData[jogoExistenteIndex].nome}" atualizado para ${novaData[jogoExistenteIndex].quantidade} unidades`);
      } 
      else {
        const novoJogo = {
          id: Math.max(...data.map(jogo => jogo.id)) + 1,
          nome,
          codigoBarras: codigo,
          precoCusto: parseFloat(custo),
          precoVenda: parseFloat(venda),
          quantidade: qtd,
          categoria
        };
        
        setData([...data, novoJogo]);
        alert(`Jogo "${nome}" cadastrado com sucesso!`);
      }
    }
    
    setNome('');
    setCodigo('');
    setCusto('');
    setVenda('');
    setQuantidade(1);
    setCategoria('');
  };
  return (
    <section className={styles.content}>
      <h2>Cadastro de Jogos</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.fieldGroup}>
          <label htmlFor="name">Nome do jogo:</label>
          <input 
            type="text" 
            value={nome}
            id={'name'}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite o nome do jogo" 
            className={styles.field}
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="codigoBarras">Código de barras:</label>
          <input 
            type="text" 
            value={codigo}
            id={'codigoBarras'}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Digite o código de barras" 
            className={styles.field}
            disabled={categoria === 'Pré-venda'}
          />
          {categoria === 'Pré-venda' && (
            <small className={styles.hint}>Pré-venda não requer código de barras</small>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="precoCusto">Preço de custo:</label>
          <input 
            type="number" 
            id={'precoCusto'}
            value={custo}
            onChange={(e) => setCusto(e.target.value)}
            placeholder="Digite o preço de custo" 
            className={styles.field}
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="precoVenda">Preço de venda:</label>
          <input 
            type="number" 
            id={'precoVenda'}
            value={venda}
            onChange={(e) => setVenda(e.target.value)}
            placeholder="Digite o preço de venda" 
            className={styles.field}
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="quantidade">Quantidade:</label>
          <input 
            id={'quantidade'}
            type="number" 
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            placeholder="Digite a quantidade" 
            className={styles.field}
            min="0"
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label  htmlFor="categoriaSelect">Categoria:</label>
          <select
            id={'categoriaSelect'}
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className={styles.select}
            required
          >
            <option value="" className={styles.selectPlaceholder}>-- Selecione --</option>
            {categorias.map((cat, index) => (
              <option key={index} value={cat} className={styles.selectPlaceholder}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Adicionar</button>
      </form>

      <div className={styles.listaJogos}>
        <h3>Estoque Atual</h3>
        <table className={styles.estoqueTable}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Quantidade</th>
              <th>Código</th>
            </tr>
          </thead>
          <tbody>
            {data.map(jogo => (
              <tr key={jogo.id}>
                <td>{jogo.nome}</td>
                <td>{jogo.categoria}</td>
                <td>R$ {jogo.precoVenda.toFixed(2)}</td>
                <td>{jogo.quantidade}</td>
                <td>{jogo.codigoBarras || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Main;