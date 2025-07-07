import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { gerarHash } from '../utils/crypto';

const CadastroAgencia = () => {
  const [agencia, setAgencia] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const cadastrar = () => {
    if (!agencia || !senha) {
      alert('Preencha todos os campos!');
      return;
    }

    const agencias = JSON.parse(localStorage.getItem('agencias')) || [];
    if (agencias.some((a) => a.agencia === agencia)) {
      alert('Agência já cadastrada!');
      return;
    }

    const senhaCriptografada = gerarHash(senha);
    const nova = { agencia, senha: senhaCriptografada };

    agencias.push(nova);
    localStorage.setItem('agencias', JSON.stringify(agencias));
    localStorage.setItem('agenciaAtiva', JSON.stringify({ agencia }));
    navigate('/painel');
  };

  return (
    <div style={{ padding: '20px', paddingBottom: '80px', minHeight: '100vh', backgroundColor: '#d0e6ff' }}>
      <Header />
      <h2>🏢 Cadastro de Agência</h2>
      <input
        placeholder="Número da Agência"
        value={agencia}
        onChange={(e) => setAgencia(e.target.value)}
      />
      <br /><br />
      <input
        placeholder="Senha"
        type="password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      <br /><br />
      <button onClick={cadastrar}>Cadastrar</button>
      <Footer />
    </div>
  );
};

export default CadastroAgencia;
