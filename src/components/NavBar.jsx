import { Link } from 'react-router-dom';

const NavBar = () => (
  <nav style={{ marginBottom: '20px' }}>
    <Link to="/painel">Emissor de Senha</Link> |{" "}
    <Link to="/chamada">Painel de Chamada</Link> |{" "}
    <Link to="/relatorio">Relatório</Link> |{" "}
    <Link to="/">Sair</Link>
  </nav>
);

export default NavBar;
