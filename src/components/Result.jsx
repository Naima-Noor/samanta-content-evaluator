import axios from "axios";
import React, { useState } from "react";
import { Oval } from "react-loader-spinner";

function Result({ result, email }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('')
  const [success, setSuccess] = useState("")

  const handleEmail = async () => {
    setLoading(true);

    // send email to user
    try {
      const response = await axios.post(
        `https://100085.pythonanywhere.com/api/v1/mail/${
          import.meta.env.VITE_API_KEY
        }/?type=send-email`, {
          email,
          name:"Samanta Content Evaluator",
          fromName:"Samanta Content Evaluator",
          fromEmail : "uxlivinglab@dowellresearch.sg",
          subject : "Result from Samanta Content Evaluator",
          body : 
          `<!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Samanta Content Evaluator</title>
            </head>
            <body
              style="
                font-family: Arial, sans-serif;
                background-color: #ffffff;
                margin: 0;
                padding: 0;
                width:100%
              "
            >
              <div style="width: 100%; background-color: #ffffff;">
                <header
                  style="
                    color: #fff;
                    display: flex;
                    text-align: center;
                    justify-content: center;
                    padding: 5px;
                  "
                >
                  <img
                    src="https://www.uxlivinglab.org/wp-content/uploads/2023/08/logo-e1531386713115.webp"
                    height="140px"
                    width="140px"
                    style="display: block; margin: 0 auto;"
                  />
                </header>
                <article style="margin-top: 20px; text-align: center;">
                  <h2>Samanta Content Evaluator</h2>
                </article>
          
                <main style="padding: 20px;">
                  <section style="margin: 20px;">
                    <p>From Samanta,</p>
                    <p style="font-weight: bold; font-size: 14px;">
                      Result from Samanta Content Evaluator
                    </p>
                    
                     <p style="font-size: 1.1em;">The Content is ${result["AI Check"]}</p>
                    <p style="font-size: 1.1em;">Plagiarized: ${result.Plagiarised}</p>
                    <p style="font-size: 1.1em;">Creative: ${result.Creative}</p>

                  </section>
                </main>
          
                <footer
                  style="
                    background-color: #005733;
                    color: #fff;
                    text-align: center;
                    padding: 10px;
                  "
                >
                  <a
                    href="https://www.uxlivinglab.org/"
                    style="
                      text-align: center;
                      color: white;
                      margin-bottom: 20px;
                      padding-bottom: 10px;
                    "
                    >DoWell UX Living Lab</a
                  >
                  <p style="margin-top: 10px; font-size: 13px;">
                    © 2023-All rights reserved.
                  </p>
                </footer>
              </div>
            </body>
          </html>`
        }
      );

      if (response.data.success) {
        setLoading(false);
        setSuccess('Mail has been sent!')
      } else {
        setLoading(false);
        setError(response.data.message);
      }
      
      return

    } catch (error) {
      setError('Something went wrong')
      setLoading(false);
      return; 
    }
  };

  return (
    <div className="w-11/12 my-5 p-4 mx-auto border border-gray-100 shadow-lg">
      <h2 className="text-center my-2 font-bold text-xl">Result From Samanta</h2>

      <div className="result border border-gray-400 rounded-md">
        <div className="border-b border-gray-400 flex gap-3 p-3 items-center">
          <p>
            The Content is{' '}
            <span className="font-semibold">{result["AI Check"]}</span>
          </p>
        </div>
        <div className="border-b border-gray-400 flex gap-3 p-3 items-center">
          <p>Plagiarized:</p>
          <p className="font-semibold">{result.Plagiarised}</p>
        </div>
        <div className="flex gap-3 p-3 items-center">
          <p>Creative:</p>
          <p className="font-semibold">{result.Creative}</p>
        </div>
      </div>

      <div className="flex gap-3 mt-8 justify-center items-center">
        <p>Do you want to mail this?</p>
        <button
          className="px-2 py-1 text-white bg-green-500 hover:bg-green-400 rounded-md"
          onClick={handleEmail}
        >
          {loading ? (
            <Oval
              visible={true}
              height="15"
              width="15"
              color="white"
              ariaLabel="oval-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          ) : (
            "Yes"
          )}
        </button>
      </div>
      {error && <p className="text-red-500 text-lg font-bold text-center mt-2">{error}</p>}
      {success && <p className="p-2 rounded text-center bg-neutral-100 text-green-500 w-fit font-semibold mx-auto my-5">{success}</p>}
    </div>
  );
}

export default Result;
