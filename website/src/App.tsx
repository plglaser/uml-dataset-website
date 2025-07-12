import './App.css'
import Navbar from './components/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SearchPage from './pages/SearchPage';
import ModelDetails from './pages/ModelDetailsPage';

function App() {
  return (
    <BrowserRouter basename="/uml-dataset-website">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/model/:name" element={<ModelDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
