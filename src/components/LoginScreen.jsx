import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { gerarHash } from '../utils/crypto';
import { supabase } from '../supabaseClient';

const LoginScreen = () => {
  const [agencias, setAgencias] = useState([]);
  const [agenciaSelecionada, setAgenciaSelecionada] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  // 🔄 Carrega lista de agências cadastradas do Supabase
  useEffect(() => {
    const carregarAgencias = async () => {
      const { data, error } = await supabase
        .from('agencias')
        .select('agencia')
        .order('agencia', { ascending: true });

      if (error) {
        console.error('Erro ao carregar agências:', error);
        return;
      }

      setAgencias(data.map((a) => a.agencia));
    };

    carregarAgencias();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!agenciaSelecionada || !senha) {
      alert('Preencha os campos de agência e senha.');
      return;
    }

    const hash = gerarHash(senha);

    const { data, error } = await supabase
      .from('agencias')
      .select('*')
      .eq('agencia', agenciaSelecionada)
      .limit(1)
      .single();

    if (error || !data) {
      alert('Agência não encontrada.');
      console.error(error);
      return;
    }

    if (data.senha !== hash) {
      alert('Senha incorreta.');
      return;
    }

    localStorage.setItem(
      'agenciaAtiva',
      JSON.stringify({
        agencia: data.agencia,
        tempoAntecipacao: data.tempoAntecipacao || 10
      })
    );

    alert(`Bem-vindo(a), agência ${data.agencia}!`);
    navigate('/painel');
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

      {agencias.length === 0 ? (
        <>
          <p>Nenhuma agência cadastrada ainda.</p>
          <button onClick={() => navigate('/cadastro')}>Cadastrar Primeira Agência</button>
        </>
      ) : (
        <form onSubmit={handleLogin} style={{ maxWidth: '320px', marginTop: '20px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label>Agência:</label><br />
            <select
              value={agenciaSelecionada}
              onChange={(e) => setAgenciaSelecionada(e.target.value)}
              style={{ width: '100%', padding: '8px', fontSize: '14px' }}
              required
            >
              <option value="">-- Selecione uma agência --</option>
              {agencias.map((ag) => (
                <option key={ag} value={ag}>{ag}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Senha:</label><br />
            <input
              type="password"
              maxLength={6}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
              style={{ width: '100%', padding: '8px', fontSize: '14px' }}
              required
            />
          </div>

          <button type="submit" style={{ padding: '10px 20px', marginRight: '10px' }}>Entrar</button>
          <button type="button" onClick={() => navigate('/cadastro')}>Cadastrar Nova Agência</button>
        </form>
      )}

      <Footer />
    </div>
  );
};

export default LoginScreen;
