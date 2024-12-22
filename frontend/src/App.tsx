import { BrowserRouter, Routes, Route } from 'react-router';
import { Toaster } from "@/components/ui/toaster";
import Navbar from './components/Navbar';
import List from './pages/snippets/List';
import Create from './pages/snippets/Create';
import Login from './pages/login';
import Register from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<List />} />
          <Route path="/create" element={<Create />} />
          <Route path="/edit/:id" element={<Create />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;