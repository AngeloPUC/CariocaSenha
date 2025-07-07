import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginScreen from './components/LoginScreen';
import CadastroAgencia from './components/CadastroAgencia';
import EmissorSenha from './components/EmissorSenha';
import ChamadaPainel from './components/ChamadaPainel';
import Relatorio from './components/Relatorio';
import Informacoes from './components/Informacoes';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div style={{ paddingBottom: '80px', minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/cadastro" element={<CadastroAgencia />} />
          <Route path="/painel" element={<EmissorSenha />} />
          <Route path="/chamada" element={<ChamadaPainel />} />
          <Route path="/relatorio" element={<Relatorio />} />
          <Route path="/informacoes" element={<Informacoes />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
