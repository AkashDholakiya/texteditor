import './App.css';
import {BrowserRouter as Router, Routes,Route} from 'react-router-dom';
import Navbar from './Component/Navbar';
import Home from './routes/Home';
import About from './routes/About';
import Contact from './routes/Contact';

function App() {
  return (
    <div className="App"> 
      <Router> 
        <Navbar />
        <Routes>  
          <Route path="/" element={<Home />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/contact" element={<Contact />}></Route>
        </Routes>
      </Router>
      <h1>So this is all about this</h1>
    </div>
  );
}

export default App;
