import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import Spinner from './Spinner'
import { Container,Form,Button,Modal,Stack } from 'react-bootstrap'
import JoditEditor from "jodit-react";
import io from 'socket.io-client'

const EditText = () => {
    const [content, setContent] = useState('') 
    const [title, setTitle] = useState('')
    const [loading, setloading] = useState(false)
    const [canShare, setCanShare] = useState(true)
    const [username, setUsername] = useState('')
    const [selectedUser, setSelectedUser] = useState({username : [], id : []})
    const [users, setUsers] = useState(null)
    const [show, setShow] = useState(false);
    const socket = io('http://localhost:4000')

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const editor = useRef(null)
    const {id} = useParams()
    const fetchDocs = async () => {
        const res = await fetch(`http://localhost:4000/api/v1/textarea/edittext/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token'),
            }
        }) 
        const data = await res.json()
        setContent(data.text.content)   
        document.querySelector('.jodit-wysiwyg').innerHTML = data.text.content
        setTitle(data.text.title)
        setCanShare(data.canShare)
    }

    useEffect(() => {
        setloading(true)
        fetchDocs()
        setloading(false)

        document.querySelector('.jodit-placeholder').innerHTML = ''
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        socket.on('updatedData', (data) => {
           setContent(data.content)  
           setTitle(data.title)
        })
        return () => {
          socket.disconnect()
        }
        // eslint-disable-next-line
      }, []) 

    const HandleUpdate1 = (e) => {
        setTitle(e.target.value)
        socket.emit('updateData', {title: title, content: content, id: id})
    }

    const HandleUpdate2 = (val) => {
        setContent(val)
        socket.emit('updateData', {title: title, content: content, id: id})
    }   

    const handleFormSubmit = async (e) => {
        e.preventDefault()

        if(title === ''){
            alert('Please enter title')
            return
        }else if(content === '<p><br></p>'){
            alert('Please enter content')
            return
        }
        const res = await fetch(`http://localhost:4000/api/v1/textarea/edittext/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token'),
            },
            body: JSON.stringify({title,content})
        })
        const data = await res.json()
        if(data.success){
            alert('Document Edited Successfully')
        }
        else{
            alert('Document not Edited')
        }
    }

    const HandleUserNameChange = async (e) => {
        e.preventDefault()
        setloading(true)
        setUsername(e.target.value)
        const res = await fetch(`http://localhost:4000/api/v1/auth/search-user/?search=${username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token'),
          }
        })
        const data = await res.json()
        setloading(false)
        setUsers(data.data)
      }
      
      const HandleFiltering = (user) => {      
        const index = selectedUser.username.indexOf(user)
        const idIndex = selectedUser.id.indexOf(users[index]._id)
        const newUsername = [...selectedUser.username]
        const newId = [...selectedUser.id]
        newUsername.splice(index, 1)
        newId.splice(idIndex, 1)
        setSelectedUser(prevState => ({...prevState, username: newUsername, id: newId}))
      }
  
      const HandleSharingForm = async (e) => {
        e.preventDefault()
        const res = await fetch(`http://localhost:4000/api/v1/textarea/share-text/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token'),
          },
          body: JSON.stringify({id: selectedUser.id})
        })
        const data = await res.json()
        if(data.success){
          alert('Document Shared Successfully')
        }
        else{
          alert('Document not Shared')
        }
      }
  return (
    <Container>
    <h1 className='my-2 text-center'>TextEditor</h1>
    {loading && <Spinner/>}
    <Form onSubmit={handleFormSubmit}>
      <Form.Group className="my-2" controlId="exampleForm.ControlTextarea1">
        <hr />
        <Form.Label>Title</Form.Label>
        <Form.Control type='name' value={title} onChange={HandleUpdate1} placeholder='Enter Title of the document here...'/>
      </Form.Group>
      <hr />
      <JoditEditor ref={editor} tabIndex={1} onChange={HandleUpdate2}/> 
      <hr />
      <div className="d-flex justify-content-center">
          <Button className='my-2 mx-2' variant="primary" type="submit">Done</Button>
          {canShare && <Button className='my-2 mx-2' variant="primary" onClick={handleShow}>Share</Button>}
        </div>      
    </Form>
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} >
        <Modal.Header closeButton>
          <Modal.Title>Share Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={HandleSharingForm}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control type="name" placeholder="Search user..." onChange={HandleUserNameChange}/>
            </Form.Group>
            <Stack direction='horizontal' gap={2} style={styles.HorizontalStackStyle}>
              {selectedUser.username && selectedUser.username.map((user) => (
                <Button key={user} style={{backgroundColor:"#000", color:"#fff", borderRadius:"10px", minWidth:"70px", padding:"7px"}} onClick={() => HandleFiltering(user)}>
                  {user + "  X"}
                </Button>
              ))} 
            </Stack>
            {loading && <Spinner/>}
            <Stack style={styles.stackHeight}>
              {users && users.map((user) => (
                  <div key={user._id} style={styles.scrollableDivUsers} onClick={() => setSelectedUser(prevState => ({...prevState, username: !prevState.username.includes(user.username) ? [...prevState.username, user.username] : prevState.username,
                    id : !prevState.id.includes(user._id) ? [...prevState.id, user._id] : prevState.id}))}>
                  <Form.Label style={{margin:"0"}}>Email : {user.email}</Form.Label>
                  <Form.Label style={{margin:"0"}}>Name : {user.username}</Form.Label>
                </div>
              ))}
            </Stack>
            <hr />
            <Button variant="primary" style={{marginRight:"10px"}} onClick={handleClose} type='submit'>
              Save Changes
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  )
}
const styles = {
    scrollableDivUsers: {
      display: "flex",
      flexDirection: "column",
      alignItems: "start",
      justifyContent: "center",
      height: "50px",
      marginTop: "10px",
      border: "1px solid #000",
      borderRadius: "10px",
      padding: "10px",
      cursor: "pointer",
    },
    stackHeight: {
      maxHeight: "250px",
      height: "auto",
      marginTop: "5px",
    },
    HorizontalStackStyle: {
      maxWidth: "100%",   
      overflowX: "auto", 
      marginTop: "5px",
    },
  };

export default EditText
