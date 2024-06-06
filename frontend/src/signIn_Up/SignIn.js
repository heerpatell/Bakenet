import React,{useState} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import './sign.css'
import axios from 'axios'
//import useHistory from 'useHistory'

function SignIn() {
    let navigate = useNavigate();
    const [inp,setInp] = useState({
        email:"", password:""
    })

    const handleInp = (e) =>{
        const {name,value} = e.target;
        setInp({...inp,[name]:[value]})
    }

    const handleSignIn=async()=>{
        await axios.post('http://localhost:5000/auth/signin',inp,{
            withCredentials:true
        })
        .then((res)=>{
            // console.log(23,res.data)
            if(res.data.msg === 'cookie created'){
                if(res.data.userToken === "customer"){
                    console.log('inside cust')
                    navigate('/customer/profile')
                }else if(res.data.userToken === "baker"){
                    console.log('inside baker')
                    navigate('/baker/profile')
                }
            }
            if(res.data.error){
                alert(res.data.error)
            }
        })
    }

    return (
    <>
    <div className="sign_main">
        <div className="sign_left"></div>

        <div className="sign_right">
            <div className="switchSign">Don't have an account? <span className="SignSpan"><Link to="/signup"  style={{textDecoration:'none', color:'#B61919'}}>Sign up</Link></span></div>
            <h3 className="headdTag">Sign in</h3>
            <form method="get" action="/signin">
                <div className='inRow'>
                    <div className="inCol">
                        <label className="inLabel">Email </label>
                        <input type="email" 
                        placeholder="Enter Email" 
                        className="inInp" 
                        name="email"
                        value={inp.email}
                        onChange={handleInp}></input> 
                    </div>   
                    <div className="inCol">
                        <label className="inLabel">Password </label>
                        <input type="password" 
                        placeholder="Enter Password" 
                        className="inInp" 
                        name="password"
                        value={inp.password}
                        onChange={handleInp}></input>
                    </div>
                </div>
                <div className="fpswd">Forgot Password ?</div>
            </form>
            <button type="submit" className="sBtn" onClick={handleSignIn}>Sign in</button>
        </div>
    
    </div>    
    </>
    )
}

export default SignIn
