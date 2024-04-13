import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import '../css/signup.css'
import {AiOutlineEyeInvisible} from 'react-icons/ai'
import {AiOutlineEye} from 'react-icons/ai'

const ResetPassword = () => {
    const Navigate = useNavigate();
    const { id, token } = useParams();
    const [cred, setcred] = useState({ password: ''});
    const [eyeshow, seteyeshow] = useState(false);
    const validateUser = async () => {
        const res = await fetch(`https://texteditor-yab4.onrender.com/api/v1/auth/reset-password/${id}/${token}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        const data = await res.json();
        console.log(data);
        if (data.success) {
            console.log("User Valid");
        } else {
            Navigate('/errorpage');
            alert("TOKEN EXPIRED!!");
        }
    }
    const handle = async (e) => {
        let validation = true;
        if(cred.password === '') {
            alert("Please fill all the fields");
            validation = false;
        }
        if(validation){
            e.preventDefault();
            const response = await fetch(`https://texteditor-yab4.onrender.com/api/v1/auth/reset-password/${id}/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password: cred.password })
            })
            const json = await response.json();
            console.log(json);
            if (json.success) {
                alert("Password Changed Successfully");
                Navigate('/login')
            } else {
                alert("Invalid Credentials");
            }
        }
        else{ 
            console.log("Invalid Credentials");
            e.preventDefault();
        }   
    }

    useEffect(() => {
        validateUser();
        // eslint-disable-next-line
    }, [])
    console.log(cred);
    const onChange = (e) => {
        setcred({ ...cred, [e.target.name]: e.target.value })
    }
  return (
    <div>
      <div className='container logsig'>
            <h1 className='my-4'>Reset Password</h1>
            <form onSubmit={handle}>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">New Password</label>
                    <div className="input-group passeye">
                        <input type="password" className="form-control" value={cred.password} onChange={onChange} id="password" name='password' />
                        {!eyeshow ? <span className='eye' onClick={() => {seteyeshow(!eyeshow)
                        document.getElementById('password').type = eyeshow ? 'password' : 'text';}}><AiOutlineEye/></span>
                        : <span className='eye' onClick={() => {seteyeshow(!eyeshow)
                        document.getElementById('password').type = eyeshow ? 'password' : 'text';
                        }}><AiOutlineEyeInvisible/></span>}
                    </div>
                </div>
                <div className="submit">
                <button type="submit" className="btn btn-primary my-2">Send</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default ResetPassword