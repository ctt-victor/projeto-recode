// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CabecalhoAcoes from './components/CabecalhoAcoes';
import Instituicoes from './pages/Instituicoes';
import Participantes from './pages/Participantes';
import Projetos from './pages/Projetos';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Instituicoes />} />
            <Route path="/voluntarios" element={<Participantes />} />
            <Route path="/projetos" element={<Projetos />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}