import React, { useContext, useState } from "react";
import axios from "axios";
import { ModalContext } from "../App";
import ActionModal from "./ActionModal";
import { Oval } from "react-loader-spinner";

function Form() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [check, setCheck] = useState(false);
  const [numofTimes, setNumOfTimes] = useState(0);
  const [showContribute, setShowContribute] = useState(false);
  const [result, setResult] = useState(null);
  const [experience, setExperience] = useState(true);
  const [showTimesUsed, setShowTimesUsed] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [cancel, setCancel] = useState(false);
  const { globalState, setGlobalState } = useContext(ModalContext);

  const handleExperience = async (e) => {
    e.preventDefault();

    setError("");

    // set default title if not entered by user
    if (!title) {
      setTitle('Topic Name');
    }

    // check if content is not empty
    if (!content) {
      setLoading(false);
      setError('Content cannnot be empty.');
      return;
    }

    // check if email is not empty
    if (!email) {
      setLoading(false);
      setError('Email cannnot be empty.');
      return;
    }

    const numOfWords = content.trim().split(/\s+/);

    // check if content is less than 50
    if (numOfWords.length < 60) {
      setLoading(false);
      setError("Content must have at least 60 words.");
      return;
    }

    // check if email is valid
    try {
      setLoading(true);
      const response = await axios.post(
        "https://100085.pythonanywhere.com/api/v1/mail/4f0bd662-8456-4b2e-afa6-293d4135facf/?type=validate",
        {
          email,
          name : "",
          fromName : "",
          fromEmail : "",
          subject : "",
          body : ""
        }
      );
      if (response.data.success) {
        setLoading(false);
        
        // make email accessible to all components
        setGlobalState({
          ...globalState,
          globalEmail: email,
        });

        try {
          // get user details and number of times they have used the application
          setLoading(true);
          const response = await axios.post(
            "https://100105.pythonanywhere.com/api/v3/experience_database_services/?type=experienced_service_user_details",
            {
              email,
              product_number: "UXLIVINGLAB001",
              occurrences: 1,
            }
          );
    
          if (response.data.success) {
            setLoading(false);
    
            const numberUsed = response.data.response[0].used_time;
            setNumOfTimes(numberUsed)
          
            // if they have used more than four times, show contribute button
            if ((numberUsed === 4) | (numberUsed == 5)) {
              // show contribute button
              setShowContribute(true);
              
              setCheck(true);
             
              setLoading(false);
              setShowActionModal(true);
    
              return;
            } else if (numberUsed > 5) {
              setShowContribute(true);
              setCancel(true);
              setCheck(false);
              setGlobalState({ ...globalState, showTimesUsed: true });
              setLoading(false);
              setShowActionModal(true);
            } else {
              // else show check button
             
              setShowContribute(false);
              setCheck(true);
              setGlobalState({ ...globalState, showTimesUsed: true });
              setLoading(false);
              setShowActionModal(true);
            }
          } else {
            // if user does not exist, register user
            try {
              await axios.post(
                "https://100105.pythonanywhere.com/api/v3/experience_database_services/?type=register_user",
                {
                  product_number: "UXLIVINGLAB001",
                  email,
                }
              );
              setLoading(false);
              setCheck(true);
              setShowActionModal(true);
            } catch (error) {
              setLoading(false);
              setError(error.response.data.message);
            }
          }
        } catch (error) {
          setLoading(false);
    
          setError(error.response.data.message);
        }
      } else {
        setLoading(false);
        setError(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };
  
  const handleReset = (e) => {
    e.preventDefault();
    setGlobalState({
      ...globalState,
      couponError: "",
    });
    
    setTitle("");
    setContent("");
    setResult("");
    setEmail("");
  };

  const handleClose = (e) => {
    e.preventDefault();
    window.close();
  };

  return (
    <div className="mt-5 lg:mt-1">
      
      <form className="flex flex-col gap-4 text-[15px]">
        <input
          type="text"
          placeholder="Topic Name"
          className="border border-gray-300 block w-full rounded-lg p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          rows="10"
          placeholder="Content"
          required
          className="border border-gray-300 block w-full rounded-lg p-2"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <input
          type="text"
          placeholder="Enter your email address"
          required
          value={email}
          className="border border-gray-300 block w-full rounded-lg p-2"
          onChange={(e) => setEmail(e.target.value)}
        />

        
        {error && <p className="text-red-500 text-center font-bold">{error}</p>}
        <div className="buttons flex flex-wrap justify-center items-center gap-4 mt-3">
          <button
            className="bg-[#FF0000] text-white px-4 py-2 rounded-md flex items-center justify-center font-semibold"
            onClick={handleClose}
          >
            Close
          </button>
          <button
            className="bg-[#D6BB41] text-white py-2 px-3 sm:px-8 rounded-md flex items-center justify-center font-semibold"
            onClick={handleReset}
          >
            Reset
          </button>


          {experience && (
            <button
              onClick={handleExperience}
              disabled={loading}
              className="bg-[#005734] text-white py-2 px-3 rounded-md flex gap-4 items-center font-semibold justify-center"
            >
              {loading && (
                <Oval
                  visible={true}
                  height="15"
                  width="15"
                  color="white"
                  ariaLabel="oval-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              )}
              <i className="fa-solid fa-paper-plane w-2 h-2 mb-2"></i>
              <span>Experience</span>
            </button>
          )}

        </div>
      </form>

      {showActionModal && (
        <ActionModal
          check={check}
          setCheck={setCheck}
          contribute={showContribute}
          setShowContribute={setShowContribute}
          setShowActionModal={setShowActionModal}
          setContent={setContent}
          setTitle={setTitle}
          setEmail={setEmail}
          content={content}
          title={title}
          email={email}
          showTimesUsed={showTimesUsed}
          setShowTimesUsed={setShowTimesUsed}
          result={result}
          setResult={setResult}
          numofTimes={numofTimes}
          setNumOfTimes={setNumOfTimes}
          cancel={cancel}
          setCancel={setCancel}
        />
      )}
    </div>
  );
}

export default Form;
