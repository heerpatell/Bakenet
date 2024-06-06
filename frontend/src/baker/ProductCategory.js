import React,{useState,useEffect} from 'react'
import Sidebar from '../components/Sidebar'
// import {GiHamburgerMenu} from 'react-icons/gi'
import {VscAdd} from 'react-icons/vsc'
import {AiOutlineClose} from 'react-icons/ai'
import './product.css'
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { Link } from "react-router-dom";
import axios from 'axios'
import {MdDelete} from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

const styles = (theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });
  
  const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <AiOutlineClose />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });
  
  const DialogContent = withStyles((theme) => ({
    root: {
      padding: theme.spacing(2),
    },
  }))(MuiDialogContent);
  
  const DialogActions = withStyles((theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(1),
    },
  }))(MuiDialogActions);

  function Product() {
      let navigate = useNavigate();

      const [userId, setUserId] = useState('')

      const verifyUser = async () => {
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
          setUserId(res.data.userObj._id)            
        })
        .catch((res)=>{
          console.log(res.msg)
          navigate('/signin')
        })
    }

    const [open, setOpen] = useState(false);
    const [showNav,setShowNav] = useState(true);
    const [input, setInput] = useState({
      name:'',
      color:'#B61919'
    })
    const [category,setCategory]=useState([])

    var catNum=1;

    const userIdObj = {
      userId 
    }
    const fetchCategories = async(req,res) => {
      await axios.get('http://localhost:5000/cat/getcat',{
        withCredentials:true
      })
      .then(async(res)=>{
        // console.log('re ', res.data)
        //categories to be shown in frontend
        setCategory(await res.data)
      })
      .catch((e)=>{
        console.log('error ',e)
      })    
    }

    useEffect(()=>{
      verifyUser()
      fetchCategories()
    },[category])
  
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
   
    const handleChange = (e) =>{
      const {name,value} = e.target;
      setInput({
        ...input,
        [name] : value
      })
    }

    const addClicked = async() => {
      const fields = {
        input:input.name,userId
      }
      console.log(fields)
      await axios.post('http://localhost:5000/cat/add',fields,{
        withCredentials:true
      })
      .then((res)=>{
        setInput({
          name:''
        })
          if(res.data.msg === "cat added") alert("category added successfully")
          setOpen(false)
      })
      .catch((e)=>{
        console.log("error ",e)
      })
    }

    const deleteCat = async (item) => {
      await axios.delete(`http://localhost:5000/cat/delete/${item}`,{
        withCredentials:true
      })
      .then((res)=>{
        if(res.data.msg = "deleted"){
          alert(`${item} is deleted successfuly`)
        }
      })
      .catch((e)=>{
        console.log(e)
      })
    }

    const handleClickonDiv=((item)=>{
 window.location.href = `/baker/category/${item}`

    })

    return (
    <>
    {/* <header className="bakerHeader">
        <GiHamburgerMenu size={30} onClick={displayNav}/>
    </header> */}
    <Sidebar  show={showNav} />
    <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
            Add Category
        </DialogTitle>
        
        <DialogContent dividers>
          <Typography gutterBottom>
            <label>Add Name </label>&nbsp;&nbsp;&nbsp;
            <input type="text"value={input.name} onChange={handleChange} name="name"/>
          </Typography>

        </DialogContent>
        
        <DialogActions>
          <Button onClick={addClicked} color="primary" type="submit">    
          {/* onClick={addCat,handleClose} */}
            Add
          </Button>
        </DialogActions>
      </Dialog>
      
      <div className="bakerProductList">
        
        <div className="categorymain">
          <div className="bakerAddProduct" style={{backgroundColor: "#B61919"}}  onClick={handleClickOpen}>
              <VscAdd size={50} style={{marginLeft:"4.5rem",marginTop:"4.5rem",color:"#FDD2BF"}}/>
          </div>  
          <div className="addCategory">
              <h4>Add category</h4>
          </div>  
        </div>
        
        {
          category.map((item,ind)=>{
            return(
              <div className='bakerProductList'>
                  <div className={catNum%4===0 ? 'bakerAddProduct' : 'bakerAddProductRest'}
                  // key={ind} 
                  style={{backgroundColor: "#B61919"}} >
                    <div><MdDelete color='#FDD2BF' size={30} className="catDelIcon" onClick = { () => deleteCat(item)} 
                    style={{marginLeft:'1rem', marginTop:'1rem',}}/></div>
                               
                      <div style={{textAlign:"center" , fontSize:'2rem' ,marginTop:'4rem', color:"#FDD2BF" }}
                      onClick={()=> handleClickonDiv(item)}>
                        
                          <h4 className="catName">{item}</h4>
                      </div>
                      <div className="disHandle">{catNum+=1}</div>
                  </div>
              </div>
            )
          })
        }   
 
      </div>

    </>
    )
}

export default Product
