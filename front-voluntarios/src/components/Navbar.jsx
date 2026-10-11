import { Link } from 'react-router-dom';
import LogoCA from './LogoCA';

export default function Navbar() {
  const linkStyle = {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: '500',
    padding: '5px 10px',
    borderRadius: '4px',
    transition: 'background 0.2s, color 0.2s'
  };

  const rotas = [
    { to: '/', label: 'Instituições' },
    { to: '/projetos', label: 'Projetos' },
    { to: '/voluntarios', label: 'Voluntários' }
  ];

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 30px', 
      background: '#67b2e4',
      color: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      fontFamily: 'arial, sans-serif'
    }}>
      {/* lgo para ir a tela inicial*/}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <LogoCA width="110px" />
      </Link>
      
      {/* links das navegções */}
      <div style={{ display: 'flex', gap: '10px' }}>
        {rotas.map((link, index) => (
          <Link key={index} to={link.to} style={linkStyle}>
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}