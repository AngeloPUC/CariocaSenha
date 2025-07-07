import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { gerarHash } from '../utils/crypto';
import { supabase } from '../supabaseClient';

const CadastroAgencia = () => {
  const [agencia, setAgencia] = useState('');
  const [senha, setSenha] = useState('');
  const [tempoAntecipacao, setTempoAntecipacao] = useState(10);
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    if (!agencia || !senha) {
      alert('Preencha todos os campos.');
      return;
    }

    const senhaCriptografada = gerarHash(senha);

    // Verifica se a agência já existe no Supabase
    const { data: existentes, error: erroBusca } = await supabase
      .from('agencias')
      .select('agencia')
      .eq('agencia', agencia);

    if (erroBusca) {
      alert('Erro ao verificar agências existentes.');
      console.error(erroBusca);
      return;
    }

    if (existentes.length > 0) {
      alert('Essa agência já está cadastrada.');
      return;
    }

    // Salva a nova agência no Supabase
    const { error: erroInsert } = await supabase.from('agencias').insert([
      {
        agencia,
        senha: senhaCriptografada,
        tempoAntecipacao: parseInt(tempoAntecipacao) || 10
      }
    ]);

    if (erroInsert) {
      alert('Erro ao cadastrar agência no banco.');
      console.error(erroInsert);
      return;
    }

    // Seta a agência ativa local para navegação no sistema
    const novaAgencia = {
      agencia,
      tempoAntecipacao: parseInt(tempoAntecipacao) || 10
    };

    localStorage.setItem('agenciaAtiva', JSON.stringify(novaAgencia));
    alert('Agência cadastrada com sucesso!');
    navigate('/painel');
  };

  const excluirDadosDaAgencia = async () => {
    const ativa = JSON.parse(localStorage.getItem('agenciaAtiva'));
    if (!ativa?.agencia) {
      alert('Nenhuma agência ativa encontrada.');
      return;
    }

    const confirmar = window.confirm(
      `Deseja mesmo excluir TODAS as senhas da agência ${ativa.agencia}? Esta ação é irreversível.`
    );
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
