import { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import Header from './Header';
import Footer from './Footer';

const setores = ['VAREJO', 'GERENCIA', 'CAIXAS', 'PENHOR', 'EXPRESSO', 'ATENDIMENTO'];

const EmissorSenha = () => {
  const [agenciaAtiva, setAgenciaAtiva] = useState('');
  const [setor, setSetor] = useState('');
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');

  useEffect(() => {
    const ativa = JSON.parse(localStorage.getItem('agenciaAtiva'));
    if (ativa?.agencia) {
      setAgenciaAtiva(ativa.agencia);
    } else {
      alert('Nenhuma agência ativa. Faça login novamente.');
      window.location.href = '/';
    }
  }, []);

  const gerarSenha = () => {
    if (!setor) {
      alert('Selecione o setor!');
      return;
    }

    const seq = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    const codigo = `${agenciaAtiva}-${setor.slice(0, 3).toUpperCase()}-${seq}`;
    const agora = new Date().toISOString();
    const senhaCripto = CryptoJS.SHA256(codigo).toString();

    const novaSenha = {
      agencia: agenciaAtiva,
      setor,
      codigoSenha: codigo,
      senhaCriptografada: senhaCripto,
      dataEmissao: agora,
      dataAtendimento: null,
      nome,
      cpf,
      telefone
    };

    const senhasSalvas = JSON.parse(localStorage.getItem('senhasAgencia')) || [];
    senhasSalvas.push(novaSenha);
    localStorage.setItem('senhasAgencia', JSON.stringify(senhasSalvas));

    alert(`Senha gerada: ${codigo}`);
    setSetor('');
    setNome('');
    setCpf('');
    setTelefone('');
  };

  return (
    <div style={{ padding: '20px', paddingBottom: '80px', minHeight: '100vh', backgroundColor: '#d0e6ff' }}>
      <Header />
      <h2>🏠 Emissão de Senha</h2>
      
      <label>Agência:</label><br />
      <input value={agenciaAtiva} readOnly style={{ backgroundColor: '#f0f0f0' }} />

      <br /><br />
      <label>Setor:</label><br />
      <select value={setor} onChange={(e) => setSetor(e.target.value)}>
        <option value="">-- Selecione o setor --</option>
        {setores.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <br /><br />
      <label><em>Opcional</em> - Nome:</label><br />
      <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />

      <br /><br />
      <label><em>Opcional</em> - CPF:</label><br />
      <input placeholder="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} />

      <br /><br />
      <label><em>Opcional</em> - Telefone:</label><br />
      <input placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />

      <br /><br />
      <button onClick={gerarSenha}>Emitir Senha</button>
      <Footer />
    </div>
  );
};

export default EmissorSenha;
