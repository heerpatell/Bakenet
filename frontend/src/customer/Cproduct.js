import React, { useState, useEffect } from "react";
import SidebarCustomer from "../components/SidebarCustomer";
import "./cproduct.css";
import { useNavigate } from 'react-router-dom'
import axios from "axios";

function Cproduct() {
  let navigate = useNavigate();
  const [showNav, setShowNav] = useState(true);

  const [allBakers, setAllBakers] = useState([]);
  const [city, setCity] = useState("");

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
  const fetchBakers = async () => {
    await axios
      .get("http://localhost:5000/cart/fetchbakers", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.msg == "success") {
          console.log(res.data.listOfBakers);
          setCity(res.data.user_city);
          setAllBakers(res.data.listOfBakers);
        }
      });
  };

  useEffect(() => {
    verifyUser();
    fetchBakers();
  }, []);

  const clicked = async (bakerId, bakeryName, whatdousell) => {
    window.location.href = `/cusotmer/product/${bakeryName}/${whatdousell}`;
  };

  return (
    <>
      <div>
        <SidebarCustomer show={showNav} />
        <div className="cProductMain">
          <div style={{ padding: "1.5rem 0", fontSize: "1.2rem" }}>
            Now showing available all bakery's present in your city {city}
          </div>
          <div>
            {allBakers.length < 1 ? (
              <div>No Bakers serve in your city at present!</div>
            ) : (
              allBakers.map((item) => {
                return (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      margin:'1rem 0',
                      background: "#B61919",
                      width: "10rem",
                      height: "10rem",
                      borderRadius: "1rem",
                      color: "#FDD2BF",
                      textAlign: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontSize: "1.2rem",

                    }}
                    onClick={() =>
                      clicked(item._id, item.bname, item.whatdousell)
                    }
                  >
                    {item.bname}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Cproduct;
