import { useEffect, useState } from 'react';

const Footer = () => {
  const [ip, setIp] = useState('Detectando...');

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then((res) => res.json())
      .then((data) => setIp(data.ip))
      .catch(() => setIp('IP não detectado'));
  }, []);

  return (
    <footer style={{
      backgroundColor: '#023E8A',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 24px',
      fontSize: '0.85em',
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      boxSizing: 'border-box',
      zIndex: 999,
      whiteSpace: 'nowrap'
    }}>
      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
        🌐 IP: {ip}
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        © 2025 CariocaSenha
      </div>
    </footer>
  );
};

export default Footer;
