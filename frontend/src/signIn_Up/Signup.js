import React,{useState} from 'react'
import { Link } from 'react-router-dom'
import './sign.css'
import axios from 'axios'

function Signup() {

    const [inp,setInp] = useState({
        name:"",uname:"",email:"",pswd:"", stoken:""
    })

    const handleInp = (e) =>{
        const {name,value} = e.target;
        setInp({...inp,[name]:value})
    }

    const handleSubmit = (e) => {
        console.log(inp)
        e.preventDefault(); // prevents automatic reload
        axios.post('http://localhost:5000/auth/register',inp,{
            withCredentials:true
        })
        .then((res)=>{
            console.log(res);
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
            <div className="switchSign">Already have an account? <span className="SignSpan"><Link to="/signin"  style={{textDecoration:'none', color:'#B61919'}}>Sign In</Link></span></div>
            <h3 className="headdTagUp">Sign up</h3>
            <form method="post" action="/signup"> 
                <div className="upRow">
                    <div className="upCol">
                        <label className="inLabel">Name* </label>
                        <input type="text"
                        placeholder="Name" 
                        className="upInpR" 
                        name="name" 
                        value={inp.name}
                        onChange={handleInp}></input>
                    </div>   
                    <div className="upCol">   
                        <label className="inLabel">Username* </label>
                        <input type="text" 
                        placeholder ="Username" 
                        className="upInpR" 
                        name="uname"
                        value={inp.uname} 
                        onChange={handleInp}></input>
                    </div>    
                </div>   
                <div className="upRow">
                    <div className="upCol">
                        <label className="inLabel">Email* </label>
                        <input type="email" 
                        placeholder="Email" 
                        className="upInp"
                        name="email" 
                        value={inp.email}
                        onChange={handleInp}></input>   
                    </div>
                </div>        
                <div className="upRow">
                    <div className="upCol">
                        <label className="inLabel">Password* </label>
                        <input type="password" 
                        placeholder="Password"
                        className="upInp" 
                        name="pswd" 
                        value={inp.pswd}
                        style={{marginBottom:'1rem'}}
                        onChange={handleInp}></input>
                    </div>
                </div>
                <div className="upCol">
                    <div onChange={handleInp}>
                        <div className="upRow ">
                            <input type="radio" 
                            className="checkSignUp" 
                            name="stoken" 
                            value="customer"></input><span>Customer</span>
                        </div>
                        <div className="upRow ">
                            <input type="radio" 
                            className="checkSignUp" 
                            name="stoken" 
                            value="baker"></input><span>Baker</span>
                        </div>
                    </div>   
                </div>
                <br/>
                <div className="upRow">
                    <label for="signCheck" >Creating an account means you’re okay with our Terms of Service, Privacy Policy.     </label>
                </div>
                
            </form>
            <button type="submit" className="sBtn" onClick={handleSubmit}>Sign up</button>
        </div>
    
    </div>
    </>
    )
}

export default Signup
