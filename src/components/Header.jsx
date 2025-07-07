import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Header.css';
import { supabase } from '../supabaseClient';

const Header = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const sair = () => {
    localStorage.removeItem('agenciaAtiva');
    navigate('/');
  };

  const excluirAgencia = async () => {
    const ativa = JSON.parse(localStorage.getItem('agenciaAtiva'));

    if (!ativa?.agencia) {
      alert('Nenhuma agência ativa no momento.');
      return;
    }

    const confirmacao = window.confirm(
      `Deseja realmente excluir a agência "${ativa.agencia}" e todas as suas senhas do banco de dados? Esta ação é irreversível.`
    );

    if (!confirmacao) return;

    // 🔥 1. Exclui senhas da agência
    const { error: erroSenhas } = await supabase
      .from('senhas')
      .delete()
      .eq('agencia', ativa.agencia);

    if (erroSenhas) {
      alert('Erro ao excluir as senhas.');
      console.error(erroSenhas);
      return;
    }

    // ❌ 2. Exclui o cadastro da agência
    const { error: erroAgencia } = await supabase
      .from('agencias')
      .delete()
      .eq('agencia', ativa.agencia);

    if (erroAgencia) {
      alert('Erro ao excluir o cadastro da agência.');
      console.error(erroAgencia);
      return;
    }

    // 🧹 3. Limpa localStorage e redireciona
    localStorage.removeItem('agenciaAtiva');
    alert(`Agência "${ativa.agencia}" e todos os seus dados foram removidos com sucesso.`);
    navigate('/cadastro');
  };

  return (
    <header className="cabecalho">
      <div className="logo" style={{ paddingLeft: '8px' }}>
        <img
          src="/favicon1.ico"
          alt="Logo Carioca Senha"
          style={{
            height: '38px',
            verticalAlign: 'middle',
            display: 'block',
            margin: '0 12px 0 0'
          }}
        />
      </div>

      <button className="menu-toggle" onClick={() => setOpen(!open)}>☰</button>

      <nav className={`menu ${open ? 'aberto' : ''}`}>
        <Link to="/">🔐 Login</Link>
        <Link to="/painel">🏠 Emissor</Link>
        <Link to="/chamada">🧑‍💻 Chamada</Link>
        <Link to="/relatorio">📊 Relatório</Link>
        <Link to="/informacoes">ℹ️ Informações</Link>
        <button onClick={excluirAgencia}>🗑️ Excluir Dados</button>
        <button onClick={sair}>🔓 Sair</button>
      </nav>
    </header>
  );
};

export default Header;
