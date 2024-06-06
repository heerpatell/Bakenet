import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "./receOrder.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom'

function ReceOrder() {
  let navigate = useNavigate();
  const [showNav, setShowNav] = useState(true);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    await axios
      .get("http://localhost:5000/order/fetchordersforbaker", {
        withCredentials: true,
      })
      .then(async (res) => {
        await setData(res.data.allOrders);
        console.log(17,res.data.allOrders);
      });
  };

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
  useEffect(() => {
    verifyUser();
    fetchOrders();
  }, []);
 
  const orderDoneFn = (id) => {
    axios.post('http://localhost:5000/order/orderdone',{id},{
        withCredentials:true
    })
    .then((res)=>{
        if(res.data.msg == 'success') alert('Great!!, customer will be notified.')
    })
  }

  let flag = 1
  return (
    <>
      <div>
        <Sidebar show={showNav} />
        <div className="rOrderHead">
          <h3>Recent Orders</h3>
        </div>
        {
            data.length == 0 ?
            <div className="rOrderHead">"You got no recent order"</div>
            :
            data.map((item, ind) => {
              //show only pending orders
              if(item.ostatus != 'done'){ 
                flag=0
                return (
                    <div className="recOrdBox">
                    <div className="recOrdName">
                      Order Id: <span className="recOrdVal">{item._id}</span>
                    </div>
                    <div className="recOrdName">
                      Customer Name: <span className="recOrdVal">{item.name}</span>
                    </div>
                    <div className="recOrdName">
                      Customer Contact: <span className="recOrdVal">{item.contact}</span>
                    </div>
          
                    <hr className="lineBetweenOrder" color="#00ff00" />
                    <div className="rowHeadingBaker">
                      <div>Product Name</div>
                      <div>Quantity</div>
                      <div>Price</div>
                    </div>
                    <hr className="lineBetweenOrder" color="#00ff00" />
                    
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
                    <div className="rowItemBaker">
                          <div>{item.iname}</div>
                          <div>{item.quantity}</div>
                          <div>{item.price}</div>
                          
                        </div>
                    <hr className="lineBetweenOrder" color="#00ff00" />
        
                    <div className="recOrdName">
                      Payment Type: <span className="recOrdVal">COD</span>
                    </div>
                    <button
                      className="recOrdDone"
                      onClick={() => orderDoneFn(item._id)}
                    >
                      Order Done
                    </button>
                  </div>          
                );}
            })
        }    

{        flag == 1 && <div style={{marginLeft:'15rem'}}>You got no orders</div>}   
      </div>
    </>
  );
}

export default ReceOrder;
