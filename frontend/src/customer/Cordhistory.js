import React, { useState, useEffect } from "react";
import SidebarCustomer from "../components/SidebarCustomer";
import "./cprofile.css";
import axios from "axios";
import "./cordhistory.css";
import "./crecorder.css";
import { useNavigate } from 'react-router-dom'
import { AiOutlinePlus } from "react-icons/ai";

function Cordhistory() {
  let navigate = useNavigate()
  const [showNav, setShowNav] = useState(true);
  const [orders, setOrders] = useState([]);

  const verifyUser = async () => {
    await axios.get('http://localhost:5000/auth/verify',{
            withCredentials:true
        })
        .then((res)=>{
          if(res.data.msg === 'access denied'){
            navigate('/signin')
        }
        else if(res.data.userObj.stoken != 'customer'){
            navigate('*')
            // alert("Inavlid Access. Create Error Page");
        }
        })
        .catch((res)=>{
          console.log(res.msg)
          navigate('/signin')
      })
  }
  
  const fetchOrderHistory = async () => {
    await axios
      .get("http://localhost:5000/order/fetchorderhistforcustomer", {
        withCredentials: true,
      })
      .then((res) => {
        console.log(18, res.data.allOrders);
        setOrders(res.data.allOrders);
      });
  };

  useEffect(() => {
    verifyUser()
    fetchOrderHistory();
  }, []);
  return (
    <>
      <div>
        <SidebarCustomer show={showNav} />
        <div className="custOrderHstory">
          <div className="custOrderHistoryMain">Order History</div>

          {orders.map((item) => {
            if(item.ostatus != 'pending'){
                return (
                      <div className="orderListBox">
                        <div className="cOrderListRowHeading">
                          <div>Name</div>
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
                        <hr className="lineBetweenOrder" color="#00ff00" />
        
                        <div className="cTotalCostOrderList">
                          <div className="cOrderListCost"> Bakery Name :</div>
                          <div className="cOrderListCostDetail">totalprice</div>
                        </div>
                        <hr className="lineBetweenOrder" color="#00ff00" />
        
                        <div className="cOrderListLastRow">
                          <div className="cOrderStatus">
                            Status :<span className="cOrderStatusDetail">{item.ostatus}</span>
                          </div>
                        </div>
        
                        <div className="cOrderListLastRow">
                          <div className="cOrderDateDetail">
                            Date :<span className="cOrderStatusDetail">{item.oDate}</span>
                          </div>
                        </div>
                      </div>
                    );
            }
            
          })}
        </div>
      </div>
    </>
  );
}

export default Cordhistory;
