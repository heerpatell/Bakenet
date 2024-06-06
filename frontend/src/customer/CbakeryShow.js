import React, { useState, useEffect } from "react";
import SidebarCustomer from "../components/SidebarCustomer";
import axios from "axios";
import { useNavigate } from 'react-router-dom'
import { FaCartPlus } from "react-icons/fa";
import { RiShoppingCart2Line } from "react-icons/ri";
import { FiPhoneCall } from "react-icons/fi";
import im1 from "../img/signIn_Up/leftSign.jpg";
import { Hidden } from "@material-ui/core";
import { useParams } from "react-router";

function CbakeryShow() {
  let navigate = useNavigate();
  const { bakeryname, whatdousell } = useParams();
  const [showNav, setShowNav] = useState(true);

  const [allItems, setAllItems] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [count, setCount] = useState(0);

  const fetchData = async () => {

    await axios
      .post(
        "http://localhost:5000/item/getitemsforcustomer",
        { bakeryname },
        {
          withCredentials: true,
        }
      )
      .then(async (res) => {
        if (res.data.msg == "all items received") {
          console.log(31, res.data.itemDetails);
          await setAllItems(res.data.itemDetails);
        }
      });
  };
  const getCount = () => {
    axios
      .get("http://localhost:5000/cart/getcartcount", {
        withCredentials: true,
      })
      .then(async (res) => {
        if(res.data.msg == 'success' && res.data.itemList == undefined){
            setCount(0)
          }else if(res.data.msg == 'success'){
            console.log(45, res.data.itemList)
            // await setItemList([res.data.itemList].map(item=>[item]));
            setItemList(res.data.itemList)
            await setCount(res.data.count);  
          }

      });
  };

  const addCart = (id) => {
    console.log(id);
    axios
      .post("http://localhost:5000/cart/additem", {id, quantity:0,bakeryname}, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.msg === "success") {
          alert("Added to cart successfully");
        }
      });
    setCount(count + 1);
  };

  const verifyUser = async() => {
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

  useEffect(() => {
    verifyUser();
    fetchData();
    getCount();
  }, []);

  return (
    <>
      <div>
        <SidebarCustomer show={showNav} />
        <div className="cProductMain">
          <div className="CustProductHeading">
            <div className="bakerProListTitle">
              Product List for Bakery : {bakeryname}
            </div>
            <div className="bakerProductCart">
              <RiShoppingCart2Line size={27} color={"#012443"} />
              <span className="CustAddItem">{count}</span>
            </div>
          </div>
          <hr />
          <div style={{ padding: "1rem 0" }}>
            <h3>What do {bakeryname} sell: </h3>
            {whatdousell}
          </div>
          <hr />
          <div className="cProRow">
            {allItems.map((item, ind) => {
              let hasRenderedIcon = false;
              return (
                <div className="cProductBox">
                  <div className="cItemContent">
                    <div>
                      <img className="cItemImage" alt="img" src={item.iphoto} />
                    </div>


                    {itemList.map((i) => {
                      console.log(128, i)
                      console.log(129, i._id, item._id)
                      if (i._id == item._id) {
                        hasRenderedIcon = true;
                        console.log(131,i.quantity)
                        if(i.quantity < 1){
                          {console.log("<1")}
                          return(
                            <div className="cAddToCart">
                          <FaCartPlus
                            size={23}
                            color="#FDD2BF"
                            onClick={() => addCart(item._id)}
                          />
                        </div>
                          )
                        }else{
                          {console.log("else")}
                          return(
                            <div className="cAddToCart">
                          <FaCartPlus
                            size={23}
                            color="#FDD2BF"
                            onClick={() => addCart(item._id)}
                            style={{ pointerEvents: "none", opacity: 0.5 }}
                          />
                        </div>
                          )
                        }
                      }
                      return null;
                    })}

                
                    {!hasRenderedIcon && (
                      <div className="cAddToCart">
                        <FaCartPlus
                          size={23}
                          color="#FDD2BF"
                          onClick={() => addCart(item._id)}
                        />
                      </div>
                    )}

                    <div className="cItemDetails">
                      Category Name :{" "}
                      <span className="cItemSpan">{item.cname}</span>
                    </div>
                    <div className="cItemDetails">
                      Item Name :{" "}
                      <span className="cItemSpan">{item.iname}</span>
                    </div>

                    <div className="cItemDetails">
                      Description :{" "}
                      <span className="cItemSpan">{item.description}</span>
                    </div>
                    <div className="cItemLastDetails">
                      Price :{" "}
                      <span className="cItemSpanLast">{item.price}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default CbakeryShow;
