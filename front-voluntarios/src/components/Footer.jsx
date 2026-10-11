export default function Footer() {
  return (
    <footer style={styles.footer}>
      <p style={styles.text}>
        &copy; 2026 <strong>Conecta & Ação - Gerenciamento de Projetos Sociais</strong>
      </p>
    </footer>
  );
}

const styles = {
  footer: {
    textAlign: 'center',
    padding: '20px 10px',
    background: '#f8f9fa',
    borderTop: '1px solid #e9ecef',
    marginTop: 'auto',
    color: '#6c757d',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px'
  },
  text: {
    margin: '0 0 5px 0'
  }
};