import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import Tabela from '../components/Tabela';

export default function Instituicoes() {
  const [lista, setLista] = useState([]);
  const [participantes, setParticipantes] = useState([]);
  
  const [form, setForm] = useState({
    nome: '', cnpj: '', email: '', telefone: '', cep: '', logradouro: '', numero: '', complemento: '', cpfDiretor: ''
  });

  const [nomeResponsavel, setNomeResponsavel] = useState('');
  const [cpfValidado, setCpfValidado] = useState(false);

  const [idEditando, setIdEditando] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);
  const [instituicaoSelecionada, setInstituicaoSelecionada] = useState(null);

  const URL_INSTITUICOES = 'http://localhost:8080/instituicoes';
  const URL_PARTICIPANTES = 'http://localhost:8080/participantes';

  useEffect(() => {
    buscarDadosIniciais();
  }, []);

  async function buscarDadosIniciais() {
    try {
      const [resInst, resPart] = await Promise.all([
        fetch(URL_INSTITUICOES),
        fetch(URL_PARTICIPANTES)
      ]);
      setLista(await resInst.json().catch(() => []));
      setParticipantes(await resPart.json().catch(() => []));
    } catch (erro) {
      console.error(erro);
    }
  }

  // máscaras aplicadas
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
    if (tipo === 'telefone') {
      const nums = limpo.slice(0, 11);
      if (nums.length <= 2) return nums.length ? `(${nums}` : '';
      if (nums.length <= 6) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
      if (nums.length <= 10) return `(${nums.slice(0, 2)}) ${nums.slice(2, 6)}-${nums.slice(6)}`;
      return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7, 11)}`;
    }
    if (tipo === 'cep') {
      return limpo.replace(/(\d{5})(\d)/, '$1-$2').substring(0, 9);
    }
    return valor;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formatado = value;

    if (name === 'cpfDiretor') {
      formatado = aplicarMascara('cpf', value);
      validarCpf(formatado);
    } else if (name === 'cnpj') {
      formatado = aplicarMascara('cnpj', value);
    } else if (name === 'telefone') {
      formatado = aplicarMascara('telefone', value);
    } else if (name === 'cep') {
      formatado = aplicarMascara('cep', value);
    }

    setForm(prev => ({ ...prev, [name]: formatado }));
  };

  function validarCpf(cpfFormatado) {
    const limpo = cpfFormatado.replace(/\D/g, '');
    if (limpo.length === 11) {
      const p = participantes.find(item => (item.cpf || '').replace(/\D/g, '') === limpo);
      if (!p) {
        alert("Erro: O CPF informado não pertence a nenhum participante cadastrado.");
        setNomeResponsavel(''); setCpfValidado(false); return;
      }
      if (!['Diretor', 'Coordenador'].includes(p.perfil)) {
        alert(`Erro: Apenas Diretores ou Coordenadores podem cadastrar uma instituição.`);
        setNomeResponsavel(''); setCpfValidado(false); return;
      }
      setNomeResponsavel(p.nome);
      setCpfValidado(true);
    } else {
      setNomeResponsavel('');
      setCpfValidado(false);
    }
  }

  async function consultarCep(cepValor) {
    const limpo = cepValor.replace(/\D/g, '');
    if (limpo.length === 8) {
      try {
        setForm(prev => ({ ...prev, logradouro: 'Carregando...' }));
        const res = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
        const dados = await res.json();
        if (!dados.erro) {
          setForm(prev => ({ ...prev, logradouro: dados.logradouro || '' }));
        } else {
          alert('CEP não encontrado.');
          setForm(prev => ({ ...prev, logradouro: '' }));
        }
      } catch (erro) {
        console.error(erro);
        setForm(prev => ({ ...prev, logradouro: '' }));
      }
    }
  }

  async function salvar(evento) {
    evento.preventDefault();
    const cnpjLimpo = form.cnpj.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (cnpjLimpo.length !== 14) return alert(`O CNPJ deve conter 14 caracteres.`);

    const telefoneLimpo = form.telefone.replace(/\D/g, '');
    if (telefoneLimpo.length !== 11) return alert(`O telefone deve conter 11 dígitos.`);

    const objeto = {
      ...form,
      cnpj: cnpjLimpo,
      telefone: telefoneLimpo,
      complemento: form.complemento || null,
      cpfDiretor: form.cpfDiretor.replace(/\D/g, '')
    };

    const metodo = idEditando ? 'PUT' : 'POST';
    const endpoint = idEditando ? `${URL_INSTITUICOES}/${idEditando}` : URL_INSTITUICOES;

    const res = await fetch(endpoint, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(objeto)
    });

    if (res.ok) {
      alert(idEditando ? "Instituição atualizada com sucesso!" : "Instituição cadastrada com sucesso!");
      limpar();
      buscarDadosIniciais();
    } else {
      alert("Erro ao salvar instituição.");
    }
  }

  async function excluir(id) {
    if (confirm("Tem certeza que deseja excluir esta instituição?")) {
      await fetch(`${URL_INSTITUICOES}/${id}`, { method: 'DELETE' });
      buscarDadosIniciais();
    }
  }

  function prepararEdicao(item) {
    setIdEditando(item.id);
    setForm({
      nome: item.nome || '',
      cnpj: aplicarMascara('cnpj', item.cnpj),
      email: item.email || '',
      telefone: aplicarMascara('telefone', item.telefone),
      cep: aplicarMascara('cep', item.cep),
      logradouro: item.logradouro || '',
      numero: item.numero || '',
      complemento: item.complemento || '',
      cpfDiretor: aplicarMascara('cpf', item.cpfDiretor)
    });
    validarCpf(aplicarMascara('cpf', item.cpfDiretor));
    setModalAberto(true);
  }

  function limpar() {
    setIdEditando(null);
    setForm({ nome: '', cnpj: '', email: '', telefone: '', cep: '', logradouro: '', numero: '', complemento: '', cpfDiretor: '' });
    setNomeResponsavel('');
    setCpfValidado(false);
    setModalAberto(false);
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      
      {/* modal de adicionar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button 
          onClick={() => { limpar(); setModalAberto(true); }} 
          style={{ padding: '8px 14px', background: '#78d49e', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px', fontSize: '14px' }}
        >
          + Adicionar Instituição
        </button>
      </div>

      {/* modal de cadastro e edição */}
      <Modal isOpen={modalAberto} onClose={() => setModalAberto(false)}>
        <h3 style={{ textAlign: 'left' }}>{idEditando ? 'Editar Instituição' : 'Cadastrar Instituição'}</h3>
        <form onSubmit={salvar} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px', maxHeight: '420px', overflowY: 'auto' }}>
          
          <label style={{ fontSize: '12px', color: '#666', textAlign: 'left' }}>CPF do Diretor / Coordenador</label>
          <input type="text" name="cpfDiretor" placeholder="000.000.000-00" value={form.cpfDiretor} maxLength={14} onChange={handleChange} required style={{ padding: '8px' }} />

          <label style={{ fontSize: '12px', color: '#666', textAlign: 'left' }}>Nome do Responsável</label>
          <input type="text" value={nomeResponsavel} readOnly style={{ padding: '8px', background: '#f5f5f5', color: '#555' }} />

          {cpfValidado && (
            <>
              <label style={{ fontSize: '12px', color: '#666', textAlign: 'left' }}>Nome da Instituição</label>
              <input type="text" name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} required style={{ padding: '8px' }} />
              
              <label style={{ fontSize: '12px', color: '#666', textAlign: 'left' }}>CNPJ</label>
              <input type="text" name="cnpj" placeholder="00.000.000/0000-00" value={form.cnpj} maxLength={18} onChange={handleChange} required style={{ padding: '8px' }} />
              
              <label style={{ fontSize: '12px', color: '#666', textAlign: 'left' }}>E-mail</label>
              <input type="email" name="email" placeholder="E-mail" value={form.email} onChange={handleChange} required style={{ padding: '8px' }} />
              
              <label style={{ fontSize: '12px', color: '#666', textAlign: 'left' }}>Telefone</label>
              <input type="text" name="telefone" placeholder="(11) 91111-1111" value={form.telefone} maxLength={15} onChange={handleChange} required style={{ padding: '8px' }} />

              <label style={{ fontSize: '12px', color: '#666', textAlign: 'left' }}>CEP</label>
              <input type="text" name="cep" placeholder="00000-000" value={form.cep} maxLength={9} onChange={handleChange} onBlur={e => consultarCep(e.target.value)} required style={{ padding: '8px' }} />

              <label style={{ fontSize: '12px', color: '#666', textAlign: 'left' }}>Logradouro</label>
              <input type="text" name="logradouro" placeholder="Logradouro" value={form.logradouro} onChange={handleChange} required style={{ padding: '8px' }} />

              <label style={{ fontSize: '12px', color: '#666', textAlign: 'left' }}>Número</label>
              <input type="text" name="numero" placeholder="Número" value={form.numero} onChange={handleChange} required style={{ padding: '8px' }} />

              <label style={{ fontSize: '12px', color: '#666', textAlign: 'left' }}>Complemento (Opcional)</label>
              <input type="text" name="complemento" placeholder="Complemento" value={form.complemento} onChange={handleChange} style={{ padding: '8px' }} />
              
              <button type="submit" style={{ padding: '10px', background: '#78d49e', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px', marginTop: '5px' }}>
                {idEditando ? 'Atualizar Instituição' : 'Salvar Instituição'}
              </button>
            </>
          )}
        </form>
      </Modal>

      {/* modal de detalhes */}
      <Modal isOpen={modalDetalhesAberto} onClose={() => setModalDetalhesAberto(false)}>
        <h3 style={{ textAlign: 'left' }}>Detalhes da Instituição: {instituicaoSelecionada?.nome}</h3>
        <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '15px', color: '#333', textAlign: 'left' }}>
          <p><strong>CNPJ:</strong> {instituicaoSelecionada?.cnpj || 'Não informado'}</p>
          <p><strong>E-mail:</strong> {instituicaoSelecionada?.email || 'Não informado'}</p>
          <p><strong>Telefone:</strong> {instituicaoSelecionada?.telefone || 'Não informado'}</p>
          <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '5px 0' }} />
          <p><strong>Diretor(a):</strong> {instituicaoSelecionada?.diretor || 'Não informado'}</p>
          <p><strong>CEP:</strong> {instituicaoSelecionada?.cep || 'Não informado'}</p>
          <p><strong>Logradouro:</strong> {instituicaoSelecionada?.logradouro || 'Não informado'}</p>
          <p><strong>Número:</strong> {instituicaoSelecionada?.numero || 'Não informado'}</p>
          <p><strong>Complemento:</strong> {instituicaoSelecionada?.complemento || 'Nenhum'}</p>
        </div>
      </Modal>

      <Tabela 
        colunas={["Nome", "CNPJ", "E-mail", "Telefone", "Diretor"]} 
        chaves={["nome", "cnpj", "email", "telefone", "diretor"]} 
        dados={lista} 
        onEditar={prepararEdicao} 
        onExcluir={excluir} 
        onDetalhes={item => { setInstituicaoSelecionada(item); setModalDetalhesAberto(true); }}
        textoBotaoDetalhes="Detalhes"
      />
    </div>
  );
}