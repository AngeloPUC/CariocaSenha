import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

const ChamadaPainel = () => {
  const [senhasPendentes, setSenhasPendentes] = useState([]);
  const [ultimaChamada, setUltimaChamada] = useState(null);
  const [setorAtual, setSetorAtual] = useState('VAREJO');
  const [mesa, setMesa] = useState('30');
  const [agenciaAtiva, setAgenciaAtiva] = useState('');

  useEffect(() => {
    const ativa = JSON.parse(localStorage.getItem('agenciaAtiva'));
    if (ativa?.agencia) {
      setAgenciaAtiva(ativa.agencia);
      atualizarFila(ativa.agencia, setorAtual);
    } else {
      alert('Nenhuma agência ativa. Faça login novamente.');
      window.location.href = '/';
    }
  }, [setorAtual]);

  const atualizarFila = (agencia, setor) => {
    const todas = JSON.parse(localStorage.getItem('senhasAgencia')) || [];

    const pendentes = todas.filter(
      (s) => !s.dataAtendimento && s.setor === setor && s.agencia === agencia
    );

    const chamadas = todas
      .filter((s) => s.dataAtendimento && s.setor === setor && s.agencia === agencia)
      .sort((a, b) => b.dataAtendimento - a.dataAtendimento);

    setSenhasPendentes(pendentes);
    setUltimaChamada(chamadas[0] || null);
  };

  const chamarProxima = () => {
    const todas = JSON.parse(localStorage.getItem('senhasAgencia')) || [];

    const pendentes = todas.filter(
      (s) => !s.dataAtendimento && s.setor === setorAtual && s.agencia === agenciaAtiva
    );

    if (pendentes.length === 0) {
      alert('Nenhuma senha pendente para esse setor.');
      return;
    }

    const agora = Date.now();

    const comEspera = pendentes.map((s) => {
      const esperaMin = Math.floor((agora - s.dataEmissao) / 60000);
      const antecipacao = s.prioridade ? (s.tempoAntecipacao || 10) : 0;
      return {
        ...s,
        tempoEfetivo: esperaMin + antecipacao,
      };
    });

    comEspera.sort((a, b) => b.tempoEfetivo - a.tempoEfetivo);
    const selecionada = comEspera[0];

    const index = todas.findIndex((s) => s.codigoSenha === selecionada.codigoSenha);
    todas[index].dataAtendimento = agora;

    localStorage.setItem('senhasAgencia', JSON.stringify(todas));
    atualizarFila(agenciaAtiva, setorAtual);
  };

  const calcularTempoEspera = (timestamp) => {
    const agora = Date.now();
    const minutos = Math.floor((agora - timestamp) / 60000);
    let cor = 'blue';
    if (minutos > 30) cor = 'red';
    else if (minutos > 20) cor = 'orange';
    return { minutos, cor };
  };

  const formatarHora = (timestamp) => {
    const data = new Date(timestamp);
    return data.toLocaleTimeString('pt-BR', { hour12: false });
  };

  return (
    <div
      style={{
        padding: '20px',
        paddingBottom: '80px',
        minHeight: '100vh',
        backgroundColor: '#f7faff',
        boxSizing: 'border-box',
      }}
    >
      <Header />
      <h2>📣 Painel de Chamada</h2>

      <label>Mesa (2 Dig):</label>
      <input
        value={mesa}
        onChange={(e) => setMesa(e.target.value)}
        maxLength={2}
        style={{ marginLeft: '10px', width: '40px' }}
      />

      <br /><br />

      <label>Setor:</label>
      <select
        value={setorAtual}
        onChange={(e) => setSetorAtual(e.target.value)}
        style={{ marginLeft: '10px' }}
      >
        <option value="VAREJO">VAREJO</option>
        <option value="GERENCIA">GERENCIA</option>
        <option value="CAIXAS">CAIXAS</option>
        <option value="PENHOR">PENHOR</option>
        <option value="EXPRESSO">EXPRESSO</option>
        <option value="ATENDIMENTO">ATENDIMENTO</option>
      </select>

      <br /><br />
      <button onClick={chamarProxima}>Chamar Próxima Senha</button>

      <br /><br />

      {ultimaChamada && (
        <div style={{ marginBottom: '20px' }}>
          <strong>Última chamada:</strong>{' '}
          <span style={{ fontWeight: 'bold' }}>{ultimaChamada.codigoSenha}</span>{' '}
          às {formatarHora(ultimaChamada.dataAtendimento)}
        </div>
      )}

      <h3>Senhas Pendentes do setor: {setorAtual}</h3>

      {senhasPendentes.length === 0 ? (
        <p>Nenhuma senha pendente.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Senha</th>
              <th style={{ textAlign: 'left' }}>Horário</th>
              <th style={{ textAlign: 'left' }}>Espera</th>
            </tr>
          </thead>
          <tbody>
            {senhasPendentes.map((s) => {
              const { minutos, cor } = calcularTempoEspera(s.dataEmissao);
              return (
                <tr key={s.codigoSenha}>
                  <td>{s.codigoSenha}</td>
                  <td>{formatarHora(s.dataEmissao)}</td>
                  <td style={{ color: cor, fontWeight: 'bold' }}>{minutos} min</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <Footer />
    </div>
  );
};

export default ChamadaPainel;
