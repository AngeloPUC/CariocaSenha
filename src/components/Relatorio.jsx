import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { supabase } from '../supabaseClient';
import Header from './Header';
import Footer from './Footer';

const Relatorio = () => {
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [agenciaAtiva, setAgenciaAtiva] = useState('');
  const [senhasFiltradas, setSenhasFiltradas] = useState([]);

  useEffect(() => {
    const ativa = JSON.parse(localStorage.getItem('agenciaAtiva'));
    if (ativa?.agencia) {
      setAgenciaAtiva(ativa.agencia);
    } else {
      alert('Nenhuma agência ativa. Faça login novamente.');
      window.location.href = '/';
    }
  }, []);

  const buscarDados = async () => {
    if (!dataInicial || !dataFinal) {
      alert('Preencha o intervalo de datas.');
      return;
    }

    const inicioISO = `${dataInicial}T00:00:00Z`;
    const fimISO = `${dataFinal}T23:59:59Z`;

    const { data, error } = await supabase
      .from('senhas')
      .select('*')
      .eq('agencia', agenciaAtiva)
      .gte('dataEmissao', inicioISO)
      .lte('dataEmissao', fimISO)
      .order('dataEmissao', { ascending: true });

    if (error) {
      alert('Erro ao buscar dados no banco.');
      console.error(error);
      return;
    }

    if (data.length === 0) {
      alert('Nenhuma senha encontrada para este intervalo.');
    }

    setSenhasFiltradas(data);
  };

  const exportarExcel = () => {
    if (senhasFiltradas.length === 0) {
      alert('Nenhuma senha para exportar.');
      return;
    }

    const dadosExcel = senhasFiltradas.map((s) => ({
      'Código': s.codigoSenha,
      'Setor': s.setor,
      'Emitida em': new Date(s.dataEmissao).toLocaleString(),
      'Atendida em': s.dataAtendimento
        ? new Date(s.dataAtendimento).toLocaleString()
        : 'PENDENTE',
      'Mesa': s.mesaAtendimento || '',
      'Nome': s.nome || '',
      'CPF': s.cpf || '',
      'Telefone': s.telefone || ''
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dadosExcel);
    XLSX.utils.book_append_sheet(wb, ws, 'Relatório');
    XLSX.writeFile(wb, `Relatorio_${agenciaAtiva}_${dataInicial}_a_${dataFinal}.xlsx`);
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
      <h2>📈 Relatório de Senhas</h2>
      <p><strong>Agência ativa:</strong> {agenciaAtiva}</p>

      <label>Data Inicial:</label>
      <input
        type="date"
        value={dataInicial}
        onChange={(e) => setDataInicial(e.target.value)}
      />

      <label style={{ marginLeft: '20px' }}>Data Final:</label>
      <input
        type="date"
        value={dataFinal}
        onChange={(e) => setDataFinal(e.target.value)}
      />

      <br /><br />
      <button onClick={buscarDados}>Buscar</button>{" "}
      <button onClick={exportarExcel}>Exportar para Excel</button>

      <h3 style={{ marginTop: '30px' }}>
        📋 Resultado ({senhasFiltradas.length} senhas)
      </h3>

      <div style={{ overflowX: 'auto' }}>
        <table border="1" cellPadding="8" style={{ minWidth: '720px', fontSize: '0.9em', backgroundColor: '#ffffff' }}>
          <thead style={{ backgroundColor: '#caf0f8' }}>
            <tr>
              <th>Código</th>
              <th>Setor</th>
              <th>Emitida em</th>
              <th>Atendida em</th>
              <th>Mesa</th>
              <th>Nome</th>
              <th>CPF</th>
              <th>Telefone</th>
            </tr>
          </thead>
          <tbody>
            {senhasFiltradas.map((s, idx) => (
              <tr key={idx}>
                <td>{s.codigoSenha}</td>
                <td>{s.setor}</td>
                <td>{new Date(s.dataEmissao).toLocaleString()}</td>
                <td>{s.dataAtendimento ? new Date(s.dataAtendimento).toLocaleString() : 'PENDENTE'}</td>
                <td>{s.mesaAtendimento || ''}</td>
                <td>{s.nome || ''}</td>
                <td>{s.cpf || ''}</td>
                <td>{s.telefone || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Footer />
    </div>
  );
};

export default Relatorio;
