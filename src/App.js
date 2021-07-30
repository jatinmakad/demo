import React, {useState, useEffect} from 'react';
import './App.css';
import {FormControl, MenuItem, NativeSelect, Select, Card, CardContent} from '@material-ui/core';
import InfoBox from './components/InfoBox/InfoBox';
import Map from './components/Map/Map';
import Table from './components/Table/Table';
import { sortData } from './util';
import LineGraph from './components/LineGraph/LineGraph';
import "leaflet/dist/leaflet.css";
import {prettyPrintStat} from './util';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('Worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 8.7832, lng: 34.5085});
  const [mapZoom, setMapZoom] = useState(2);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all').then((response) => response.json())
    .then((data) => {
      setCountryInfo(data);
    });
  },[])

  useEffect(() => {
    const getCountriesData = async () => {
      // fetch is inbuilt
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())   // convert the response into the json object.
      .then((data) => {
        const countries = data.map((item) => ({
          name: item.country,
          code: item.countryInfo.iso2,
        }));
        const sortedData = sortData(data);
        
        setTableData(sortedData);
        setCountries(countries);
        setMapCountries(data);
      });
    }

    getCountriesData();
  },[]);
   
  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    console.log('yoyoyoyoyy', countryCode);
    setCountry(countryCode);

    const url = countryCode === "worldwide" ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url).then(response => response.json())
    .then(data => {
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    });

  }

  return (
    <div className="app">
      <div className="app__left">
      <div className="app__header">
      <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
          {/* the value does not appear on the screen, it is just used for the backend purpose. 
          by default the first element in the options will appear on the dropdown in this case worldwide 
          but if u give the native Select a value of empty string then it wont change.*/}
            <NativeSelect className="app__drops" value={country} onChange={onCountryChange}>
              <option value="worldwide">Worldwide</option>
              {countries.map((item, i) => {
                return <option key={i} value={item.code}>{item.name}</option>
              })}
            </NativeSelect>
          </FormControl>
      </div>

      <div className="app__stats">
              <InfoBox isRed active={casesType === "cases"} onClick={(e) => setCasesType("cases")} title="Corona Virus Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)}></InfoBox>
              <InfoBox active={casesType === "recovered"} onClick={(e) => setCasesType("recovered")} title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)}></InfoBox>
              <InfoBox isRed active={casesType === "deaths"} onClick={(e) => setCasesType("deaths")} title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}></InfoBox>

      </div>
      <Map countries={mapCountries} caseType={casesType} center={mapCenter} zoom={mapZoom}/>
      </div>
      
      <Card className="app__right">
              <CardContent>
                <h3>Live cases by Country</h3>
                <Table countries={tableData}></Table>
                <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
               
                <LineGraph className="app__graph" casesType={casesType}/>
                
              </CardContent>
      </Card>
      
    </div>
  );
}

export default App;
