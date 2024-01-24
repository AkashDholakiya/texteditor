import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate, useLocation, Link } from 'react-router-dom';

function Navbaar() {
  const addthis = { color: 'white' }
  const nullstate = { color: '#949494' }
  const navigate = useNavigate()
  const handlelogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    navigate('/')
    window.location.reload();
  }
  const location = useLocation()
  const path = location.pathname
  if (localStorage.getItem('username') && (path === '/signup' || path === '/login' || path === '/forget-password' || path === '/reset-password/:id/:token' || path === '/verify/:id/:token')) {
    navigate('/')
  }

  const linkstyle = {
    color: '#949494',
    textDecoration: 'none',
    marginLeft: '10px'
  }
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" variant='dark'>
        <Container>
          <Navbar.Brand href="/" >Navbar</Navbar.Brand>
          <Nav className='me-auto'>
            <Link to='/' style={{ ...linkstyle, ...location.pathname === '/' ? addthis : nullstate}}>Home</Link>
            <Link to='/about' style={{...linkstyle,...location.pathname === '/about' ? addthis : nullstate}}>About</Link>
          </Nav>
          <Nav>
            {!localStorage.getItem('token') ? <Link to='/signup' style={{...linkstyle,...location.pathname === '/signup' || location.pathname === '/login' || location.pathname === '/forget-password' ? addthis : nullstate}}>Sign up</Link> : <Link style={linkstyle} onClick={handlelogout}>Logout</Link>}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default Navbaar;