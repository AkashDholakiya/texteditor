import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

const VerifyEmail = () => {
    const Navigate = useNavigate();
    const { id, token } = useParams();
    const userVerify = async () => {
        const response = await fetch(`https://texteditor-backend-sigma.vercel.app/api/v1/auth/verify/${id}/${token}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        const json = await response.json();
        if(!json.success){   
            Navigate('/errorpage')
        }
    }
    useEffect(() => {
        userVerify();
        // eslint-disable-next-line
    },[])
    const handle = async (e) => {
        e.preventDefault();
        const response = await fetch(`https://texteditor-backend-sigma.vercel.app/api/v1/auth/verify/${id}/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        const json = await response.json();
        if(json.success){   
            alert("Email Verified Successfully");
            Navigate('/')
        }else{
            alert("Something went wrong");
        }
    }
  return (
    <div className='container logsig'>
        <form onSubmit={handle}>
            <h3>Click the below button to verify your email</h3>
            <div className="submit">
                <button type="submit" className="btn btn-primary my-2">Verify</button>
            </div>
        </form>
    </div>
  )
}

export default VerifyEmail