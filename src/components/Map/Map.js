import React from 'react'
import {MapContainer as LeafletMap, TileLayer } from "react-leaflet";
import { Circle, Popup} from "react-leaflet";
import numeral from "numeral";
import './Map.css';

const casesTypeColors = {
    cases: {
      hex: "#CC1034",
      multiplier: 800,
    },
    recovered: {
      hex: "#7dd71d",
      multiplier: 1200,
    },
    deaths: {
      hex: "#fb4443",
      multiplier: 2000,
    },
  };

export default function Map({countries, caseType, center, zoom}) {
    return (
        <div className="map">
            <LeafletMap center={center} zoom={zoom}>
                <TileLayer 
                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                 attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'   
                 />

                {/* loop through countries and show circles */}
                {countries.map((country) =>  (   <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      color={casesTypeColors[caseType].hex}
      fillColor={casesTypeColors[caseType].hex}
      fillOpacity={0.4}
      radius={ Math.sqrt(country[caseType]) * casesTypeColors[caseType].multiplier}
    >
        <Popup>
        <div className="info-container">
          <div
            className="info-flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          ></div>
          <div className="info-name">{country.country}</div>
          <div className="info-confirmed">
            Cases: {numeral(country.cases).format("0,0")}
          </div>
          <div className="info-recovered">
            Recovered: {numeral(country.recovered).format("0,0")}
          </div>
          <div className="info-deaths">
            Deaths: {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle> 
    )
    )} 

            </LeafletMap>
        </div>
    )
}
