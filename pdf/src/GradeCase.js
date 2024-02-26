import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactTable from 'react-table'; // Assuming you're using React Table


const GradeCase = () => {
    const genAI = new GoogleGenerativeAI('AIzaSyAZd7u_oOGUApMoylIsBERj1TiD6P9ptXc');

    const [search, setSearch] = useState('');
    const [aiResponse, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [grade,setGrade]=useState('');
    async function aiRun() {
        setLoading(true);
        setResponse('');
        const safety_settings=[
          {
              "category": "HARM_CATEGORY_HARASSMENT",
              "threshold": "BLOCK_NONE",
          },
          {
              "category": "HARM_CATEGORY_HATE_SPEECH",
              "threshold": "BLOCK_NONE",
          },
          {
            "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            "threshold": "BLOCK_NONE",
          },
          {
              "category": "HARM_CATEGORY_DANGEROUS",
              "threshold": "BLOCK_NONE",
          },
          {
            "category": "HARM_CATEGORY_UNSPECIFIED",
            "threshold": "BLOCK_NONE",
            },
            {
            "category": "HARM_CATEGORY_DEROGATORY",
            "threshold": "BLOCK_NONE",
            },
            {
            "category": "HARM_CATEGORY_TOXICITY",
            "threshold": "BLOCK_NONE",
            },
            {
            "category": "HARM_CATEGORY_MEDICAL",
            "threshold": "BLOCK_NONE",
            },
            {
            "category": "HARM_CATEGORY_SEXUAL",
            "threshold": "BLOCK_NONE",
            }           
        ];
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `You have to analyze the situation given and give a grade between 1 to 10 to the situation and put it like  'Grade:' based on the swiftness or response time required by the police for the  given query incident (more the grade higher priority) Incident->:${search} `;
        const result = await model.generateContent(prompt,safety_settings);
        const response = await result.response;
        const text = await formatResponse(response.candidates[0].content.parts[0].text);
        setGrade(extractGrade(response.candidates[0].content.parts[0].text));
        console.log(grade);
        setResponse(text);
        setLoading(false);
    }

    const handleChangeSearch = (e) => {
        setSearch(e.target.value);
    }

    const handleClick = () => {
        aiRun();
    }
    const formatResponse = async (response) => {
        // Check if the response contains a pattern indicative of a table
        if (/\|.*\|/.test(response)) {
            // Convert Markdown table to HTML table
            const htmlTable = await markdownTableToHtml(response);
            return htmlTable;
        } else {
            // Format simple text, bold words, and headings
            return formatText(response);
        }
    }

    const markdownTableToHtml = async (markdownTable) => {
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

    const formatText = (text) => {
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
    
    function extractGrade(text) {
        // Regular expression to match the grade number
        const gradeRegex = /Grade: (\d+)/;
    
        // Use the match() method to search for the grade pattern in the text
        const match = text.match(gradeRegex);
    
        // If a match is found, return the extracted grade number
        if (match && match[1]) {
            return parseInt(match[1]); // Convert the matched string to a number
        } else {
            return null; // Return null if no grade is found in the text
        }
    }
    return (
        <div className="container mt-3">
            <div className="d-flex">
                <input className="form-control" placeholder='What is your issue?' onChange={(e) => handleChangeSearch(e)} />
                <button className="btn btn-primary ml-3" onClick={() => handleClick()}
                style={{
                    marginTop:'10rem',
                    marginLeft:'2rem'
                }}
                >Search</button>
            </div>
            <div></div>

            {loading && aiResponse === '' ? (
                <p className="mt-3 text-white">Loading ...</p>
            ) : (
                <div className="mt-3">
                    {aiResponse ? (
                        <div className="text-white" dangerouslySetInnerHTML={{ __html: aiResponse }} />
                    ) : (
                        <p className="text-white">No response found.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default GradeCase;
