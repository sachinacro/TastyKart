import React from 'react'
import './Navbar.css'
import {assets} from '../../assets/assets'

const Navbar = () => {
  return (
    <div className='navbar'>
        <img className='logo' src={assets.logo3} alt="" />
        <p className="admin-text">Admin Panel</p>
        <img className='profile' src={assets.logo2} alt="" />
      
    </div>
  )
}

export default Navbar
