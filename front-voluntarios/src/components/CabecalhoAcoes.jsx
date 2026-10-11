export default function CabecalhoAcoes({ titulo, onAdicionar }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
      <button 
        onClick={onAdicionar} 
        style={{ 
          padding: '8px 14px', 
          background: '#78d49e', 
          color: '#fff', 
          border: 'none', 
          cursor: 'pointer', 
          borderRadius: '4px', 
          fontSize: '14px' 
        }}
      >
        + Adicionar {titulo}
      </button>
    </div>
  );
}