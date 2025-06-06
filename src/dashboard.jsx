import { FaBars, FaTimes, FaSearch} from "react-icons/fa"
import { getData } from "country-list"
import { useState, useEffect } from "react";
import {SearchInput} from "./search"
import { useContext } from "react";
import { SearchContext } from "./searchContext";
import { Footer } from "./footer";

const countries = getData().map((country)=>({
    label: country.name,
    value: country.code.toLowerCase(),
}))

  const lists = ['News','Sport','Entertainment','Music','Lifestyle','Politics','Education','Health','Food','Tech','Finance','Religion'];

export const Dashboard = () => {
    const [context, setContext] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(localStorage.getItem('selectedCountry') || 'us');
    const [newsList, setNewsList] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("news"); 
    const { inputValue, setInputValue } = useContext(SearchContext);
    const [isLoading, setIsLoading] = useState(true); 


    const handleSearchClick = () => {
        if (inputValue.trim() !== "") {
          setSelectedCategory(inputValue.toLowerCase()); 
          setInputValue('')
        }
      };

    const url = `https://newsdata.io/api/1/latest?apikey=pub_8471398a18d77380aac2ccf2abf1292a1b65e&q=${selectedCategory}&country=${selectedCountry}`;
    
      useEffect(()=>{
        console.log("Selected Country:", selectedCountry);
       

        //function to get the news
        const request = async () => {
            console.log("Fetching from:", url);
          
            if (navigator.onLine) {
              try {
                setIsLoading(true); // start loading
                const response = await fetch(url);
                if (!response.ok) {
                  throw new Error(`API returned status: ${response.status}`);
                }
                const data = await response.json();
                console.log("Fetched Data:", data);
                setContext(data.results);
              } catch (error) {
                console.log("Error fetching or translating data:", error);
              } finally {
                setIsLoading(false); // end loading
              }
            } else {
              alert("No internet connection");
            }
          };
          

        request();
      },[selectedCategory, selectedCountry]);


      useEffect(()=>{
        if(!localStorage.getItem('selectedCountry') && navigator.onLine){
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

      useEffect(() => {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en", 
              includedLanguages: "en,fr,de,es,ar,zh-CN,yr,ak,yo,ig,ha,af", 
              layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
            },
            "google_translate_element"
          );
        }
      }, []);
      
      
     

    return (
        <>
        <div className="topBar">
        <div className="nav">
            {newsList? 
            <div className="toolBar"  style={{ width: newsList ? "250px" : "0" }}>
                <FaTimes className="close" onClick={() => setNewsList(prevState => !prevState)} />
                    <p>Choose your area of interest...</p>
            <ul className="newsList">
            {lists.map((e, index)=>(
               <li 
               key={index} 
               onClick={() => {
                 setSelectedCategory(e.toLowerCase());
                 setNewsList(prevState => !prevState);
               }}
             >
               {e}
             </li>
             
            ))}
            </ul>
            </div> : null }

            <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap: 20}} id="topic">
            <FaBars onClick={() => setNewsList(prevState => !prevState)}/>
            <h1 className="header">Multilingua News Aggregator</h1>
            </div>
            

            {/*desktop selections */}
            <select className="selection" value={selectedCountry} onChange={(e)=> setSelectedCountry (e.target.value)}>
                {countries.map((country)=>(
                    <option key={country.value} value={country.value}>{country.label}</option>
                ))}
                </select>
                <div id="google_translate_element"></div>
                <SearchInput onSearch={handleSearchClick} />

                

        </div>
        </div>

        {/*mobile view*/}
        <h1 style={{fontSize:"1.6rem", margin:"20px 0"}} className="mHeader">Multilingua News Aggregator</h1> 
        <div style={{display:'flex', justifyContent:'space-between', gap:'5px'}}>
        <select className="mobile-selection" value={selectedCountry} onChange={(e)=> setSelectedCountry (e.target.value)}>
                {countries.map((country)=>(
                    <option key={country.value} value={country.value}>{country.label}</option>
                ))}
                </select>
        </div>


        <div id="content-container">
  
  {isLoading ? (
    [...Array(6)].map((_, index) => (
      <div key={index} className="skeleton-card"></div>
    ))
  ) : (
    context.map((results, index) => (
      <div key={index} className="contents">
        <img src={results.image_url} alt={results.title || "news image"} />
        <h3>{results.title}</h3>
        <h5>{results.description}</h5>
        <p>{results.content}</p>
        <h4>{results.creator}</h4>
        <a href={results.link} target="_self">read more</a>
      </div>
    ))
  )}
  
</div>
<Footer/>
        </>
    )
}