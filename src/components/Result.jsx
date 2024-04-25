import axios from "axios";
import React, { useState } from "react";
import { Oval } from "react-loader-spinner";
function Result({ result, email }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('')
  const [success, setSuccess] = useState("")

  const handleEmail = async () => {
    setLoading(true);
    // check if email is a valid email
    const res = await axios.post(
      `https://100085.pythonanywhere.com/api/v1/mail/${
        import.meta.env.VITE_API_KEY
      }/?type=validate`,
      {
        email,
        name: "david",
        fromName: "test",
        fromEmail: "wokoobiomachukwu@gmail.com",
        subject: "test",
        body: "test",
      }
    );

    if (res.data.success) {
      // if email is valid, send call email sending api
      

      try {
        const response = await axios.post(
          `https://100085.pythonanywhere.com/api/v1/mail/${
            import.meta.env.VITE_API_KEY
          }/?type=send-email`, {
            email,
            name:"Samantha Content Evaluator",
            fromName:"Samantha Content Evaluator",
            fromEmail : "uxlivinglab@dowellresearch.sg",
            subject : "Result from Samantha Content Evaluator",
            body : 
            `<!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Samantha Content Evaluator</title>
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
                    <h2>Samantha Content Evaluator</h2>
                  </article>
            
                  <main style="padding: 20px;">
                    <section style="margin: 20px;">
                      <p>From Samanta,</p>
                      <p style="font-weight: bold; font-size: 14px;">
                        Result from Samantha Content Evaluator
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

        setLoading(false)
        setSuccess('Mail has been sent!!')

        return

        
        
      } catch (error) {

        setError('Something went wrong')
        
        setLoading(false)
        return;
        
      }

     
      
     

    } else {
      // if email is not valid return an error
      setLoading(false);

      setError("Email is not valid")
      
      
      return;
    }
    
  };

  return (
    <div className="mt-8 px-5 pb-5 border border-gray-100 shadow-lg">
      <h2 className="text-xl text-center text-semibold mb-3">
        Result From Samantha
      </h2>

      <div className="result border border-gray-400 rounded-md">
        <div className="border-b border-gray-400 py-1">
          <p className="text-md sm:text-lg relative lg:right-14">
            The Content is{' '}
            <span className="font-bold">{result["AI Check"]}</span>
          </p>
        </div>
        <div className="border-b border-gray-400 flex gap-3 py-3 px-3">
          <p className="sm:text-lg">Plagiarized:</p>
          <p className="font-bold">{result.Plagiarised}</p>
        </div>
        <div className="border-b border-gray-400 flex gap-3 py-3 px-3">
          <p className="sm:text-lg">Creative:</p>
          <p className="font-bold sm:text-lg">{result.Creative}</p>
        </div>
      </div>

      <div className="flex gap-3 mt-10 justify-center items-center">
        <p className="text-lg font-normal">Do you want to mail this?</p>
        <button
          className="p-3 text-white bg-green-500 rounded-lg flex items-start justify-center"
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
{success && <p className=" text-lg font-normal text-center mt-2">{success}</p>}
    </div>
  );
}

export default Result;
