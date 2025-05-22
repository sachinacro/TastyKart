import React, { useContext, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom'; // Use NavLink for automatic active class
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ setShowLogin }) => {
  const [menu,setMenu]=useState("home");
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);

const navigate = useNavigate();


  // Logout handler
  const handleLogout = () => {
    
    localStorage.removeItem("token"); // Optionally clear token from localStorage
    setToken("");
    navigate("/");
  };

  return (
    <div className="navbar">
      <NavLink to="/">
        <img src={assets.logo3} alt="Logo" className="logo" />
      </NavLink>
      <ul className="navbar-menu">
        <NavLink to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</NavLink>
        <a href="#explore-menu">Menu</a>
        <a href="#footer">Contact us</a>
      </ul>

      <div className="navbar-right">
        <img src={assets.search_icon} alt="Search Icon" />
        <div className="navbar-search-icon">
          <NavLink to="/cart">
            <img src={assets.basket_icon} alt="Cart Icon" />
          </NavLink>
          <div className={getTotalCartAmount() > 0 ? "dot" : ""}></div>
        </div>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="Profile Icon" />
            <ul className="nav-profile-dropdown">
              <li onClick={()=>navigate('/myorders')}>
                <img src={assets.bag_icon} alt="Orders Icon" />
                <p>Orders</p>
              </li>
              <hr />
              <li onClick={handleLogout}>
                <img src={assets.logout_icon} alt="Logout Icon" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
