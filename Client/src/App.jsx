import React from 'react'
import {BrowserRouter, Routes,Route} from 'react-router-dom'
import Home from './Routes/Home'
import Navbaar from './Component/Navbaar'
import Footer from './Component/Footer'
import About from './Routes/About'
import ResetPassword from './Routes/ResetPassword' 
import VerifyEmail from './Routes/VerifyEmail'
import Signup from './Routes/Signup'
import Login from './Routes/Login'
import ForgotPass from './Routes/ForgotPass'
// import Dashboard from './Component/Dashboard'
import Errorpage from './Routes/Errorpage' 
// import Profile from './Routes/Profile'
import './App.css'

const App = () => { 
  return (
    <>
      <BrowserRouter> 
        <div id='main-content'> 
          <Navbaar/> 
          <Routes>   
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
            <Route path="/verify/:id/:token" element={<VerifyEmail />} />
            <Route path="/errorpage" element={<Errorpage />} />
            <Route path='/signup' element={<Signup />} /> 
            <Route path='/login' element={<Login />} />
            <Route path='/forget-password' element={<ForgotPass />} />
            {/* <Route path="/dashboard" element={<Dashboard  />} /> */}
            {/* <Route path="/profile" element={<Profile />} /> */}
          </Routes>
        </div>
          <Footer/>
      </BrowserRouter> 
    </>
  )
}

export default App
