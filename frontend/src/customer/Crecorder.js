import React, { useState, useEffect } from "react";
import SidebarCustomer from "../components/SidebarCustomer";
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import "./crecorder.css";
import { AiOutlineDelete, AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import im1 from "../img/signIn_Up/leftSign.jpg";

function Crecorder() {
  let navigate = useNavigate();
  const [showNav, setShowNav] = useState(true);
  let [fetchData, setFetchData] = useState([]);
  const [orderData, setOrderData] = useState([]);

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

  const fetchCartDetails = async () => {
    await axios
      .get("http://localhost:5000/cart/getitemsinrecentorder", {
        withCredentials: true,
      })
      .then(async (res) => {
        if (res.data.msg == "cart empty") {
          // console.log('fD ', fetchData.length)
          // console.log("here")
        }
        if (res.data.msg == "success") {
          console.log(28, res.data.existedUser);
          await setFetchData(res.data.existedUser);
        }
      });
  };

  const delItem = async (id, bname) => {
    axios
      .post(
        "http://localhost:5000/cart/deleteitemfromcart",
        { id, bname },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.msg == "success") {
          alert("Item successfully deleted");
        }
      });
  };

  const plusClicked = async (id, quant) => {
    await axios.post(
      "http://localhost:5000/cart/addquantity",
      { id, quant },
      {
        withCredentials: true,
      }
    );
  };

  const minusClicked = async (id, quant) => {
    await axios.post(
      "http://localhost:5000/cart/minusquantity",
      { id, quant },
      {
        withCredentials: true,
      }
    );
  };

  const fetchOrderDetails = async () => {
    await axios
      .get("http://localhost:5000/order/fetchorderes", {
        withCredentials: true,
      })
      .then(async (res) => {
        if (res.data.msg == "success") {
          console.log(78, res.data.userObj);
          await setOrderData(res.data.userObj);
        }
        if (res.data.msg == "no order exists") {
          console.log("here");
        }
        if (res.data.msg == "No orders") {
          console.log("here");
        }
      });
  };

  useEffect(() => {
    verifyUser();
    fetchCartDetails();
    fetchOrderDetails();
  }, []);

  console.log(98, fetchData.length);
  const placeOrder = async () => {
    await axios
      .post(
        "http://localhost:5000/order/placeorder",
        { fetchData },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.msg == "success") {
          alert("Order Placed Successfully");
        }
      });
  };

  let showFlag = 1;
  return (
    <>
      <div>
        <SidebarCustomer show={showNav} />
        <div className="custOrderMain">
          <div className="custHeadMain">Your Cart Items</div>
          {fetchData.length === 0 && (
            <div>Select something from product list !!</div>
          )}

          {fetchData.map((item, ind) => {
            console.log(137, ind, " +", item._id);
            return item.flag == "unordered" ? (
              <div className="recOrdBox">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "1rem",
                  }}
                >
                  <h3 style={{ color: "#FDD2BF" }}>Baker Name: {item.bname}</h3>
                  <AiOutlineDelete
                    color="#FDD2BF"
                    size={27}
                    style={{ cursor: "pointer" }}
                    onClick={() => delItem(item._id, item.bname)}
                  />
                </div>
                <hr className="lineBetweenOrder" color="#00ff00" />
                <div className="rowHeadingBaker">
                  <div style={{ color: "#FDD2BF" }}>Product Name</div>
                  <div style={{ color: "#FDD2BF" }}>Quantity</div>
                  <div style={{ color: "#FDD2BF" }}>Price</div>
                </div>
                <hr className="lineBetweenOrder" color="#00ff00" />
                <div>
                  {item.itemIds.map((i) => {
                    showFlag = 0;
                    return (
                      <div>
                        <div className="rowItemBaker">
                          <div>{i.iname}</div>
                          <div className="custCartAdd">
                            {i.quantity == 1 ? (
                              <div className="custCartOption">
                                <AiOutlineMinus
                                  style={{
                                    cursor: "not-allowed",
                                    opacity: 0.5,
                                  }}
                                />
                              </div>
                            ) : (
                              <div
                                className="custCartOption"
                                onClick={() => minusClicked(i._id, i.quantity)}
                              >
                                <AiOutlineMinus />
                              </div>
                            )}
                            <div className="custCartValue">{i.quantity}</div>
                            <div
                              className="custCartOption"
                              onClick={() => plusClicked(i._id, i.quantity)}
                            >
                              <AiOutlinePlus />
                            </div>
                          </div>
                          <div>{i.price}</div>
                        </div>
                        <hr className="lineBetweenOrder" color="#00ff00" />
                      </div>
                    );
                  })}
                </div>
                <div style={{ float: "right", paddingRight: "4rem" }}>
                  Total Price: {item.totalPrice}
                </div>
                <div style={{ marginBottom: "2rem" }}></div>
              </div>
            ) : (
              <div></div>
            );
          })}

          <div className="cPOrder">
            {fetchData.length === 0 && (
              <div>You can find products from product!!</div>
            )}
            {showFlag == 0 && (
              <div className="cPlaceOrder" onClick={placeOrder}>
                Place Order
              </div>
            )}
          </div>

          <div className="custHeadMain">Your order List</div>
          {orderData.length === 0 && (
            <div>You haven't made any purchase yet!!</div>
          )}

          {orderData.length != 0 && (
            <div className="orderListBox">
              <div className="cOrderListRowHeading">
                <div>Name</div>
                <div>Quantity</div>
                <div>Price</div>
              </div>
              <hr className="lineBetweenOrder" color="#00ff00" />
              {orderData.map((item, ind) => {
                return (
                  item.ostatus != "done" && (
                    <div>
                      {item.itemIds.map((i) => {
                        return (
                          <div className="cOrderListRow">
                            <div>{i.iname}</div>
                            <div>{i.quantity}</div>
                            <div>{i.price}</div>
                          </div>
                        );
                      })}

                      <hr className="lineBetweenOrder" color="#00ff00" />

                      <div
                        className="cTotalCostOrderList"
                        style={{ marginBottom: "rem" }}
                      >
                        <div className="cOrderListCost"> Order Status :</div>
                        <div className="cOrderListCostDetail">
                          {item.ostatus}
                        </div>
                      </div>

                      <div
                        className="cTotalCostOrderList"
                        style={{ marginBottom: "rem" }}
                      >
                        <div className="cOrderListCost"> Bakery name :</div>
                        <div className="cOrderListCostDetail">{item.bname}</div>
                      </div>
                      <hr className="lineBetweenOrder" color="#00ff00" />
                    </div>
                  )
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Crecorder;
