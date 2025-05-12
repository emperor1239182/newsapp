import { FaBars, FaTimes} from "react-icons/fa"
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

  
  const lists = ['News','Sport','Entertainment','Music','Lifestyle','Politics','Education','Health','Food','Tech','Finance','Religion'];

  

export const Dashboard = () => {
    const [context, setContext] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(localStorage.getItem('selectedCountry') || 'us');
    const [selectedLang, setSelectedLang] = useState('en');
    const [newsList, setNewsList] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("news"); // Default to "news"


    const url = `https://newsdata.io/api/1/latest?apikey=pub_8471398a18d77380aac2ccf2abf1292a1b65e&q=${selectedCategory}&country=${selectedCountry}&language=${selectedLang}`;
    
      useEffect(()=>{
        console.log("Selected Country:", selectedCountry);
        console.log("selected Lang:", selectedLang);

        //function to get the news
       const request = async () => {
    console.log("Fetching from:", url);

    if (navigator.onLine) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`API returned status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Fetched Data:", data);
            setContext(data.results);

            // Translate content
            const translatedResults = await Promise.all(
                data.results.map(async (article) => {
                    const res = await fetch("https://libretranslate.de/translate", {
                        method: "POST",
                        body: JSON.stringify({
                            q: article.content, // Translate actual content
                            source: "auto",
                            target: selectedLang,
                            format: "text"
                        }),
                        headers: { "Content-Type": "application/json" }
                    });
                    const translated = await res.json();
                    console.log('translating', translated);
                    return { ...article, content: translated.translatedText };
                })
            );

            setContext(translatedResults);
        } catch (error) {
            console.log("Error fetching or translating data:", error);
        }
    } else {
        alert("No internet connection");
    }
};

        request();
      },[selectedCategory, selectedCountry, selectedLang]);


      useEffect(()=>{
        if(!localStorage.getItem('selectedCountry') & navigator.onLine){
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
            {newsList? 
            <div className="toolBar"  style={{ width: newsList ? "250px" : "0" }}>
                <FaTimes className="close" onClick={() => setNewsList(prevState => !prevState)} />
                    <p>Choose your area of interest...</p>
            <ul className="newsList">
            {lists.map((e, index)=>(
                <li key={index} onClick={() => setSelectedCategory(e.toLowerCase())}>{e}</li>
            ))}
            </ul>
            </div> : null }
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', gap:30}}>
            <FaBars onClick={() => setNewsList(prevState => !prevState)}/>
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