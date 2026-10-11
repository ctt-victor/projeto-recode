export default function Tabela({ colunas, dados, chaves, onEditar, onExcluir, onDetalhes, textoBotaoDetalhes = "Detalhes" }) {
  const formatar = (chave, valor) => {
    if (!valor) return '';
    
    // aplicar mascara de telefone
    if (chave === 'telefone') {
      const n = String(valor).replace(/\D/g, '');
      return n.length === 11 ? n.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3') : valor;
    }

    // formatar a data do nascimento
    if (chave === 'data_nascimento') {
      const partes = String(valor).split('-');
      if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
      }
    }

    return typeof valor === 'object' ? JSON.stringify(valor) : String(valor);
  };

  return (
    <div style={{ overflowX: 'auto', marginTop: '20px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderRadius: '6px', overflow: 'hidden', fontFamily: 'Arial, sans-serif' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5', color: '#127abb', textAlign: 'left' }}>
            {colunas.map((col, i) => <th key={i} style={{ padding: '12px 15px' }}>{col}</th>)}
            <th style={{ padding: '12px 15px', textAlign: 'center' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {dados.length === 0 ? (
            <tr><td colSpan={colunas.length + 1} style={{ textAlign: 'center', padding: '20px', color: '#7f8c8d' }}>Nenhum registro encontrado.</td></tr>
          ) : (
            dados.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                {chaves.map((chave, i) => (
                  <td key={i} style={{ padding: '12px 15px', color: '#333' }}>{formatar(chave, item[chave])}</td>
                ))}
                <td style={{ padding: '12px 15px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                  {onDetalhes && <button onClick={() => onDetalhes(item)} style={{ padding: '6px 12px', backgroundColor: '#67b2e4', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '6px' }}>{textoBotaoDetalhes}</button>}
                  <button onClick={() => onEditar(item)} style={{ padding: '6px 12px', backgroundColor: '#e7bf39', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '6px' }}>Editar</button>
                  <button onClick={() => onExcluir(item.id)} style={{ padding: '6px 12px', backgroundColor: '#eb877b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Excluir</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}