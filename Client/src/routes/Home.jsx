import React, { useEffect, useState } from 'react'
import {Container,Card,Button,Row} from 'react-bootstrap'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import Spinner from '../Component/Spinner'
import ShowMyHtml from '../Component/ShowMyHtml'
// import io from 'socket.io-client'
// const ENDPOINT = 'http://localhost:4000'

// var socket, 

const Home = (props) => {
  const navigate = useNavigate()
  const [userdocs, setuserdocs] = useState('')
  const [sharedDocs, setSharedDocs] = useState('')
  const [shared, setShared] = useState(false)
  const [loading, setloading] = useState(false)

  const fetchDocs = async () => {
    const res = await fetch("http://localhost:4000/api/v1/textarea/get-text", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      }
    })
    const data = await res.json()
    setuserdocs(data.text)
  }

  const fetchSharedDocs = async () => {
    const res = await fetch("http://localhost:4000/api/v1/textarea/get-shared-text", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      }
    })
    const data = await res.json()
    setSharedDocs(data.text)
  }

  useEffect(() => {
    setloading(true)
    fetchDocs()
    fetchSharedDocs()
    setloading(false)
    // const socket = io(ENDPOINT)
    // socket.emit('join', {username: localStorage.getItem('username')})
    // socket.on('getdocs', (data) => {    
    //   console.log(data)
    //   setuserdocs(data)
    // })
    // return () => {
    //   socket.emit('disconnect')
    //   socket.off()
    // }
  }, [])

  const HandleEditText = (id) => {
    navigate(`/edittext/${id}`)
  }

  const HandleDelete = async (id) => {
    const res = await fetch(`http://localhost:4000/api/v1/textarea/delete-text`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      },
      body: JSON.stringify({id: id})
    })
    const data = await res.json()
    if(data.success){
      alert('Document Deleted Successfully')
      fetchDocs()
    }
    else{
      alert('Document not Deleted')
    }
  }
  return (
    <Container>
      {!localStorage.getItem('username') ? 
        <>
          <h1 className='text-center my-5'>TextEditor</h1>
          <p className='text-center my-5' style={{fontSize:"20px"}}> Join us to create doc files which can help you complete your assignment or to do any other work.</p>
          <Container className='d-flex justify-content-center align-items-center'>
            <Button variant='primary' onClick={() => navigate('/signup')}>Sign up</Button>
          </Container>
        </>
      :
      <div className='my-5'>
       <Card style={{ width: '18rem' }}>
      {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
      <Card.Body >
        <Card.Title>Create New Doc</Card.Title>
        <Card.Text>
            Create a new document and start writing...
        </Card.Text>
        <Button variant="primary" onClick={() => navigate('/texteditor')}>Create</Button>
        </Card.Body>
      </Card>
      <hr />
      <h3>Your Documents</h3>
      <Row className='justify-content-center'>
          <Button className='mx-2 w-25' variant={`${shared ? 'outline-' : ''}success`} onClick={() => setShared(false)}>My Docs</Button>
          <Button className='mx-2 w-25' variant={`${!shared ? 'outline-' : ''}success`} onClick={() => setShared(true)}>Shared with me</Button>
      </Row>
      {loading && <Spinner /> }

      {!shared ? <Row className='my-3'>
        {userdocs && userdocs.map((doc) => {
          return (
              <Card className='mx-3 my-3' style={{ width: '18rem' }} key={doc._id}>
              {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
              <Card.Body >
                <Card.Title>{doc.title.length > 23 ? doc.title.slice(0,20) + '...' :  doc.title}</Card.Title>
                <hr />
                <Card.Text style={{height:"50px"}}>
                    {doc.content.length > 60 ? 'Check in Edit...' : <ShowMyHtml val={doc.content}/>}
                </Card.Text>
                <Button variant="primary" onClick={() => HandleEditText(doc._id)}>Edit</Button>
                <Button className='mx-2' variant="danger" onClick={() => HandleDelete(doc._id)}>Delete</Button>
                </Card.Body> 
                <Card.Footer>
                  <small className="text-muted">Updated at {moment(doc.updatedAt).fromNow()}</small>
                </Card.Footer>
              </Card>
          )})}
          </Row> 
          :
          <Row className='my-3'>
          {sharedDocs && sharedDocs.map((doc) => {
            return (
                <Card className='mx-3 my-3' style={{ width: '18rem' }} key={doc._id}>
                {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                <Card.Body>
                  <Card.Title>{doc.title.length > 23 ? doc.title.slice(0,20) + '...' :  doc.title}</Card.Title>
                  <hr />
                  <Card.Text style={{height:"50px"}}>
                      {doc.content.length > 60 ? 'Check in Edit...' : <ShowMyHtml val={doc.content}/>}
                  </Card.Text>
                  <Button variant="primary" onClick={() => HandleEditText(doc._id)}>Edit</Button>
                  </Card.Body> 
                  <Card.Footer>
                    <small className="text-muted">Updated at {moment(doc.updatedAt).fromNow()}</small>
                  </Card.Footer>
                </Card>
                )
              })}
            </Row>
        }
      </div>
      }
    </Container>
  )
}

export default Home
