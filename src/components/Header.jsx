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
    const todas = JSON.parse(localStorage.getItem('agencias')) || [];

    if (!ativa?.agencia) {
      alert('Nenhuma agência ativa no momento.');
      return;
    }

    const confirmacao = window.confirm(
      `Deseja realmente excluir TODAS as senhas da agência "${ativa.agencia}" do banco de dados? Esta ação não poderá ser desfeita.`
    );

    if (!confirmacao) return;

    // 🔥 Exclui senhas no Supabase
    const { error } = await supabase
      .from('senhas')
      .delete()
      .eq('agencia', ativa.agencia);

    if (error) {
      alert('Erro ao excluir os dados do banco.');
      console.error(error);
    } else {
      alert(`Todos os dados da agência "${ativa.agencia}" foram removidos com sucesso do Supabase.`);
    }

    // 🧹 Opcional: Limpa a agência local também
    const atualizada = todas.filter((a) => a.agencia !== ativa.agencia);
    localStorage.setItem('agencias', JSON.stringify(atualizada));
    localStorage.removeItem('agenciaAtiva');
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
