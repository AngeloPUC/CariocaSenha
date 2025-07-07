import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { gerarHash } from '../utils/crypto';
import { supabase } from '../supabaseClient';

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

  // 🔥 Essa função deve ser chamada a partir do botão "Excluir Dados" no menu
  const excluirDadosDaAgencia = async () => {
    const ativa = JSON.parse(localStorage.getItem('agenciaAtiva'));
    if (!ativa?.agencia) {
      alert('Nenhuma agência ativa encontrada.');
      return;
    }

    const confirmar = window.confirm(`Deseja mesmo excluir TODAS as senhas da agência ${ativa.agencia}? Esta ação é irreversível.`);
    if (!confirmar) return;

    const { error } = await supabase
      .from('senhas')
      .delete()
      .eq('agencia', ativa.agencia);

    if (error) {
      alert('Erro ao excluir dados no banco.');
      console.error(error);
    } else {
      alert(`Todas as senhas da agência ${ativa.agencia} foram apagadas do Supabase.`);
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
      <Header excluirDadosDaAgencia={excluirDadosDaAgencia} />
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
