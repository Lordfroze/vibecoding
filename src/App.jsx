import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Welcome from './pages/Welcome';
import NotesList from './pages/NotesList';
import NoteDetail from './pages/NoteDetail';
import NoteForm from './pages/NoteForm';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#0b0f19] text-gray-200 relative overflow-x-hidden">
        {/* Subtle blur decoration blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none -z-10"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none -z-10"></div>

        <Navbar />
        
        <main className="flex-grow flex flex-col relative z-10">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/notes" element={<NotesList />} />
            <Route path="/notes/new" element={<NoteForm />} />
            <Route path="/notes/edit/:id" element={<NoteForm />} />
            <Route path="/notes/:id" element={<NoteDetail />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
