import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate, useLocation, Link } from 'react-router-dom';
// import { useEffect } from 'react';

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
    alert('You are already logged in')
    window.location.href = '/'
  }

  if(location.pathname === '/texteditor'){
    document.title = 'TextEditor - Create New Doc'
  }else if(location.pathname === '/'){
    document.title = 'TextEditor - Home'
  }else if(location.pathname === '/about'){
    document.title = 'TextEditor - About'
  }else if(location.pathname === '/signup'){
    document.title = 'TextEditor - Signup'
  }else if(location.pathname === '/login'){
    document.title = 'TextEditor - Login'
  }else if(location.pathname === '/forget-password'){
    document.title = 'TextEditor - Forget Password'
  }else if(location.pathname === '/reset-password/:id/:token'){
    document.title = 'TextEditor - Reset Password'
  }else if(location.pathname === '/verify/:id/:token'){
    document.title = 'TextEditor - Verify Email'
  }else if(location.pathname === '/errorpage'){
    document.title = 'TextEditor - Error Page'
  }

  const linkstyle = {
    color: '#949494',
    textDecoration: 'none',
    marginLeft: '20px'
  }
 
  const HandleDeleteAccount = async () => {
    if(window.confirm('Are you sure you want to delete your account?')){
      const res1 = await fetch(`https://texteditor-three.vercel.app/api/v1/textarea/delete-user-text/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        }
      })
      console.log(res1);
      const res2 = await fetch(`https://texteditor-three.vercel.app/api/v1/textarea/delete-shared-text/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        } 
      })
      console.log(res2);
      const res = await fetch(`https://texteditor-three.vercel.app/api/v1/auth/deleteuser`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        }
      })
      const data = await res.json()
      if (data.success) {
        alert('Account Deleted Successfully')
        handlelogout()
      } else {
        alert('Something went wrong')
      }
    }
  }

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" variant='dark'>
        <Container>
          <Link to='/' style={{...linkstyle}}><Navbar.Brand >TextEditor</Navbar.Brand></Link>
          <Nav className='me-auto'>
            <Link to='/' style={{ ...linkstyle, ...location.pathname === '/' ? addthis : nullstate}}>Home</Link>
            <Link to='/about' style={{...linkstyle,...location.pathname === '/about' ? addthis : nullstate}}>About</Link>
          </Nav>
          <Nav>
            {localStorage.getItem('token') ? <Link onClick={HandleDeleteAccount} style={linkstyle}>Delete Account</Link> : null}
            {!localStorage.getItem('token') ? <Link to='/signup' style={{...linkstyle,...location.pathname === '/signup' || location.pathname === '/login' || location.pathname === '/forget-password' ? addthis : nullstate}}>Sign up</Link> : <Link style={linkstyle} onClick={handlelogout}>Logout</Link>}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default Navbaar;