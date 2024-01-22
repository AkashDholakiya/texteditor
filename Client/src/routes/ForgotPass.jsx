import React, { useState } from 'react'
import {Link } from 'react-router-dom'
import '../css/signup.css'

const ForgotPass = (props) => {
    const [cred, setcred] = useState({ email: ''});    
    const handle = async (e) => {
        let validation = true;
        if(cred.email === '') {
            alert("Please fill all the fields");
            validation = false;
        }
        if(validation){
            e.preventDefault();
            const response = await fetch(`http://localhost:4000/api/v1/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email:cred.email})
            })
            const json = await response.json();
            console.log(json);
            if (json.success) {
                alert("Email Sent Successfully to your email id");    
            } else {
                alert("Invalid Credentials");
            }
        }else{
            e.preventDefault();
        }
    }
    

    const onChange = (e) => {
        setcred({ ...cred, [e.target.name]: e.target.value })
    }
    return (
        <div className="outsider">
            <div className='logsig'>
                <h1 className='my-2'>Forgot Password</h1>
                <form onSubmit={handle}>
                    <div className="mb-2">
                        <label htmlFor="text" className="form-label"></label>
                        <input type="email" className="form-control" value={cred.email} onChange={onChange} id="email" name="email" aria-describedby="emailHelp" style={{width:'400px'}} placeholder='Email'/>
                    </div>
                    <div className='center'> 
                        <p className='my-2' style={{fontSize:'15px'}}>click me to <Link className='link' to={'/signup'}>Sign up</Link></p>
                    </div>
                    <div className="submit">
                    <button type="submit" className="mybtn btn btn-primary my-2">Send</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ForgotPass;