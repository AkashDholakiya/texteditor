import React from 'react'

const ShowMyHtml = ({val}) => {
  return <div dangerouslySetInnerHTML={{__html : val}}/>
}

export default ShowMyHtml
