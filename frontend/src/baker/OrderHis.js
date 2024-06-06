import React,{useState,useEffect} from 'react'
import Sidebar from '../components/Sidebar';
import './ordHistory.css'
import './receOrder.css'
import axios from "axios";
import { useNavigate } from 'react-router-dom'

function OrderHis() {
    let navigate = useNavigate();
    const [showNav,setShowNav] = useState(true);
    const [orders,setOrders] = useState([])

    const fetchOrderHistory = async () => {
        await axios.get('http://localhost:5000/order/fetchorderhistforbaker',{
            withCredentials:true
        })
        .then((res)=>{
           console.log(14, res.data.allOrders)
           setOrders(res.data.allOrders) 
        })
    } 

    const verifyUser = async() => {
        await axios.get('http://localhost:5000/auth/verify',{
      withCredentials:true
  })
  .then((res)=>{

      if(res.data.msg === 'access denied'){
          navigate('/signin')
      }
      else if(res.data.userObj.stoken != 'baker'){
        navigate('*')
        // alert("Inavlid Access. Create Error Page");
    }         
  })
  .catch((res)=>{
    console.log(res.msg)
    navigate('/signin')
  })
    }
    useEffect(()=>{
        verifyUser()
        fetchOrderHistory()
    },[])

    let flag = 1
    return (
    <>
    <div>
        <Sidebar  show={showNav}/> 
        <div className="rOrderHead"><h3>Order History</h3></div>

        {
            orders.map((item,ind)=>{
                if(item.ostatus == 'done'){
                    flag = 0
                    return(
                        <div className="recOrdBox">
                    <div className="recOrdName">Order Id: <span className="recOrdVal">{item._id}</span></div>
                    <div className="recOrdName">Customer Name: <span className="recOrdVal">{item.name}</span></div>
                    <div className="recOrdName">
                          Customer Contact: <span className="recOrdVal">{item.contact}</span>
                        </div>
                    <hr className="lineBetweenOrder" color="#00ff00"/>
                    <div className="rowHeadingBaker">
                        <div>Product Name</div>
                        <div>Quantity</div>
                        <div>Price</div>
                    </div>
                    <hr className="lineBetweenOrder" color="#00ff00"/>
        
                    {
                          item.itemIds.map((i)=>{
                            return(
                            <div className="cOrderListRow">
                              <div>{i.iname}</div>
                              <div>{i.quantity}</div>
                              <div>{i.price}</div>
                            </div>
                            )
                          })
                        }  
                       
                    <hr className="lineBetweenOrder" color="#00ff00"/>
        
                    <div className="recOrdName">Order Date: <span className="recOrdVal">{item.oDate}</span></div>
                    <div className="recOrdName">Payment Type: <span className="recOrdVal">COD</span></div>
                </div>
                    )
                }
            })
        }

    {flag == 1 && <div className="rOrderHead">"You got no order history"</div>}              


    </div>
    </>
    )
}

export default OrderHis
