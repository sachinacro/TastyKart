import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    <img src={assets.logo3} alt="" className="logo" />
                    <p>This platform is not just a food delivery system but a complete solution for small food businesses, helping them grow and succeed without high commissions.</p>
                    <div className="footer-social-icons">
                        <img src={assets.facebook_icon} alt="" />
                        <img src={assets.twitter_icon} alt="" />
                        <img src={assets.linkedin_icon} alt="" />
                    </div>
                </div>
                <div className="footer-content-center">
                    <h2>COMPANY</h2>
                    <ul>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Delivery</li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>
                <div className="footer-content-right">
                    <h2>GET IN TOUCH</h2>
                    <ul>
                        <li>+91 968-593-0542</li>
                        <li>+91 917-497-5840</li>
                        <li>+91 706-739-0032</li>
                        <li>+91 748-987-0268</li>
                        <li>contect@tastykart.com</li>
                    </ul>
                </div>
            </div>
            <hr />
            <p className="footer-copyright">Copyright 2025 © TastyKart.com - All Right Reserved</p>
        </div>
    )
}

export default Footer
