// import React, { useState } from 'react';

// const PlacesSearch = () => {
//     const [location, setLocation] = useState('');
//     const [category, setCategory] = useState('');
//     const [places, setPlaces] = useState([]);

//     const handleLocationChange = (event) => {
//         setLocation(event.target.value);
//     };

//     const handleCategoryChange = (event) => {
//         setCategory(event.target.value);
//     };

//     const handleSearch = async () => {
//         try {
//             const response = await fetch(`https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyBYgvkFTXrxXokdgc6yGQc7WjUtbqdnMq8&callback=initMap`);
//             const data = await response.json();
//             setPlaces(data.results);
//         } catch (error) {
//             console.error('Error fetching data:', error);
//         }
//     };

//     return (
//         <div>
//             <div>
//                 <label htmlFor="location">Location:</label>
//                 <input type="text" id="location" value={location} onChange={handleLocationChange} />
//             </div>
//             <div>
//                 <label htmlFor="category">Category:</label>
//                 <input type="text" id="category" value={category} onChange={handleCategoryChange} />
//             </div>
//             <button onClick={handleSearch}>Search</button>

//             <div>
//                 <h2>Places:</h2>
//                 <ul>
//                     {places.map((place, index) => (
//                         <li key={index}>{place.name}</li>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     );
// };

// export default PlacesSearch;

