import React, {  useRef, useState } from 'react'
import { Container,Form,Button } from 'react-bootstrap'
import JoditEditor from "jodit-react";

const TextEditor = () => {
    const [content, setContent] = useState('') 
    const [title, setTitle] = useState('')
    const editor = useRef(null)

    const handleSubmit = async (e) => {
      e.preventDefault()

      if(title === ''){
        alert('Please enter title')
        return
      }else if(content === '<p><br></p>'){
        alert('Please enter content')
        return
      }
      const res = await fetch("https://texteditor-three.vercel.app/api/v1/textarea/add-text", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({title,content})
      })
      const data = await res.json()
      if(data.success){
        alert('Document Created Successfully')
      }
      else{
        alert('Document not created')
      }
    }

  return (
    <Container>
      <h1 className='my-2 text-center'>TextEditor</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="my-2" controlId="exampleForm.ControlTextarea1">
          <hr />
          <Form.Label>Title</Form.Label>
          <Form.Control type='name' value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Enter Title of the document here...'/>
        </Form.Group>
        <hr />
        <JoditEditor ref={editor} tabIndex={1} onChange={(val) => setContent(val)}/> 
        <hr />
        <div className="d-flex justify-content-center">
          <Button className='my-2 mx-2' variant="primary" type="submit">Done</Button>
        </div>  
      </Form>
    </Container>
  )
}

export default TextEditor
