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


let latitude='';
let longitude='';

const successCallback = (position) => {
  console.log(position);
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  console.log("Printing Positions:");
  console.log(latitude);
  console.log(longitude);
};

const errorCallback = (error) => {
  console.log(error);
};

navigator.geolocation.getCurrentPosition(successCallback, errorCallback,{
  enableHighAccuracy: true,
  timeout: 5000, // Optional timeout
  maximumAge: 0 // Ensure freshest position
});
async function generateContent() {
  // getUserCoordinates();
  try {
    const queryInput = document.getElementById('queryInput');
    const query1 = queryInput.value.trim();
    const query=" Give nearby poilce stations name, address and distance from the given co ordinates(give ans in tabular form): Latitude"+ latitude+" ,Longitude:"+longitude;

    if (!query) {
      alert('Please enter a query.');
      return;
    }

    const response = await fetch('/api/generate-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error('Server error');
    }

    const result = await response.json();

    // Format the generated content for display
    const formattedContent = formatContent(result.generatedContent);

    // Update the DOM with the formatted content
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = formattedContent;

    // Apply Prism to the newly added code blocks
    // Prism.highlightAll();
  } catch (error) {
    console.error('Error generating content:', error);
  }
}

function formatContent(content) {
  // Check if triple backticks are present
  if (content.includes('```')) {
    // Replace triple backticks with code formatting
    return content.replace(/```([\s\S]*?)```/g, (match, codeBlock) => {
      // Wrap the code content in a pre tag with the "language-python" class
      return `<pre class="language code-area">${codeBlock}</pre>`;
    });
  } else {
    // Check if the content contains a pattern indicative of a table
    if (/\|.*\|/.test(content)) {
      // Convert Markdown table to HTML table
      return markdownTableToHtml(content);
    } else {
      // Return normal text as-is
      return formatText(content);
    }
  }
}
function markdownTableToHtml(markdownTable) {
  // Split the table content into rows
  const rows = markdownTable.split('\n');

  // Remove empty rows
  const nonEmptyRows = rows.filter(row => row.trim() !== '');

  // Determine if the table has a header row
  const hasHeader = nonEmptyRows[1].includes('---');

  // Extract header and body rows
  const [headerRow, ...bodyRows] = nonEmptyRows;

  // Determine the tag for the header row
  const headerTag = hasHeader ? 'th' : 'td';

  // Process header row
  const headers = headerRow
    .split('|')
    .filter(cell => cell.trim() !== '')
    .map(header => {
      // Check for bolded text within header cell
      return header.replace(/\*\*(.*?)\*\*/g, (match, boldText) => {
        return `<strong>${boldText}</strong>`;
      });
    })
    .map(header => `<${headerTag}>${header.trim()}</${headerTag}>`)
    .join('');

  // Process body rows
  const body = bodyRows
    .map(row =>
      row
        .split('|')
        .filter(cell => cell.trim() !== '')
        .map(cell => {
          // Check for bolded text within body cell
          return cell.replace(/\*\*(.*?)\*\*/g, (match, boldText) => {
            return `<strong>${boldText}</strong>`;
          });
        })
        .map(cell => `<td>${cell.trim()}</td>`)
        .join('')
    )
    .map(row => `<tr>${row}</tr>`)
    .join('');

  // Create HTML table
  return `<table><thead>${headers}</thead><tbody>${body}</tbody></table>`;
}


// Function to format simple text, bold words, and headings
function formatText(text) {
  // Use regular expression to replace **bold** with <strong>bold</strong>
  text = text.replace(/\*\*(.*?)\*\*/g, (match, boldText) => {
    return `<strong>${boldText}</strong>`;
  });

  // Use regular expression to replace ## Heading with <h2>Heading</h2>
  text = text.replace(/## (.*?)(\n|$)/g, (match, headingText) => {
    return `<h2>${headingText}</h2>`;
  });

  text = `<div class="normal-text">${text}</div>`;
  return text;
}
document.getElementById('generateBtn').addEventListener('click', generateContent);


/************************React Code************************ */

// import React, { useEffect, useState } from 'react';

// const GeoLocationComponent = () => {
//   const [latitude, setLatitude] = useState('');
//   const [longitude, setLongitude] = useState('');

//   useEffect(() => {
//     const successCallback = (position) => {
//       console.log(position);
//       setLatitude(position.coords.latitude);
//       setLongitude(position.coords.longitude);
//       console.log("Printing Positions:");
//       console.log(latitude);
//       console.log(longitude);
//     };

//     const errorCallback = (error) => {
//       console.log(error);
//     };

//     navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
//       enableHighAccuracy: true,
//       timeout: 5000, // Optional timeout
//       maximumAge: 0 // Ensure freshest position
//     });
//   }, []); // Empty dependency array ensures useEffect runs only once after the component mounts

//   return (
//     <div>
//       <h2>User Geolocation</h2>
//       <p>Latitude: {latitude}</p>
//       <p>Longitude: {longitude}</p>
//     </div>
//   );
// };

// export default GeoLocationComponent;

