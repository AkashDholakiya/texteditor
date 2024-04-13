import React, { useState } from 'react'
import { useNavigate,Link } from 'react-router-dom'
import '../css/signup.css'
import {AiOutlineEyeInvisible} from 'react-icons/ai'
import {AiOutlineEye} from 'react-icons/ai'

const Login = (props) => {
    const [cred, setcred] = useState({ nameemail: '', password: ''});
    const [eyeshow, seteyeshow] = useState(false);
    let Navigate = useNavigate();
    const handle = async (e) => {
        let validation = true;
        if(cred.nameemail === '' || cred.password === '' ) {
            alert("Please fill all the fields");
            validation = false;
        }
        
        if(validation){
            e.preventDefault();
            const response = await fetch(`https://texteditor-yab4.onrender.com/api/v1/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nameemail: cred.nameemail, password: cred.password})
            })
            const json = await response.json();
            if (json.success) {
                localStorage.setItem('token', json.token);
                localStorage.setItem('username', json.data.username);
                alert("Login Successful"); 
                Navigate("/");
                window.location.reload();
            } else {
                alert(json.message);
            }
        }else{
            e.preventDefault();
        }
    }
    const onChange = (e) => {
        setcred({ ...cred, [e.target.name]: e.target.value })
    }
    const addstyle = {
        fontweight: 'bold'
    }
    return (
        <div className="outsider">
        <div className='logsig'>
            <h1 className='my-4'>Login</h1>
            <form onSubmit={handle}>
                <div className="mb-1">
                    <label htmlFor="nameemail" className="form-label"></label>
                    <input type="name" className="form-control" value={cred.nameemail} onChange={onChange} id="nameemail" name="nameemail" aria-describedby="nameemailHelp" placeholder='Username or Email'/>
                </div>
                <div className="mb-1">
                <label htmlFor="password" className="form-label"></label>
                    <div className="input-group passeye">
                        <input type="password" className="form-control" value={cred.password} onChange={onChange} id="password" name='password' placeholder='Password'/>
                        {!eyeshow ? <span className='eye' onClick={() => {seteyeshow(!eyeshow)
                        document.getElementById('password').type = eyeshow ? 'password' : 'text';}}><AiOutlineEyeInvisible/></span>
                        : <span className='eye' onClick={() => {seteyeshow(!eyeshow)
                        document.getElementById('password').type = eyeshow ? 'password' : 'text';
                        }}><AiOutlineEye/></span>}
                    </div>
                </div>
                <div className="center my-3">
                <Link className='link' to='/forget-password'>Forgot Password?</Link>
                </div>
                <div className='center'>
                    <p style={addstyle}>Don't Have an Account? <Link className='link' to='/signup'>Signup</Link></p>
                </div>
                <div className="submit">
                <button type="submit" className="mybtn btn btn-primary my-2">Login</button>
                </div>
            </form>
        </div>
        </div>
    )
}

export default Login