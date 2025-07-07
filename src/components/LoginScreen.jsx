import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { gerarHash } from '../utils/crypto';

const LoginScreen = () => {
  const [agenciaSelecionada, setAgenciaSelecionada] = useState('');
  const [senha, setSenha] = useState('');
  const [agenciasCadastradas, setAgenciasCadastradas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const lista = JSON.parse(localStorage.getItem('agencias')) || [];
    setAgenciasCadastradas(lista);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    const senhaHash = gerarHash(senha);

    const dados = agenciasCadastradas.find(
      (a) => a.agencia === agenciaSelecionada && a.senha === senhaHash
    );

    if (dados) {
      // 🔧 Agora salvando tempoAntecipacao corretamente
      localStorage.setItem(
        'agenciaAtiva',
        JSON.stringify({
          agencia: dados.agencia,
          tempoAntecipacao: dados.tempoAntecipacao || 10
        })
      );
      navigate('/painel');
    } else {
      alert('Agência ou senha incorreta.');
    }
  };

  return (
    <div
      style={{
        padding: '20px',
        paddingBottom: '80px',
        minHeight: '100vh',
        backgroundColor: '#d0e6ff',
        boxSizing: 'border-box'
      }}
    >
      <Header />
      <h2>🔐 Login da Agência</h2>

      {agenciasCadastradas.length === 0 ? (
        <>
          <p>Nenhuma agência cadastrada ainda.</p>
          <button onClick={() => navigate('/cadastro')}>Cadastrar Primeira Agência</button>
        </>
      ) : (
        <form onSubmit={handleLogin}>
          <label>Agência:</label>
          <select
            value={agenciaSelecionada}
            onChange={(e) => setAgenciaSelecionada(e.target.value)}
          >
            <option value="">-- Selecione uma agência --</option>
            {agenciasCadastradas.map((a) => (
              <option key={a.agencia} value={a.agencia}>
                {a.agencia}
              </option>
            ))}
          </select>

          <br /><br />

          <label>Senha:</label>
          <input
            type="password"
            value={senha}
            maxLength={6}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha (6 dígitos)"
            autoComplete="current-password"
          />

          <br /><br />
          <button type="submit">Entrar</button>{' '}
          <button onClick={() => navigate('/cadastro')} type="button">
            Cadastrar Nova Agência
          </button>
        </form>
      )}

      <Footer />
    </div>
  );
};

export default LoginScreen;
