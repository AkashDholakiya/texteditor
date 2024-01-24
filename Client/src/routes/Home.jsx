import React, { useEffect, useState } from 'react'
import {Container,Card,Button} from 'react-bootstrap'
// import TextEditor from '../Component/TextEditor'
import io from 'socket.io-client'
const ENDPOINT = 'http://localhost:4000'

// var socket, 

const Home = () => {
  const [userdocs, setuserdocs] = useState('')
  const HandleNewDoc = () => {
    
  }

  useEffect(() => {
    const socket = io(ENDPOINT)
    socket.emit('join', {username: localStorage.getItem('username')})
    socket.on('getdocs', (data) => {
      console.log(data)
      setuserdocs(data)
    })
    return () => {
      socket.emit('disconnect')
      socket.off()
    }
  }, [])
  return (
    <Container>
      {!localStorage.getItem('username') ? 
        <h1 className='text-center my-5'>Home</h1>
      :
      <div className='my-5'>
       <Card style={{ width: '18rem' }}>
      {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
      <Card.Body>
        <Card.Title>Create New Doc</Card.Title>
        <Card.Text>
            Create a new document and start writing...
        </Card.Text>
        <Button variant="primary" onClick={HandleNewDoc}>Create</Button>
        </Card.Body>
      </Card>
      <hr />
      <h3>Recent Documents</h3>

      </div>
      }
    </Container>
  )
}

export default Home
