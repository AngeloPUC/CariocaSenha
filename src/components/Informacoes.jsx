import Header from './Header';
import Footer from './Footer';

const Informacoes = () => {
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
      <h2>ℹ️ Informações do Sistema</h2>

      <p style={{ textAlign: 'justify' }}>
        Este sistema foi desenvolvido para o gerenciamento de senhas de atendimento de forma simples, local e offline.
        Ele permite que agências emitam, gerenciem e acompanhem o fluxo de atendimento de forma organizada e direta,
        sem depender de servidores externos.
      </p>

      <h3>📋 Menu Hambúrguer</h3>
      <ul style={{ lineHeight: '1.8em', paddingLeft: '20px', textAlign: 'justify' }}>
        <li><strong>🔐 Login</strong> — acessa a tela de login da agência cadastrada.</li>
        <li><strong>🏠 Emissor</strong> — emite senhas para atendimento, com seleção de setor e preenchimento opcional de dados do cliente.</li>
        <li><strong>🧑‍💻 Chamada</strong> — permite que o atendente chame senhas por setor e número da mesa, controlando o fluxo de atendimento.</li>
        <li><strong>📊 Relatório</strong> — consulta as senhas emitidas no sistema e permite exportação para Excel filtrando por intervalo de datas.</li>
        <li><strong>ℹ️ Informações</strong> — exibe esta página com explicações sobre o uso do sistema e de cada botão do menu.</li>
        <li><strong>🗑️ Excluir Dados</strong> — remove permanentemente os dados salvos no navegador, incluindo histórico e configuração da agência.</li>
        <li><strong>🔓 Sair</strong> — encerra a sessão da agência e retorna para a tela de login.</li>
      </ul>

      <h3>🔒 Sobre os dados</h3>
      <p style={{ textAlign: 'justify' }}>
        Os dados utilizados e armazenados por este sistema são gravados exclusivamente no <strong>navegador local</strong> do usuário
        (frontend), sem conexão com banco de dados remoto ou servidor externo. Isso torna o sistema mais leve e de fácil manutenção,
        ideal para ambientes que não exigem estrutura online.
      </p>
      <p style={{ textAlign: 'justify', color: '#880000', fontStyle: 'italic' }}>
        Por se tratar de armazenamento local, há uma maior vulnerabilidade a perdas ou acessos indevidos, especialmente em dispositivos
        compartilhados. Ao utilizar este sistema, o usuário compreende que <strong>os desenvolvedores não se responsabilizam por qualquer
        vazamento, perda ou exposição de dados que eventualmente venham a ocorrer</strong>.
      </p>

      <Footer />
    </div>
  );
};

export default Informacoes;
