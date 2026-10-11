import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import Tabela from '../components/Tabela';

export default function Projetos() {
  const [lista, setLista] = useState([]);
  const [participantes, setParticipantes] = useState([]);
  const [instituicoesBanco, setInstituicoesBanco] = useState([]);
  
  const [form, setForm] = useState({
    titulo: '', descricao: '', cpfCoordenador: '', cnpjInstituicao: '', email: '', vagasDisponiveis: '', linkProjeto: ''
  });
  
  const [nomeResponsavel, setNomeResponsavel] = useState('');
  const [cpfValidado, setCpfValidado] = useState(false);
  const [nomeInstituicao, setNomeInstituicao] = useState('');

  const [idEditando, setIdEditando] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  
  // modal de Voluntários
  const [modalVoluntariosAberto, setModalVoluntariosAberto] = useState(false);
  const [projetoSelecionado, setProjetoSelecionado] = useState(null);
  const [voluntariosProjeto, setVoluntariosProjeto] = useState([]);
  const [cpfVoluntario, setCpfVoluntario] = useState('');

  const URL_PROJETOS = 'http://localhost:8080/projetos';
  const URL_PARTICIPANTES = 'http://localhost:8080/participantes';
  const URL_INSTITUICOES = 'http://localhost:8080/instituicoes';

  useEffect(() => {
    buscarDadosIniciais();
  }, []);

  async function buscarDadosIniciais() {
    try {
      const [resProj, resPart, resInst] = await Promise.all([
        fetch(URL_PROJETOS),
        fetch(URL_PARTICIPANTES),
        fetch(URL_INSTITUICOES)
      ]);
      setLista(await resProj.json().catch(() => []));
      setParticipantes(await resPart.json().catch(() => []));
      setInstituicoesBanco(await resInst.json().catch(() => []));
    } catch (erro) {
      console.error(erro);
    }
  }

  const aplicarMascara = (tipo, valor) => {
    const limpo = (valor || '').replace(/\D/g, '');
    if (tipo === 'cpf') {
      return limpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4').substring(0, 14);
    }
    if (tipo === 'cnpj') {
      const c = (valor || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 14);
      if (c.length <= 2) return c;
      if (c.length <= 5) return `${c.slice(0, 2)}.${c.slice(2)}`;
      if (c.length <= 8) return `${c.slice(0, 2)}.${c.slice(2, 5)}.${c.slice(5)}`;
      if (c.length <= 12) return `${c.slice(0, 2)}.${c.slice(2, 5)}.${c.slice(5, 8)}/${c.slice(8)}`;
      return `${c.slice(0, 2)}.${c.slice(2, 5)}.${c.slice(5, 8)}/${c.slice(8, 12)}-${c.slice(12, 14)}`;
    }
    return valor;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formatado = value;

    if (name === 'cpfCoordenador') {
      formatado = aplicarMascara('cpf', value);
      validarCpf(formatado);
    } else if (name === 'cnpjInstituicao') {
      formatado = aplicarMascara('cnpj', value);
      validarCnpj(formatado);
    } else if (name === 'vagasDisponiveis') {
      const num = value.replace(/\D/g, '');
      formatado = num ? String(Math.min(Number(num), 9999)) : '';
    }

    setForm(prev => ({ ...prev, [name]: formatado }));
  };

  function validarCpf(cpfFormatado) {
    const limpo = cpfFormatado.replace(/\D/g, '');
    if (limpo.length === 11) {
      const p = participantes.find(item => (item.cpf || '').replace(/\D/g, '') === limpo);
      if (!p) {
        alert("Erro: CPF não pertence a nenhum participante.");
        setNomeResponsavel(''); setCpfValidado(false); return;
      }
      if (!['Diretor', 'Coordenador'].includes(p.perfil)) {
        alert(`Erro: Apenas Diretores ou Coordenadores podem gerenciar projetos.`);
        setNomeResponsavel(''); setCpfValidado(false); return;
      }
      setNomeResponsavel(p.nome);
      setCpfValidado(true);
    } else {
      setNomeResponsavel('');
      setCpfValidado(false);
    }
  }

  function validarCnpj(cnpjFormatado) {
    const limpo = cnpjFormatado.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (limpo.length >= 10) {
      const inst = instituicoesBanco.find(i => {
        const cBanco = (i.cnpj || i.cnpjInstituicao || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        return cBanco === limpo;
      });
      setNomeInstituicao(inst ? (inst.nome || inst.razaoSocial || inst.nomeFantasia || '') : '');
    } else {
      setNomeInstituicao('');
    }
  }

  async function salvar(evento) {
    evento.preventDefault();
    const cnpjLimpo = form.cnpjInstituicao.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    
    const inst = instituicoesBanco.find(i => {
      const cBanco = (i.cnpj || i.cnpjInstituicao || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      return cBanco === cnpjLimpo;
    });

    if (!inst) return alert("Erro: Instituição não encontrada no banco de dados.");
    const nomeInst = inst.nome || inst.razaoSocial || inst.nomeFantasia || '';

    const objeto = {
      ...form,
      cpfCoordenador: form.cpfCoordenador.replace(/\D/g, ''),
      cnpjInstituicao: cnpjLimpo,
      instituicao: nomeInst,
      vagasDisponiveis: Number(form.vagasDisponiveis)
    };

    const metodo = idEditando ? 'PUT' : 'POST';
    const endpoint = idEditando ? `${URL_PROJETOS}/${idEditando}` : URL_PROJETOS;

    const res = await fetch(endpoint, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(objeto)
    });

    if (res.ok) {
      alert(idEditando ? "Projeto atualizado com sucesso!" : "Projeto cadastrado com sucesso!");
      limpar();
      buscarDadosIniciais();
    } else {
      alert("Erro ao salvar projeto.");
    }
  }

  async function excluir(id) {
    if (confirm("Tem certeza que deseja excluir este projeto?")) {
      await fetch(`${URL_PROJETOS}/${id}`, { method: 'DELETE' });
      buscarDadosIniciais();
    }
  }

  async function abrirVoluntarios(projeto) {
    setProjetoSelecionado(projeto);
    setCpfVoluntario('');
    const res = await fetch(`${URL_PROJETOS}/${projeto.id}/voluntarios`);
    setVoluntariosProjeto(res.ok ? await res.json() : []);
    setModalVoluntariosAberto(true);
  }

  async function adicionarVoluntario(e) {
    e.preventDefault();
    const limpo = cpfVoluntario.replace(/\D/g, '');
    const p = participantes.find(item => (item.cpf || '').replace(/\D/g, '') === limpo);

    if (!p) return alert("Erro: CPF não encontrado.");

    const res = await fetch(`${URL_PROJETOS}/${projetoSelecionado.id}/voluntarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participanteId: p.id })
    });

    if (res.ok) {
      alert(`Voluntário ${p.nome} vinculado com sucesso!`);
      setCpfVoluntario('');
      abrirVoluntarios(projetoSelecionado);
    } else {
      alert("Erro ao adicionar voluntário (pode já estar vinculado).");
    }
  }

  async function removerVoluntario(participanteId) {
    if (confirm("Remover participante do projeto?")) {
      const res = await fetch(`${URL_PROJETOS}/${projetoSelecionado.id}/voluntarios/${participanteId}`, { method: 'DELETE' });
      if (res.ok) abrirVoluntarios(projetoSelecionado);
    }
  }

  function prepararEdicao(item) {
    setIdEditando(item.id);
    setForm({
      titulo: item.titulo || '',
      descricao: item.descricao || '',
      cpfCoordenador: aplicarMascara('cpf', item.cpfCoordenador),
      cnpjInstituicao: aplicarMascara('cnpj', item.cnpjInstituicao),
      email: item.email || '',
      vagasDisponiveis: item.vagasDisponiveis ? String(item.vagasDisponiveis) : '',
      linkProjeto: item.linkProjeto || ''
    });
    validarCpf(aplicarMascara('cpf', item.cpfCoordenador));
    validarCnpj(aplicarMascara('cnpj', item.cnpjInstituicao));
    setModalAberto(true);
  }

  function limpar() {
    setIdEditando(null);
    setForm({ titulo: '', descricao: '', cpfCoordenador: '', cnpjInstituicao: '', email: '', vagasDisponiveis: '', linkProjeto: '' });
    setNomeResponsavel('');
    setCpfValidado(false);
    setNomeInstituicao('');
    setModalAberto(false);
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button 
          onClick={() => { limpar(); setModalAberto(true); }} 
          style={{ padding: '8px 14px', background: '#78d49e', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px', fontSize: '14px' }}
        >
          + Adicionar Projetos
        </button>
      </div>

      {/* modal cadastro e edição */}
      <Modal isOpen={modalAberto} onClose={() => setModalAberto(false)}>
        <h3 style={{ textAlign: 'left' }}>{idEditando ? 'Editar Projeto' : 'Cadastrar Projeto'}</h3>
        <form onSubmit={salvar} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px', maxHeight: '480px', overflowY: 'auto' }}>
          
          <label style={{ fontSize: '12px', color: '#666', textAlign: 'left' }}>CPF do Diretor / Coordenador</label>
          <input type="text" name="cpfCoordenador" placeholder="000.000.000-00" value={form.cpfCoordenador} maxLength={14} onChange={handleChange} required style={{ padding: '8px' }} />

          <label style={{ fontSize: '12px', color: '#666', textAlign: 'left' }}>Nome do Responsável</label>
          <input type="text" value={nomeResponsavel} readOnly style={{ padding: '8px', background: '#f5f5f5', color: '#555' }} />

          {cpfValidado && (
            <>
              <label style={{ fontSize: '12px', color: '#666', textAlign: 'left' }}>CNPJ da Instituição</label>
              <input type="text" name="cnpjInstituicao" placeholder="00.000.000/0000-00" value={form.cnpjInstituicao} maxLength={18} onChange={handleChange} required style={{ padding: '8px' }} />

              <label style={{ fontSize: '12px', color: '#666', textAlign: 'left' }}>Nome da Instituição</label>
              <input type="text" value={nomeInstituicao} readOnly style={{ padding: '8px', background: '#f5f5f5', color: '#555' }} />

              <label style={{ fontSize: '12px', color: '#666', textAlign: 'left' }}>Título do Projeto</label>
              <input type="text" name="titulo" placeholder="Título" value={form.titulo} onChange={handleChange} required style={{ padding: '8px' }} />
              
              <label style={{ fontSize: '12px', color: '#666', textAlign: 'left' }}>Link do Site do Projeto (URL)</label>
              <input type="url" name="linkProjeto" placeholder="https://exemplo.com.br" value={form.linkProjeto} onChange={handleChange} style={{ padding: '8px' }} />

              <label style={{ fontSize: '12px', color: '#666', textAlign: 'left' }}>Descrição</label>
              <textarea name="descricao" placeholder="Detalhes..." value={form.descricao} onChange={handleChange} style={{ padding: '8px', minHeight: '80px', fontFamily: 'inherit' }} />
              
              <label style={{ fontSize: '12px', color: '#666', textAlign: 'left' }}>E-mail de Contato</label>
              <input type="email" name="email" placeholder="E-mail" value={form.email} onChange={handleChange} required style={{ padding: '8px' }} />

              <label style={{ fontSize: '12px', color: '#666', textAlign: 'left' }}>Vagas Disponíveis</label>
              <input type="text" name="vagasDisponiveis" placeholder="0" value={form.vagasDisponiveis} maxLength={4} onChange={handleChange} required style={{ padding: '8px' }} />
              
              <button type="submit" style={{ padding: '10px', background: '#78d49e', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px', marginTop: '5px' }}>
                {idEditando ? 'Atualizar' : 'Salvar'}
              </button>
            </>
          )}
        </form>
      </Modal>

      {/* modal de voluntários */}
      <Modal isOpen={modalVoluntariosAberto} onClose={() => setModalVoluntariosAberto(false)}>
        <h3 style={{ textAlign: 'left' }}>
          Voluntários: {
            projetoSelecionado?.linkProjeto ? (
              <a href={projetoSelecionado.linkProjeto} target="_blank" rel="noopener noreferrer" style={{ color: '#127abb', textDecoration: 'none' }}>
                {projetoSelecionado?.titulo}
              </a>
            ) : projetoSelecionado?.titulo
          }
        </h3>
        
        <div style={{ marginTop: '10px', marginBottom: '15px', textAlign: 'left' }}>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px', fontWeight: 'bold' }}>Descrição:</p>
          <p style={{ background: '#f9f9f9', padding: '10px', borderRadius: '4px', fontSize: '14px', color: '#333', border: '1px solid #eee', whiteSpace: 'pre-wrap' }}>
            {projetoSelecionado?.descricao || 'Nenhuma descrição informada.'}
          </p>
        </div>

        <form onSubmit={adicionarVoluntario} style={{ display: 'flex', gap: '8px', marginTop: '15px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>CPF do Participante</label>
            <input type="text" placeholder="000.000.000-00" value={cpfVoluntario} maxLength={14} onChange={e => setCpfVoluntario(aplicarMascara('cpf', e.target.value))} required style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" style={{ padding: '9px 15px', background: '#78d49e', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px', height: '37px' }}>Adicionar</button>
        </form>

        <div style={{ marginTop: '20px', maxHeight: '200px', overflowY: 'auto', textAlign: 'left' }}>
          <h4 style={{ fontSize: '14px', color: '#444', marginBottom: '8px' }}>Vinculados:</h4>
          {voluntariosProjeto.length === 0 ? (
            <p style={{ color: '#888', fontSize: '13px' }}>Nenhum participante vinculado.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd', color: '#127abb' }}>
                  <th style={{ padding: '6px' }}>Nome</th>
                  <th style={{ padding: '6px' }}>CPF</th>
                  <th style={{ padding: '6px', textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {voluntariosProjeto.map(vol => (
                  <tr key={vol.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px' }}>{vol.nome}</td>
                    <td style={{ padding: '8px' }}>{vol.cpf}</td>
                    <td style={{ padding: '8px', textAlign: 'right' }}>
                      <button onClick={() => removerVoluntario(vol.id)} style={{ background: '#eb877b', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}>Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Modal>

      {/* componente tabela.jsx */}
      <Tabela 
        colunas={["Título do Projeto", "Instituição", "E-mail", "Vagas"]} 
        chaves={["titulo", "instituicao", "email", "vagasDisponiveis"]} 
        dados={lista} 
        onDetalhes={abrirVoluntarios}
        textoBotaoDetalhes="Detalhes"
        onEditar={prepararEdicao} 
        onExcluir={excluir} 
      />

    </div>
  );
}