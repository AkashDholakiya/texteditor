import React,{useState} from 'react'
import { Link } from 'react-router-dom';
import '../css/signup.css'
import {AiOutlineEyeInvisible} from 'react-icons/ai'
import {AiOutlineEye} from 'react-icons/ai'

const Signup = (props) => {
    const [cred, setcred] = useState({username : '',email : '',password : '',cpassword: ''})
    const [eyeshow1, seteyeshow1] = useState(false);
    const [eyeshow2, seteyeshow2] = useState(false);

    const handle = async (e) => {
        let validation = true;
        const regexUsername = /^[a-zA-Z0-9]+([_]?[a-zA-Z0-9])*$/;
        if(cred.username === '' || cred.email === '' || cred.password === '' || cred.cpassword === '' ) {
            alert("Please fill all the fields");
            validation = false;
        }
        else if(regexUsername.test(cred.username) === false){
            alert("Username must be alphanumeric");
            validation = false;
        }
        else if(cred.password !== cred.cpassword){
            alert("Password and Confirm Password must be same");
            validation = false;
        }
        if(validation){
            e.preventDefault();
            const {username,email,password} = cred;
            const response = await fetch(`https://texteditor-three.vercel.app/api/v1/auth/register`,{
                method : 'POST',
                headers : { 
                    'Content-Type' : 'application/json',
                }, 
                body : JSON.stringify({username,email,password})
            })  
            const json = await response.json();
            console.log(json);  
            if(json.success){   
                alert("Email Sent Successfully to your email id Verify your account under 1 hour");
                // props.showAlert("Account Created Successfully","success");
            }else{
                alert("Invalid Credentials");
                // props.showAlert("Invalid Credentials","danger");
            }
        }else{
            e.preventDefault();
        }
    }

    const onChange = (e) => {
        setcred({...cred, [e.target.name] : e.target.value})
    }
    return (
        <div className='outsider'>
            <div className="logsig">
                <h1 className='my-5'>Sign Up</h1>
                <form onSubmit={handle}> 
                    <div className="mb-1">
                        {/* <label htmlFor="name" className="form-label"></label> */}
                        <input type="name" className="form-control"  value={cred.name} onChange={onChange} id="username" name="username" aria-describedby="emailHelp" required placeholder='Username'/>
                        <label htmlFor="email" className="form-label"></label>
                        <input type="email" className="form-control" value={cred.email} onChange={onChange} id="email" name="email" aria-describedby="emailHelp" required placeholder='Email'/>
                    </div>
                    <div className="mb-1">
                        <label htmlFor="password" className="form-label"></label>
                        <div className="input-group passeye">
                            <input type="password" className="form-control" value={cred.password} onChange={onChange} id="password" name='password' required placeholder='Password'/>
                            {!eyeshow1 ? <span className='eye' onClick={() => {seteyeshow1(!eyeshow1)
                            document.getElementById('password').type = eyeshow1 ? 'password' : 'text';}}><AiOutlineEyeInvisible/></span>
                            : <span className='eye' onClick={() => {seteyeshow1(!eyeshow1)
                            document.getElementById('password').type = eyeshow1 ? 'password' : 'text';
                            }}><AiOutlineEye/></span>}
                        </div>  
                    </div>
                    <div className="mb-1">
                        <label htmlFor="cpassword" className="form-label"></label>
                        <div className="input-group passeye">
                            <input type="password" className="form-control" value={cred.cpassword} onChange={onChange} id="cpassword" name='cpassword' required placeholder='Confirm Password'/>
                            {!eyeshow2 ? <span className='eye' onClick={() => {seteyeshow2(!eyeshow2)
                            document.getElementById('cpassword').type = eyeshow2 ? 'password' : 'text';}}><AiOutlineEyeInvisible/></span>
                            : <span className='eye' onClick={() => {seteyeshow2(!eyeshow2)
                            document.getElementById('cpassword').type = eyeshow2 ? 'password' : 'text';
                            }}><AiOutlineEye/></span>}
                        </div>
                    </div>
                    <div className='center'> 
                        <p className='my-2' style={{fontSize:'15px'}}>Already Have an Account? <Link className='link' to='/login'>Login</Link></p>
                    </div>
                    <div className="submit">
                        <button type="submit" className=" mybtn btn btn-primary my-2">Sign Up</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup