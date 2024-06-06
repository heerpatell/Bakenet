import React, { useState, useEffect } from "react";
import "./bprofile.css";
import Sidebar from "../components/Sidebar";
import "./bprofile.css";
import { useNavigate } from 'react-router-dom'
import axios from "axios";

function Bprofile() {
  let navigate = useNavigate()
  const [inp, setInp] = useState({
    uid: "",
    bname: "",
    uname: "",
    whatdousell: "",
    availTime: "",
    email: "",
    role: "",
    city: "",
    area: "",
    cont: "",
    socialmedia: ""
  });

  // const [user, setUser] = useState({})
  const handleInp = (e) => {
    const { name, value } = e.target;
    setInp({ ...inp, [name]: value });
  };

  const verifyUser = async () => {
    await axios.get('http://localhost:5000/auth/verify', {
      withCredentials: true
    })
      .then((res) => {
        if(res.data.msg == 'access denied'){
          navigate('/signin');
       }
        console.log(res.data);
        if (res.data.userObj.stoken != 'baker') {
          navigate('*')
            // alert('Invalid Acess. Create Error Page');
        }
        if (res.data.userObj.stoken == 'baker') {
          
          if (res.data.msg == 'access granted') {
            //setUser(res.data.userObj)
            //console.log('u ',user)

            setInp({
              uid: res.data.userObj._id,
              bname: res.data.userObj.bname,
              uname: res.data.userObj.uname,
              whatdousell: res.data.userObj.whatdousell,
              availTime: res.data.userObj.availtiming,
              email: res.data.userObj.email,
              role: res.data.userObj.stoken,
              city: res.data.userObj.city,
              area: res.data.userObj.area,
              cont: res.data.userObj.contact,
              socialmedia: res.data.userObj.socialmedia,
            })
          }
        }
        
      })
  }

  useEffect(() => {
    verifyUser();
  }, [])

  const restfield = {
    uid: inp.uid,
    bname: inp.bname,
    uname: inp.uname,
    whatdousell: inp.whatdousell,
    availTime: inp.availTime,
    email: inp.email,
    role: inp.stoken,
    city: inp.city,
    area: inp.area,
    cont: inp.cont,
    socialmedia: inp.socialmedia
  }

  const submitClicked = async (e) => {
    e.preventDefault()
    await axios.post('http://localhost:5000/prof/bakersubmit', restfield, {
      withCredentials: true
    })
      .then((res) => {
        console.log(93, res.data)
        if(res.data.error){
          alert(res.data.error)
        }
        if (res.data.msg == 'updated successfully') {
          alert('updated successfully')
        }
      })
  }

  const [showNav, setShowNav] = useState(true);
  return (
    <>
      <Sidebar show={showNav} />
      <div className="bprofile">
        <div className="logOutRow">
          <button className="logOutBtn" onClick={console.log("logout clicked")}>
            Log out
          </button>
        </div>
        <h3 className="proDet">Profile Details</h3>

        <form method="post" action="/baker/profile">
          <div className="proRow">
            <div className="proCol">
              <label className="proLab">Bakery Name*</label>
              <br />
              <input
                type="text"
                className="proIn"
                name="bname"
                value={inp.bname}
                onChange={handleInp}
              />
            </div>
            <div className="proCol">
              <label className="proLab">User Name*</label>
              <br />
              <input
                type="text"
                className="proIn"
                name="uname"
                value={inp.uname}
                onChange={handleInp}
                readOnly={true}
              />
            </div>
          </div>

          <div className="proRow">
            <div className="proCol">
              <label className="proLab">What do you Sell?*</label>
              <br />
              <textarea
                type="text"
                className="proIn"
                name="whatdousell"
                value={inp.whatdousell}
                onChange={handleInp}
              />
            </div>
            <div className="proCol">
              <label className="proLab">Available Timing*</label>
              <br />
              <input
                type="text"
                className="proIn"
                name="availTime"
                value={inp.availTime}
                onChange={handleInp}
              />
            </div>
          </div>

          <div className="proRow">
            <div className="proCol">
              <label className="proLab">Email*</label>
              <br />
              <input
                type="email"
                className="proIn"
                name="email"
                value={inp.email}
                onChange={handleInp}
                readOnly={true}
              />
            </div>
            <div className="proCol">
              <label className="proLab">Role*</label>
              <br />
              <input
                type="text"
                className="proIn"
                name="role"
                value={inp.role}
                onChange={handleInp}
                readOnly={true}
              />
            </div>
          </div>

          <div className="proRow">
            <div className="proCol">
              <label className="proLab">City*</label>
              <br />
              <input
                type="text"
                className="proIn"
                name="city"
                value={inp.city}
                onChange={handleInp}
              />
            </div>
            <div className="proCol">
              <label className="proLab">Area*</label>
              <br />
              <input
                type="text"
                className="proIn"
                name="area"
                value={inp.area}
                onChange={handleInp}
              />
            </div>
          </div>

          <div className="proRow">
            <div className="proCol">
              <label className="proLab">Contact*</label>
              <br />
              <input
                type="text"
                className="proIn"
                name="cont"
                value={inp.cont}
                onChange={handleInp}
              />
            </div>
            <div className="proCol">
              <label className="proLab">Social Media </label>
              <br />
              <input
                type="text"
                className="proIn"
                name="socialmedia"
                value={inp.socialmedia}
                onChange={handleInp}
              />
            </div>
          </div>

          <div className="proBtnRow">
            <button className="catSaveBtn" onClick={submitClicked}>
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Bprofile;
