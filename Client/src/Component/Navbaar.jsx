import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function Navbaar() {
  const navigate = useNavigate()
  const handlelogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    navigate('/')
  }
  const location = useLocation()
  const path = location.pathname
  if(localStorage.getItem('username') && (path === '/signup' || path === '/login' || path === '/forget-password' || path === '/reset-password/:id/:token' || path === '/verify/:id/:token')){
    navigate('/')
  }
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" variant='dark'>
        <Container>
          <Navbar.Brand href="/" >Navbar</Navbar.Brand>
          <Nav className='me-auto'>
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/about">About</Nav.Link>
          </Nav>
          <Nav>
              {!localStorage.getItem('token') ? <Nav.Link href="/signup">Sign up</Nav.Link> : <Nav.Link onClick={handlelogout}>Logout</Nav.Link>}
          </Nav> 
        </Container>
      </Navbar>
    </>
  );
}

export default Navbaar;