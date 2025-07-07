import { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import Header from './Header';
import Footer from './Footer';
import { supabase } from '../supabaseClient';

const setores = ['VAREJO', 'GERENCIA', 'CAIXAS', 'PENHOR', 'EXPRESSO', 'ATENDIMENTO'];

const EmissorSenha = () => {
  const [agenciaAtiva, setAgenciaAtiva] = useState('');
  const [tempoAntecipacao, setTempoAntecipacao] = useState(10);
  const [setor, setSetor] = useState('');
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [prioridade, setPrioridade] = useState(false);

  useEffect(() => {
    const ativa = JSON.parse(localStorage.getItem('agenciaAtiva'));
    if (ativa?.agencia) {
      setAgenciaAtiva(ativa.agencia);
      setTempoAntecipacao(ativa.tempoAntecipacao || 10);
    } else {
      alert('Nenhuma agência ativa. Faça login novamente.');
      window.location.href = '/';
    }
  }, []);

  const gerarSenha = async () => {
    if (!setor) {
      alert('Selecione o setor!');
      return;
    }

    // 🧠 Busca quantas senhas já existem dessa agência/setor
    const { data: existentes, error: consultaErro } = await supabase
      .from('senhas')
      .select('id', { count: 'exact' })
      .eq('agencia', agenciaAtiva)
      .eq('setor', setor);

    if (consultaErro) {
      alert(`Erro ao consultar: ${consultaErro.message}`);
      console.error(consultaErro);
      return;
    }

    const sequencial = (existentes?.length || 0) + 1;
    const prefixoSetor = setor.slice(0, 3).toUpperCase();
    const digitoVerificador = Math.floor(Math.random() * 10);
    const numeroBase = `${prefixoSetor}${sequencial.toString().padStart(3, '0')}-${digitoVerificador}`;
    const codigo = prioridade
      ? `${agenciaAtiva}-P.${numeroBase}`
      : `${agenciaAtiva}-${numeroBase}`;

    const timestampAgora = new Date().toISOString();
    const senhaCripto = CryptoJS.SHA256(codigo).toString();

    const novaSenha = {
      agencia: agenciaAtiva,
      setor,
      codigoSenha: codigo,
      senhaCriptografada: senhaCripto,
      dataEmissao: timestampAgora,
      dataAtendimento: null,
      nome,
      cpf,
      telefone,
      prioridade,
      tempoAntecipacao: Number(tempoAntecipacao) || 10
    };

    const { error: insertErro } = await supabase.from('senhas').insert([novaSenha]);
    if (insertErro) {
      alert(`Erro ao salvar no banco: ${insertErro.message}`);
      console.error(insertErro);
      return;
    }

    alert(`Senha gerada: ${codigo}`);
    setSetor('');
    setNome('');
    setCpf('');
    setTelefone('');
    setPrioridade(false);
  };

  return (
    <div style={{ padding: '20px', paddingBottom: '80px', minHeight: '100vh', backgroundColor: '#d0e6ff' }}>
      <Header />
      <h2>🎫 Emissão de Senha</h2>

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
      <label>
        <input
          type="checkbox"
          checked={prioridade}
          onChange={(e) => setPrioridade(e.target.checked)}
        /> Cliente com prioridade
      </label>

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
