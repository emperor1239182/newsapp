import { FaBars } from "react-icons/fa"
import { getData } from "country-list"
import ISO6391 from 'iso-639-1';
import { useState, useEffect } from "react";

const countries = getData().map((country)=>({
    label: country.name,
    value: country.code.toLowerCase(),
}))
const languages = ISO6391.getAllNames().map((name) => {
    const code = ISO6391.getCode(name);
    return {
      label: name,
      value: code,
    };
  });


  

export const Dashboard = () => {
    const [context, setContext] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(localStorage.getItem('selectedCountry') || 'us');
    const [selectedLang, setSelectedLang] = useState('en');

    const url = `https://newsdata.io/api/1/latest?apikey=pub_8471398a18d77380aac2ccf2abf1292a1b65e&q=news&country=${selectedCountry}&language=${selectedLang}`;
    


      useEffect(()=>{
        console.log("Selected Country:", selectedCountry);
        console.log("selected Lang:", selectedLang);

        //function to get the news
        const request = async () => {
            console.log("Fetching from:", url);
;
                if (navigator.onLine) {
                    try {
                    const response = await fetch(url);
                    if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
    }
                    const data = await response.json();
                    console.log("Fetched Data:", data);
                    setContext(data.results);
                }
                catch {
                    console.log('Error fetching data');
                }
            } else{
                alert('no internent connection');
            }
        };
        request();
      },[selectedCountry, selectedLang]);


      useEffect(()=>{
        if(!localStorage.getItem('selectedCountry')){
             //get users current country location to fecth news from there
            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition((position)=>{
                    const {latitude, longitude} = position.coords;
                    console.log(latitude, longitude);
                    const locationUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
                    fetch(locationUrl)
                    .then(res => res.json())
                    .then(data =>{
                        const { address } = data;
                        setSelectedCountry(address.country_code || address.country);
                        console.log(selectedCountry);
                    })            
                })
            }
    
        }
      }, [])

    return (
        <>
        <div className="nav">
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', gap:30}}>
            <FaBars />
            <h1>Multilingua News Aggregator</h1>
            </div>
            <select className="selection" value={selectedCountry} onChange={(e)=> setSelectedCountry (e.target.value)}>
                {countries.map((country)=>(
                    <option key={country.value} value={country.value}>{country.label}</option>
                ))}
                </select>
                <select className="selection" value={selectedLang} onChange={(e)=> setSelectedLang(e.target.value)}>
                    {languages.map((lang)=>(
                        <option key={lang.value} value={lang.value}>{lang.label}</option>
                    ))}
                </select>
        </div>
        <div id="content-container">
            {context.map((results, index)=>(
                <div key={index} className="contents">
                    <img src={results.image_url} alt={results.title || "news image"} />
                    <h3>{results.title}</h3>
                    <h5>{results.description}</h5>
                    <p>{results.content}</p>
                    <h4>{results.creator}</h4>
                    <a href={results.link} target="_self">read more</a>
                    </div>
            ))}
            </div>
        </>
    )
}