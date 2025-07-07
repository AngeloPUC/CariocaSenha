import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { gerarHash } from '../utils/crypto';

const CadastroAgencia = () => {
  const [agencia, setAgencia] = useState('');
  const [senha, setSenha] = useState('');
  const [tempoAntecipacao, setTempoAntecipacao] = useState(10);
  const [agenciasExistentes, setAgenciasExistentes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cadastradas = JSON.parse(localStorage.getItem('agencias')) || [];
    setAgenciasExistentes(cadastradas);
  }, []);

  const handleCadastro = (e) => {
    e.preventDefault();
    if (!agencia || !senha) {
      alert('Preencha todos os campos.');
      return;
    }

    const senhaCriptografada = gerarHash(senha);
    const novaAgencia = {
      agencia,
      senha: senhaCriptografada,
      tempoAntecipacao: parseInt(tempoAntecipacao) || 10
    };

    const atualizadas = [...agenciasExistentes, novaAgencia];
    localStorage.setItem('agencias', JSON.stringify(atualizadas));
    localStorage.setItem('agenciaAtiva', JSON.stringify(novaAgencia));

    alert('Agência cadastrada com sucesso!');
    navigate('/painel');
  };

  return (
    <div
      style={{
        padding: '20px',
        paddingBottom: '80px',
        minHeight: '100vh',
        backgroundColor: '#d0e6ff', // restaurado ao azul padrão
        boxSizing: 'border-box'
      }}
    >
      <Header />
      <h2>🏢 Cadastro de Agência</h2>

      <form onSubmit={handleCadastro} style={{ maxWidth: '320px', marginTop: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label>Agência:</label><br />
          <input
            type="text"
            value={agencia}
            onChange={(e) => setAgencia(e.target.value)}
            style={{ width: '100%', padding: '4px 8px', fontSize: '13px' }}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Senha:</label><br />
          <input
            type="password"
            maxLength={6}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            style={{ width: '100%', padding: '4px 8px', fontSize: '13px' }}
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Prioridade (min):</label><br />
          <input
            type="number"
            min="0"
            value={tempoAntecipacao}
            onChange={(e) => setTempoAntecipacao(e.target.value)}
            style={{ width: '100%', padding: '4px 8px', fontSize: '13px' }}
          />
        </div>

        <button type="submit" style={{ marginRight: '10px' }}>Cadastrar Agência</button>
        <button type="button" onClick={() => navigate('/')}>Voltar</button>
      </form>

      <Footer />
    </div>
  );
};

export default CadastroAgencia;
