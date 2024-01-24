import React, { useRef } from 'react'
import JoditEditor from "jodit-react";

const TextEditor = (props) => {
    const editor = useRef(null)
  return (
    <div>
      <JoditEditor ref={editor} tabIndex={1} onChange={(val) => props.setContent(val)}/> 
    </div>
  )
}

export default TextEditor
