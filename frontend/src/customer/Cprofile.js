import React,{useState,useEffect} from 'react'
import SidebarCustomer from '../components/SidebarCustomer'
import { useNavigate } from 'react-router-dom'
import './cprofile.css'
import axios from 'axios'

function Cprofile() {
    let navigate = useNavigate();
    const [inp,setInp] = useState({
        name:"",
        email:"",
        role:"",
        city:"",
        area:"",
        cont:""
    })
    const [userId,setUserId] = useState('')

    const verifyUser = async () => {
        await axios.get('http://localhost:5000/auth/verify',{
            withCredentials:true
        })
        .then((res)=>{
            // console.log(res.data)

            if(res.data.msg === 'access denied'){
                navigate('/signin')
            }
            else if(res.data.userObj.stoken != 'customer'){
                navigate('*')
                // alert("Inavlid Access. Create Error Page");
            }
            else if(res.data.userObj.stoken == 'customer'){
                    setUserId(res.data.userObj._id)

                    setInp({
                        name: res.data.userObj.name,
                        email: res.data.userObj.email,
                        role: res.data.userObj.stoken,
                        cont: res.data.userObj.contact,
                        area: res.data.userObj.area,
                        city: res.data.userObj.city
                    })
                }          
        })
        .catch((res)=>{
            console.log(res.msg)
            navigate('/signin')
        })
    }

    useEffect(()=>{
       verifyUser() 
    },[])

    const handleInp = (e) =>{
        const {name,value} = e.target;
        setInp({...inp,[name]:value});
    }

    const handleSave = (e) => {
        e.preventDefault()
        console.log(inp)

        const fields = {
            userId,city:inp.city,area:inp.area,cont:inp.cont
        }
        // console.log(fields)
        axios.post('http://localhost:5000/prof/submit',fields,{
            withCredentials:true
        })
        .then((res)=>{
            if(res.data.error){
                alert(res.data.error)
            }
        })
        .catch((e)=>{
            console.log(e)
        })  
    }

    const [showNav,setShowNav]= useState(true)
    return (
    <>
        <SidebarCustomer show={showNav}/>   

        <div className="bprofile">
            <div className="logOutRow">
                <button className="logOutBtn" onClick={console.log("logout clicked")}>Log out</button>
            </div>    

            <h3 className="proDet">Profile Details</h3>
            
            <form method="post" action="/baker/profile">
                <div className="proRow">
                    <div className="proCol">
                        <label className="proLab">Role*</label><br/>
                        <input type="text"
                        className="proIn"
                        name="role"
                        value={inp.role}
                        readOnly={true}
                        />
                    </div>   
                    <div className="proCol">
                        <label className="proLab">Name*</label><br/>
                        <input type="text"
                        className="proIn"
                        name="uname"
                        value={inp.name}
                        readOnly={true}
                        />
                    </div>
                </div>   

                <div className="proRow">
                <div className="proCol">
                        <label className="proLab">Email*</label><br/>
                        <input type="email"
                        className="proIn"
                        name="email"
                        value={inp.email}
                        readOnly={true}
                        />
                    </div>
                    <div className="proCol">
                        <label className="proLab">Contact*</label><br/>
                        <input type="text"
                        className="proIn"
                        name="cont"
                        value={inp.cont}
                        onChange={handleInp}
                        />
                    </div>   
                </div>

                <div className="proRow">
                <div className="proCol">
                        <label className="proLab">Area*</label><br/>
                        <input type="text"
                        className="proIn"
                        name="area"
                        value={inp.area}
                        onChange={handleInp}
                        />
                    </div>
                    <div className="proCol">
                        <label className="proLab">City*</label><br/>
                        <input type="text"
                        className="proIn"
                        name="city"
                        value={inp.city}
                        onChange={handleInp}
                        />
                    </div>   
                </div>

                <div className="proBtnRow"> 
                    <button type="submit" className="proSaveBtn" onClick={handleSave}>Save</button>
                </div>
            </form>
        </div>
    </>
    )
}

export default Cprofile
