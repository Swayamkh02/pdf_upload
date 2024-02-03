import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const AiwithText = () => {
    const genAI = new GoogleGenerativeAI('AIzaSyAZd7u_oOGUApMoylIsBERj1TiD6P9ptXc');

    const [search, setSearch] = useState('');
    const [aiResponse, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    async function aiRun() {
        setLoading(true);
        setResponse('');
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `fetch relevant provisions of Indian laws and Constitution related to the following case , also name and define in one line all the laws and IPC which are applicable and used in the case: {try to give response in table format in case of laws} ,also can you give a grade between 1 to 10 to the query and put it at the last enclosed in 'Grade:' based on the severity of the input incident ${search} `;
        const result = await model.generateContent(prompt,
            safety_settings=[
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
                }
            ]
            );
        const response = await result.response;
        const text = response.text();
        setResponse(text);
        setLoading(false);
    }

    const handleChangeSearch = (e) => {
        setSearch(e.target.value);
    }

    const handleClick = () => {
        aiRun();
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

            {loading && aiResponse === '' ? (
                <p className="mt-3 text-white">Loading ...</p>
            ) : (
                <div className="mt-3">
                    <p className="text-white">{aiResponse}</p>
                </div>
            )}
        </div>
    );
};
export default AiwithText;