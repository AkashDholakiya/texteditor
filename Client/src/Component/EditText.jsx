import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import Spinner from './Spinner'
import { Container,Form,Button,Modal,Stack } from 'react-bootstrap'
import JoditEditor from "jodit-react";
import io from 'socket.io-client'
import jsPDF from 'jspdf'
import '../css/edittext.css'

const EditText = () => {
    const [content, setContent] = useState('') 
    const [title, setTitle] = useState('')
    const [loading, setloading] = useState(false)
    const [canShare, setCanShare] = useState(true)
    const [username, setUsername] = useState('')
    const [selectedUser, setSelectedUser] = useState({username : [], id : []})
    const [sharedUsers, setSharedUsers] = useState([])
    const [users, setUsers] = useState(null)
    const [show, setShow] = useState(false);
    const socket = useRef(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const editor = useRef(null)
    const {id} = useParams()
    const fetchDocs = async () => {
        const res = await fetch(`https://texteditor-three.vercel.app/api/v1/textarea/edittext/${id}`, {
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
        setSharedUsers(data.text.EditAccessToUser)
        setCanShare(data.canShare)
    }


    useEffect(() => {
        setloading(true)
        fetchDocs()
        setloading(false)

        document.querySelector('.jodit-placeholder').innerHTML = ''
        socket.current = io('https://texteditor-three.vercel.app')

        return () => {
            socket.current.disconnect()
        }
        // eslint-disable-next-line
    }, [])


    useEffect(() => {
        socket.current?.on('updateData', (data) => {
            console.log(data.content)
            setTitle(data.title)
            document.querySelector('.jodit-wysiwyg').innerHTML = data.content
            setContent(data.content)
        })

        return () => {
            socket.current.off('updateData')
        }
    }, [title, content])

    
    const HandleUpdate1 = (e) => {
        setTitle(e.target.value)
        socket.current?.emit('updateData', {title: title, content: content, id: id})
    }

    const HandleUpdate2 = (val) => {
        setContent(val)
        socket.current?.emit('updateData', {title: title, content: content, id: id})
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
        const res = await fetch(`https://texteditor-three.vercel.app/api/v1/textarea/edittext/${id}`, {
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
        setUsername(e.target.value)
        const res = await fetch(`https://texteditor-three.vercel.app/api/v1/auth/search-user/?search=${username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token'),
          }
        })
        const data = await res.json()
        setUsers(data.data)
      }
      
      const HandleFiltering = (user) => {      
        setSelectedUser(prevState => ({...prevState, username: prevState.username.filter((username) => username !== user), id: prevState.id.filter((id) => id !== user._id)}))
      }
  
      const HandleSharingForm = async (e) => {
        e.preventDefault()
        const res = await fetch(`https://texteditor-three.vercel.app/api/v1/textarea/share-text/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token'),
          },
          body: JSON.stringify({id: selectedUser.id})
        })
        const data = await res.json() 
        fetchDocs()
        if(data.success){
          alert('Document Shared Successfully')
        }
        else{
          alert('Some Error Occured while sharing document')
        }
      }

      const RemoveAccess = (user) => {
        return async (e) => {
          e.preventDefault()
          const res = await fetch(`https://texteditor-three.vercel.app/api/v1/textarea/remove-access`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'auth-token': localStorage.getItem('token'),
            },
            body: JSON.stringify({id: id, removeuser: user._id})
          })
          const data = await res.json()
          if(!data.success){
            alert('Some Error Occured while removing access')
          }
          setSharedUsers(sharedUsers.filter((username) => username !== user))
        } 
      }  

      const ExportToPDF = () => {
        const input = document.querySelector('.jodit-wysiwyg');
        const pdf = new jsPDF('l', 'mm', [1500, 1200]);
        
        pdf.html(input, {
          callback: function (pdf) {
            pdf.save('Document.pdf');
          },
          x: 20,
          y: 20
        });
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
          <Button className='my-2 mx-2' variant="success" onClick={ExportToPDF}>Export to PDF</Button>
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
            <Stack style={styles.stackHeight1}>
              {users && users.map((user) => (
                  <div key={user._id} className='userlist' style={styles.scrollableDivUsers} onClick={() => setSelectedUser(prevState => ({...prevState, username: !prevState.username.includes(user.username) ? [...prevState.username, user.username] : prevState.username,
                    id : !prevState.id.includes(user._id) ? [...prevState.id, user._id] : prevState.id}))}>
                  <Form.Label style={{margin:"0"}}>Email : {user.email}</Form.Label>
                  <Form.Label style={{margin:"0"}}>Name : {user.username}</Form.Label>
                </div>
              ))}
            </Stack>
            {sharedUsers && <Stack style={styles.stackHeight}>
              <h6 className='my-2'>Shared With</h6>
              {sharedUsers && sharedUsers.map((user) => (
                <div key={user} style={styles.scrollableDivUsers2}>
                  <Form.Label style={{margin:"0"}}>Name : {user.username} </Form.Label>
                  <button className='btn btn-danger' onClick={RemoveAccess(user)}>X</button>
                </div>
              ))}
            </Stack>}
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
    scrollableDivUsers2: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: "50px",
      marginTop: "10px",
      border: "1px solid #000",
      borderRadius: "10px",
      padding: "10px",
      cursor: "pointer",
    },
    stackHeight1: {
      height: "250px",
      overflowY: "auto",
      marginTop: "5px",
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
