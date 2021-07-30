import React from 'react'
import './Table.css';
import numeral from 'numeral';

export default function Table({countries}) {
    return (
        <div className="table">
            {countries.map(item => (
                <tr>
                <td>{item.country}</td>
                <td>
                <strong>{numeral(item.cases).format('0,0')}</strong>
                </td>
            </tr>
            ))}
            
        </div>
    )
}
