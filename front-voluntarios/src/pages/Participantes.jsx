import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import Tabela from '../components/Tabela';

export default function Participantes() {
  const [lista, setLista] = useState([]);
  const [form, setForm] = useState({
    nome: '', email: '', telefone: '', cpf: '', perfil: 'Voluntario', data_nascimento: ''
  });
  const [idEditando, setIdEditando] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);

  const URL_PARTICIPANTES = 'http://localhost:8080/participantes';

  useEffect(() => {
    buscarParticipantes();
  }, []);

  async function buscarParticipantes() {
    try {
      const resposta = await fetch(URL_PARTICIPANTES);
      setLista(await resposta.json());
    } catch (erro) {
      console.log(erro);
    }
  }

  // mascaras aplicadas
  const aplicarMascara = (tipo, valor) => {
    const limpo = (valor || '').replace(/\D/g, '');
    if (tipo === 'tel') {
      if (limpo.length <= 2) return limpo ? `(${limpo}` : '';
      if (limpo.length <= 7) return `(${limpo.slice(0, 2)}) ${limpo.slice(2)}`;
      return `(${limpo.slice(0, 2)}) ${limpo.slice(2, 7)}-${limpo.slice(7, 11)}`;
    }
    if (tipo === 'cpf') {
      return limpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4').substring(0, 14);
    }
    return valor;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formatado = value;
    if (name === 'telefone') formatado = aplicarMascara('tel', value);
    if (name === 'cpf') formatado = aplicarMascara('cpf', value);
    setForm(prev => ({ ...prev, [name]: formatado }));
  };

  async function salvar(evento) {
    evento.preventDefault();

    const telefoneLimpo = form.telefone.replace(/\D/g, '');
    if (telefoneLimpo.length !== 11) {
      return alert("Erro: O telefone deve conter exatamente 11 dígitos no formato (00) 00000-0000.");
    }

    // verificar a idade
    const hoje = new Date();
    const nascimento = new Date(form.data_nascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }

    if (idade < 18) {
      return alert("O participante precisa ter pelo menos 18 anos.");
    }

    const metodo = idEditando ? 'PUT' : 'POST';
    const endpoint = idEditando ? `${URL_PARTICIPANTES}/${idEditando}` : URL_PARTICIPANTES;

    try {
      const resposta = await fetch(endpoint, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (resposta.ok) {
        alert(idEditando ? "Participante atualizado com sucesso!" : "Participante cadastrado com sucesso!");
        limpar();
        buscarParticipantes();
      } else {
        alert("Erro ao salvar participante.");
      }
    } catch (erro) {
      console.log(erro);
    }
  }

  async function excluir(id) {
    if (confirm("Tem certeza que deseja excluir este participante?")) {
      try {
        await fetch(`${URL_PARTICIPANTES}/${id}`, { method: 'DELETE' });
        buscarParticipantes();
      } catch (erro) {
        console.log(erro);
      }
    }
  }

  function prepararEdicao(item) {
    setIdEditando(item.id);
    setForm({
      nome: item.nome || '',
      email: item.email || '',
      telefone: aplicarMascara('tel', item.telefone),
      cpf: aplicarMascara('cpf', item.cpf),
      perfil: item.perfil || 'Voluntario',
      data_nascimento: item.data_nascimento || ''
    });
    setModalAberto(true);
  }

  function limpar() {
    setIdEditando(null);
    setForm({ nome: '', email: '', telefone: '', cpf: '', perfil: 'Voluntario', data_nascimento: '' });
    setModalAberto(false);
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      
      {/* botões adiconar aplicados  */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button 
          onClick={() => { limpar(); setModalAberto(true); }} 
          style={{ padding: '8px 14px', background: '#78d49e', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px', fontSize: '14px' }}
        >
          + Adicionar Participante
        </button>
      </div>

      <Modal isOpen={modalAberto} onClose={() => setModalAberto(false)}>
        <h3 style={{ textAlign: 'left' }}>{idEditando ? 'Editar Participante' : 'Cadastrar Participante'}</h3>
        <form onSubmit={salvar} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
          
          <label style={{ fontSize: '12px', color: '#666', textAlign: 'left', width: '100%' }}>Nome Completo</label>
          <input type="text" name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} autoComplete="off" required style={{ padding: '8px', textAlign: 'left' }} />
          
          <label style={{ fontSize: '12px', color: '#666', textAlign: 'left', width: '100%' }}>E-mail</label>
          <input type="email" name="email" placeholder="E-mail" value={form.email} onChange={handleChange} autoComplete="off" required style={{ padding: '8px', textAlign: 'left' }} />
          
          <label style={{ fontSize: '12px', color: '#666', textAlign: 'left', width: '100%' }}>Telefone</label>
          <input type="text" name="telefone" placeholder="(00) 00000-0000" value={form.telefone} maxLength={15} onChange={handleChange} autoComplete="off" required style={{ padding: '8px', textAlign: 'left' }} />

          <label style={{ fontSize: '12px', color: '#666', textAlign: 'left', width: '100%' }}>CPF</label>
          <input type="text" name="cpf" placeholder="000.000.000-00" value={form.cpf} maxLength={14} onChange={handleChange} autoComplete="off" required style={{ padding: '8px', textAlign: 'left' }} />

          <label style={{ fontSize: '12px', color: '#666', textAlign: 'left', width: '100%' }}>Data de Nascimento</label>
          <input type="date" name="data_nascimento" value={form.data_nascimento} onChange={handleChange} required style={{ padding: '8px', textAlign: 'left' }} />

          <label style={{ fontSize: '12px', color: '#666', textAlign: 'left', width: '100%' }}>Perfil</label>
          <select name="perfil" value={form.perfil} onChange={handleChange} style={{ padding: '8px', textAlign: 'left' }}>
            <option value="Voluntario">Voluntário</option>
            <option value="Coordenador">Coordenador</option>
            <option value="Diretor">Diretor</option>
          </select>
          
          <button type="submit" style={{ padding: '10px', background: '#78d49e', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px', marginTop: '5px' }}>
            {idEditando ? 'Atualizar Participante' : 'Salvar Participante'}
          </button>
        </form>
      </Modal>

      <Tabela 
        colunas={["Nome", "E-mail", "Telefone", "CPF", "Data de Nascimento", "Perfil"]} 
        chaves={["nome", "email", "telefone", "cpf", "data_nascimento", "perfil"]} 
        dados={lista} 
        onEditar={prepararEdicao} 
        onExcluir={excluir} 
      />
    </div>
  );
}