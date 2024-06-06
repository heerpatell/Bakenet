import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "./productItem.css";
import { AiOutlineDelete } from "react-icons/ai";
import { VscEdit } from "react-icons/vsc";
import {MdDelete} from 'react-icons/md'
import { useNavigate } from "react-router-dom";

function ProductItem() {
  let navigate = useNavigate();

  const { catname } = useParams();

  const [showAddOption, setShowAddOption] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [inp, setInp] = useState({
    cname: catname,
    iname: "",
    iphoto: "",
    description: "",
    price: "",
  });
  const [fetchData, setFetchData] = useState([]);
  const [disableInp, setDisableInp] = useState(true);
  const [edit, setEdit] = useState(false);

  const getProductDetails = async () => {
    await axios
      .get(`http://localhost:5000/item/getitemsforbaker/${catname}`, {
        withCredentials: true,
      })
      .then(async (res) => {
        if (res.data.msg === "success") setFetchData(await res.data.userObj);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const verifyUser = async () => {
    await axios
      .get("http://localhost:5000/auth/verify", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.msg == "access denied") navigate("/signin");
      })
      .catch((e) => {
        navigate("/signin");
      });
  };

  const getCategories = async()=>{
    await axios.get('http://localhost:5000/cat/getcat',{
        withCredentials:true
      })
      .then(async(res)=>{
        // console.log('1 ', res.data)
        // console.log('2 ', catname)
        
        let exist = res.data.indexOf(catname)
        // console.log('Acheck'+exist)
        if(exist < 0){
          navigate('/signin');
        }
        
      })
  }

  useEffect(() => {
    verifyUser();
    getCategories();
    getProductDetails();
  }, [fetchData]);

  const handleInp = (e) => {
    const { name, value } = e.target;
    setInp({ ...inp, [name]: value });
  };

  const handleSub = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("cname", inp.cname);
    formData.append("iname", inp.iname);
    formData.append("iphoto", inp.iphoto);
    formData.append("description", inp.description);
    formData.append("price", inp.price);

    await axios
      .post("http://localhost:5000/item/additem", formData, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.msg == "success") alert(`${inp.iname} added successfully`);
        setInp({
          iname: "",
          iphoto: "",
          description: "",
          price: "",
          iphoto: "",
        });
      })
      .catch((e) => {
        console.log("error ", e);
      });
  };

  const handlePhoto = (e) => {
    // console.log(e.target.files[0])
    setInp({ ...inp, iphoto: e.target.files[0] });
  };

  const addItemClicked = () => {
    setShowAddOption(!showAddOption);
  };

  const deleteItem =async (iname) => {
  await axios.post(`http://localhost:5000/item/delitem/${iname}`,{
    withCredentials:true
  })
  .then((res)=>{
    if(res.data.msg === "deleted"){
      alert(`${iname} is deleted`)
    }
  })

  }

  return (
    <>
      <Sidebar show={showNav} />
      <div className="bakeritemmain">
        <h4 className="catheading">
          Your Category : <span className="spnBakerProList"> {catname} </span>
        </h4>
        <button className="addItemBtn" onClick={addItemClicked}>
          Add items
        </button>
        {showAddOption ? (
          <div className="bakeItemBox">
            <form
              onSubmit={handleSub}
              encType="multipart/form-data"
              method="post"
            >
              <div className="bakerItemRow">
                <div className="bakerItemCol">
                  <label className="bakerItemLab">Category name</label>
                  <br />
                  <input
                    type="cname"
                    className="bakerItemIn"
                    name="email"
                    value={catname}
                    onChange={handleInp}
                  />
                </div>
                <div className="bakerItemCol">
                  <label className="bakerItemLab">Item name*</label>
                  <br />
                  <input
                    type="text"
                    className="bakerItemIn"
                    name="iname"
                    value={inp.iname}
                    onChange={handleInp}
                  />
                </div>
              </div>

              <div className="bakerItemRow">
                <div className="bakerItemCol">
                  <label className="bakerItemLab">Price*</label>
                  <br />
                  <input
                    type="number"
                    className="bakerItemIn"
                    name="price"
                    value={inp.price}
                    onChange={handleInp}
                  />
                </div>

                <div className="bakerItemCol">
                  <label className="bakerItemLab">description*</label>
                  <br />
                  <input
                    type="text"
                    className="bakerItemIn"
                    name="description"
                    value={inp.description}
                    onChange={handleInp}
                  />
                </div>
              </div>

              <div
                className="bakerItemCol"
                style={{ marginLeft: "1rem", marginTop: "1rem" }}
              >
                <label className="bakerItemLab">Upload Item photo*</label>
                <br />
                <input
                  type="file"
                  name="iphoto"
                  accept=".png, .jpg, .jpeg"
                  onChange={handlePhoto}
                />
              </div>

              <div className="bakerItemRow">
                <div className="productSaveBtn" onClick={handleSub}>
                  Add Product
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div />
        )}

        <div className="catheading">Your Product List </div>

        {fetchData.length == 0 ? (
          <div style={{ marginBottom: "2rem" }}>No items </div>
        ) : (
          <div style={{display:'flex', flexWrap:'wrap', rowGap: '20px',columnGap: '20px'}}>
            {
              fetchData.map((item,index) => {
                return(
                <div className="allItemsCol">
                  <div className="productListBox">
                  <div className="bakerProductImg">
                    <img
                      src={require(`../uploads/${item.iphoto}`)}
                      className="itemPhotoBaker"
                      alt={item.iname}
                    />
                  </div>
                  <div className="bakerProductItem">
                    <div className="bItemRow">
                      <div>
                        Item Name
                        <input
                          type="text"
                          value={item.iname}
                          disabled={disableInp}
                          name="iname"
                          // onChange={handlEdit}
                          className="bakerListInput"
                        />
                      </div>
                      <hr />
                      <div>
                      Description &nbsp; &nbsp;
                        <input
                          type="text"
                          name="description"
                          value={item.description}
                          disabled={disableInp}
                          onChange={handleInp}
                          className="bakerListInput"
                        />
                      </div>
                      <hr />
                      <div>
                        Price &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                        <input
                          type="number"
                          name="price"
                          value={item.price}
                          onChange={handleInp}
                          disabled={disableInp}
                          className="bakerListInput"
                        />
                        <hr />
                      </div>
                      <div>
                      <MdDelete color='#FDD2BF' size={30} className="catDelIcon" onClick = { () => deleteItem(item.iname)} style={{cursor:'pointer'}}></MdDelete> 
                      </div>
                    </div>
                    <br />

                    {edit ? (
                      <div className="bItemRowEdit">
                        <div
                          className="productEditBtn"
                          // onClick={() => editClicked(item._id)}
                        >
                          Edit{" "}
                        </div>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
                </div> 
                )
              })
            }  
          </div>
        )}
      </div>
    </>
  );
}

export default ProductItem;
