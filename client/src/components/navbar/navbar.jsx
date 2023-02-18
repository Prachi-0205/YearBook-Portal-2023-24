import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useRouteLoaderData } from "react-router-dom";
import './Navbar.scss';
import { LoginContext } from '../../helpers/Context';
import { useContext } from 'react';
import axios from 'axios';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  Button,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';


const Navbar = () => {

  const { loggedin, setLoggedin, user, setUser, authData, setAuthData } = useContext(LoginContext);

  const navigate = useNavigate();

  const [searchword, setSearchword] = useState("");
  const [wordentered, setWordentered] = useState("");
  const [wordEnteredList, setWordEnteredList] = useState([]);
  const { result, setResult } = useContext(LoginContext);
  // const [isActive, setIsActive] = useState(false);
  const [inputValue, setInputValue]= useState();
  const [display, setDisplay] = useState(false);

  //After refreshing the page user is still signed in 
  useEffect(() => {
    if (window.localStorage.getItem('user') !== null) {
      const userLoggedIn = window.localStorage.getItem('user');
      if (userLoggedIn != null) {
        setUser(JSON.parse(userLoggedIn));
      }
    }
    const logged = (window.localStorage.getItem('loggedin'));
    if (logged === "true") {
      setLoggedin(true);
    }
    else {
      setLoggedin(false);
    }
  }, [])

  //Logout Function
  const handleLogout = () =>{
      setUser({});
      window.localStorage.removeItem('user');
      setLoggedin(false);
      window.localStorage.setItem('loggedin', false)
      document.getElementById("google-login").hidden = false;
      navigate('/');
    }
  

  

  if (loggedin === true) {
    document.getElementById("google-login").hidden = true;
  }

  //Search Engine Functions
  useEffect(() => {
    axios.post('http://localhost:5000/searchword', {
      searchword: searchword
    }).then((res) => {
      setResult(res.data);
    }).catch((err) => {
      console.log(err)
    })
  })

  const searchAWord = (event) => {
    setWordentered(event.target.value);
  }

  useEffect(() => {
    axios.post('http://localhost:5000/wordEntered', {
      wordentered: wordentered
    }).then((res) => {
      console.log(res.data);
      setWordEnteredList(res.data);
    }).catch((err) => {
      console.log(err);
    })
  }
  )

  return (
    <div className="overflow-x-hidden" id='abd'>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Quantico&display=swap');
      </style>
      <div className='header22'>
        <img src='/images/1.png' />
        <div className='navbar'>
          <ul>
            <Link to="/">HOME</Link>
            <Link to="/about">ABOUT</Link>
            <Link to="/team">DEVELOPERS</Link>


            <div id='google-login'>
            </div>


            {loggedin &&
              <>
                <li style={{ display: 'flex' }}>
                  <div className="searchr" style={{ width: '190%' }}>
                    <input type="text" placeholder="Search..." class="search" onChange={(e) => {
                      searchAWord(e);
                      (e.target.value === "") ? setDisplay(false) : setDisplay(true);
                      // onEnter();
                    }} value= {inputValue}/>
                    {wordEnteredList.map((val, index) =>
                    (<li><button className={`btnsearch2 ${(display) ? "" : "display-none"}`} key={index} onClick={(e) => {
                      e.preventDefault();
                      setSearchword(val.email);
                      setInputValue("");
                      setDisplay(false);
                      e.target.value="";
                      navigate('/comment')
                    }}>{val.name}</button></li>)
                    )}
                  </div>


                  {/* <div className="dropdown" style={{ alignItems: 'center', display: 'block' }}>
                    <div className="dropdown-btn" style={{ display: 'flex' }} onClick={e => setIsActive(!isActive)}>
                      <img src="../../../images/profile.jpg" alt="" />
                      <i className="fa fa-caret-down" style={{ padding: '0px', textAlign: 'left', verticalAlign: 'center' }}></i>
                    </div>

                    {isActive && (
                      <div className="dropdown-content">
                        <div className="dropdown-item"><a style={{ padding: '1%', margin: '2%' }}>My Profile</a></div>
                        <div className="dropdown-item"><a style={{ padding: '1%', margin: '2%' }} onClick={handleLogout}>Logout</a></div>
                      </div>
                    )}
                  </div> */}

                  <Menu>
                    <MenuButton as={Button} w='29%' ml = {2}  rightIcon={<ChevronDownIcon /> }>
                    <img src="../../../images/profile.jpg" alt="" id='profilepic' />
                    </MenuButton>
                    <MenuList>
                      <MenuItem bgColor={'#4d1a6c'}>My Profile</MenuItem>
                      <MenuItem bgColor={'#4d1a6c'} onClick={handleLogout}>Logout</MenuItem>
                    </MenuList>
                  </Menu>
                </li>
              </>
            }

          </ul>
        </div>
      </div>
    </div>
  )
}


export default Navbar;