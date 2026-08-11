import React from 'react'
import { FaPhone,FaWallet,FaFile,FaMobile,FaMailBulk,FaFutbol} from 'react-icons/fa'
import './Footer.css'
const Footer = () => {
  return (
    <footer className='footer'>
        
        <div className='footer-terms'>
            <h4> <FaFile/> Terms and Conditions</h4>
            <p>Must be 25 years of age and above</p>
            <p>Betting can be addictive and psychologically harmful</p>
            <p>Bet responsibly</p>
        </div>
        <div className='footer-sports'>
            <h4> <FaFutbol/> Sports</h4>
            <p>Football</p>
            <p>Basketball</p>
            <p>eFootball</p>
            <p>Tennis</p>
        </div>
        <div  className='footer-deposit'>

            <h4> <FaWallet/>Depositing & Withdrawing</h4>
            <div className='img'>
            <img src="mtn.png" alt="" />
            <img src="airtel.png" alt="" />
            </div>
            <p>Ababet is licenced and regulated by <p/>
            <p></p>Uganda National Gamming Board</p>
        </div>
        
        <div className='footer-contact'>      
            <h4> <FaPhone/>Contact us</h4>
            <p> <FaMobile/>  Airtel: 0200307200, MTN: 0323002470</p>
            <p>  <FaMailBulk/> support@ababet.com</p>
        </div>
        
    </footer>
  )
}

export default Footer