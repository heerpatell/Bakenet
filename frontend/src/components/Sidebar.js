import React,{useState} from 'react'
import {Link} from 'react-router-dom'
import './sidebar.css'
import {FaHome} from 'react-icons/fa'
import {GiCakeSlice} from 'react-icons/gi'
import {BiReceipt} from 'react-icons/bi'
import {RiHistoryLine} from 'react-icons/ri'
import {FiLogOut} from 'react-icons/fi'
import {CgProfile} from 'react-icons/cg'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Sidebar({show}) {

    let navigate = useNavigate()

    const logOutClicked = () =>{
        try{
            axios.post("http://localhost:5000/auth/logout",{
                withCredentials:true
            })
            .then(res=>{
            console.log(res)
            navigate('/signin')
            if(res.data.msg=='deleted token'){
                console.log("error occured in logout",error)       
                const error = new Error(res.error)
            }
            })
        }
        catch(e){
            console.log("error: ",e)
        }
    }

    return (
    <>
    <div className={show ? 'sideNav active' : 'sideNav'}>
    <ul className="baker-list"> 
        <li className="baker-list-item"><Link to="/baker/profile" className="baker-list-link"><CgProfile/> Profile</Link></li>
        <li className="baker-list-item"><Link to="/baker/product" className="baker-list-link"><GiCakeSlice/>  Product</Link></li>
        <li className="baker-list-item"><Link to="/baker/recentorder" className="baker-list-link"><BiReceipt/>Recent Order</Link></li>
        <li className="baker-list-item"><Link to="/baker/orderhistory" className="baker-list-link"><RiHistoryLine/>Order History</Link></li>
        <li className="baker-list-item"><Link to="/signin" onClick={logOutClicked} className="baker-list-link"><FiLogOut/>Log out</Link></li>
    </ul>
    </div>
    </>
    )
}

export default Sidebar