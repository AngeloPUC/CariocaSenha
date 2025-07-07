import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

const setores = ['VAREJO', 'GERENCIA', 'CAIXAS', 'PENHOR', 'EXPRESSO', 'ATENDIMENTO'];

const ChamadaPainel = () => {
  const [mesa, setMesa] = useState('');
  const [setorOperante, setSetorOperante] = useState('');
  const [senhasPendentes, setSenhasPendentes] = useState([]);
  const [ultimaChamada, setUltimaChamada] = useState(null);

  const carregarPendentes = (setor) => {
    const lista = JSON.parse(localStorage.getItem('senhasAgencia')) || [];
    const pendentes = lista.filter(
      (s) => !s.dataAtendimento && s.setor === setor
    );
    setSenhasPendentes(pendentes);
  };

  useEffect(() => {
    if (setorOperante) {
      carregarPendentes(setorOperante);
    }
  }, [setorOperante]);

  const chamarProxima = () => {
    if (!mesa || mesa.length !== 2 || !setorOperante) {
      alert('Informe a mesa (2 dígitos) e o setor antes de chamar.');
      return;
    }

    if (senhasPendentes.length === 0) {
      alert('Nenhuma senha pendente para este setor.');
      return;
    }

    const agora = new Date().toISOString();
    const chamada = {
      ...senhasPendentes[0],
      dataAtendimento: agora,
      mesaAtendimento: mesa
    };

    const historico = JSON.parse(localStorage.getItem('senhasAgencia')) || [];
    const atualizado = historico.map((s) =>
      s.codigoSenha === chamada.codigoSenha && s.dataEmissao === chamada.dataEmissao
        ? chamada
        : s
    );
    localStorage.setItem('senhasAgencia', JSON.stringify(atualizado));

    setUltimaChamada(chamada);
    carregarPendentes(setorOperante);
  };

  return (
    <div
      style={{
        padding: '20px',
        paddingBottom: '80px',
        minHeight: '100vh',
        backgroundColor: '#d0e6ff'
      }}
    >
      <Header />
      <h2>🧑‍💻 Painel de Chamada</h2>

      <label>Mesa (2 Dig):</label>
      <input
        maxLength={2}
        value={mesa}
        onChange={(e) => setMesa(e.target.value)}
        style={{ width: '50px', textAlign: 'center' }}
      />

      <br /><br />

      <label>Setor:</label>
      <select value={setorOperante} onChange={(e) => setSetorOperante(e.target.value)}>
        <option value="">-- Selecione o setor --</option>
        {setores.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <br /><br />
      <button onClick={chamarProxima}>Chamar Próxima Senha</button>

      {ultimaChamada && (
        <div style={{ marginTop: '20px' }}>
          <strong>📢 Última chamada:</strong> {ultimaChamada.codigoSenha} (Mesa {ultimaChamada.mesaAtendimento})
        </div>
      )}

      <h4 style={{ marginTop: '30px' }}>Senhas Pendentes do setor: {setorOperante || '--'}</h4>
      <ul>
        {senhasPendentes.map((s, index) => (
          <li key={index}>
            {s.codigoSenha} - emitida: {new Date(s.dataEmissao).toLocaleTimeString()}
          </li>
        ))}
      </ul>

      <Footer />
    </div>
  );
};

export default ChamadaPainel;
