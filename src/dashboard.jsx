import { FaBars } from "react-icons/fa"
import { getNames } from "country-list"
import ISO6391 from 'iso-639-1';
import { useState, useEffect } from "react";

const countries = getNames().map((country)=>({
    label: country,
    value: country,
}))
const languages = ISO6391.getAllNames().map((name) => {
    const code = ISO6391.getCode(name);
    return {
      label: name,
      value: code,
    };
  });

  const url = 'https://newsapi.org/v2/everything?' +
          'q=Apple&' +
          'from=2025-04-21&' +
          'sortBy=popularity&' +
          'apiKey=7f73c51e349b4424ba9ee31f250f1eeb';




export const Dashboard = () => {
    const [context, setContext] = useState([])

    const request = async () => {
            if (navigator.onLine) {
                try {
                const response = await fetch(url);
                const data = await response.json();
                setContext(data.articles);
            }
            catch {
                console.log('Error fetching data');
            }
        } 

        
    };
      useEffect(()=>{
        request()
      },[])
    return (
        <>
        <div className="nav">
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', gap:30}}>
            <FaBars />
            <h1>Multilingua News Aggregator</h1>
            </div>
            <select className="selection">
                {countries.map((country)=>(
                    <option key={country.value} value={country.value}>{country.label}</option>
                ))}
                </select>
                <select className="selection">
                    {languages.map((lang)=>(
                        <option key={lang.value} value={lang.value}>{lang.label}</option>
                    ))}
                </select>
        </div>
        <div id="content-container">
            {context.map((results, index)=>(
                <div key={index} className="contents">
                    <img src={results.urlToImage} alt={results.title || "news image"} />
                    <h3>{results.title}</h3>
                    <h5>{results.description}</h5>
                    <p>{results.content}</p>
                    <h4>{results.author}</h4>
                    </div>
            ))}
            </div>
        </>
    )
}