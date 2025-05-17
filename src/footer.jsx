import {FaFacebook, FaTwitter, FaInstagram, FaTrademark} from 'react-icons/fa'
import { useState, useEffect } from 'react';
export const Footer = () =>{
    const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [time]);

  const hour = time.getHours();
  const minute = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const name = hour < 12 ? 'AM' : 'PM';

    return(
        <>
        <section className="footerContainer">

        <div>
        <h1 style={{textAlign:'left'}}>Multilingua News Aggregator</h1>
        <span className='time' >{hour} : {minute} : {seconds} {name}</span>
        <span style={{display:'flex', justifyContent:'space-between', width:'100px', marginBottom:'10px'}}>
                    <FaFacebook size={15}  />
                     <FaTwitter size={15}/>
                     <FaInstagram size={15}/>
                     </span>  
                     </div>

            <footer className='footer'>
                  <div>
                     <p>Countries</p>
                     <p>Regions</p>
                     <p>Cities</p>
                     <p>Districts</p>
                     <p>Airpots</p>
                     <p>Hotels</p>
                     </div>
                     
                     <div style={{marginTop:'21px'}}>
                        <p>Apartments</p>
                        <p>Resorts</p>
                        <p>Villas</p>
                        <p>Hotels</p>
                        <p>Guest houses</p>
                     </div>
                     <div style={{marginTop:'28px'}}>
                        <p>Unique places</p>
                        <p>Reviews</p>
                        <p>Travel communities</p>
                        <p>Seasonal and holiday deals</p>
                     </div>
                     <div style={{marginTop:'28px'}}>
                        <p>Car render</p>
                        <p>Flight finder</p>
                        <p>Restaurant reservations</p>
                        <p>Travel agents</p>
                     </div>
                     </footer>
                     <p style={{marginTop:'50px', fontFamily:'fantasy', fontSize:'0.8rem'}}>Copyright <FaTrademark/> 2025 Emperor </p>
            </section>
            </>
    );
}
