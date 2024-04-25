import React, { useContext, useEffect, useState } from "react";

import axios from "axios";
import Result from "./Result";
import { Oval } from "react-loader-spinner";
import { ModalContext } from "../App";
import data from "../SamantaContentEvaluator_2.json";
import ActionModal from "./ActionModal";

function Form() {
  const [title, setTitle] = useState("Topic");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [check, setCheck] = useState(false);
  const [numofTimes, setNumOfTimes] = useState(0);
  const [showContribute, setShowContribute] = useState(false);
  const [result, setResult] = useState(null);
  const [experience, setExperience] = useState(true);
  const [success, setSuccess] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showTimesUsed, setShowTimesUsed] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const[cancel, setCancel] = useState(false)
  const { globalState, setGlobalState } = useContext(ModalContext);

  const scaleData = data.urls;

  // useEffect(() => {
  //   // show check button if coupon is valid
  //   if (globalState.couponSuccess) {
  //     setExperience(false);
  //     setShowContribute(false);
  //     setGlobalState({ ...globalState, couponError: "" });
  //     setShowSuccess(true);
  //     setLoading(false);
  //     setCheck(true);
  //   }
  // }, [globalState.couponSuccess]);

  const handleExperience = async (e) => {
    e.preventDefault();

    setError("");
    // check if email is inputted
    if (!email) {
      setLoading(false);
      setError("The email field is required");
      return;
    }

    const numOfWords = content.trim().split(/\s+/);

    // check if content is less than 50
    if (numOfWords.length < 60) {
      setLoading(false);
      setError("Content must have at least 60 words.");
      return;
    }

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
  };
  

  const handleReset = (e) => {
    setGlobalState({
      ...globalState,
      couponError: "",
    });
    e.preventDefault();
    setContent("");
    setTitle("");
    setResult("");
    setEmail("");
  };

  const handleClose = (e) => {
    e.preventDefault();
    window.close();
  };

  return (
    <div>
      <form className="flex flex-col gap-10">
        <input
          type="text"
          placeholder="Topic Name"
          className="border border-gray-300 block w-full rounded-lg py-2 lg:py-3 px-1"
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          rows="16"
          placeholder="Content"
          required
          className="border border-gray-300 block w-full rounded-lg px-1"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <input
          type="text"
          placeholder="Enter your email address"
          required
          value={email}
          className="border border-gray-300 block  w-full rounded-lg py-2 lg:py-3 px-1"
          onChange={(e) => setEmail(e.target.value)}
        />

        

        <div className="buttons flex flex-wrap justify-center items-center gap-2 lg:gap-3 ">
          <button
            className="bg-[#FF0000] text-white text-sm lg:text-lg px-4 py-2 rounded-md flex items-center justify-center font-semibold"
            onClick={handleClose}
          >
            Close
          </button>
          <button
            className="bg-[#D6BB41] text-white py-2 text-sm lg:text-lg px-3 sm:px-8 rounded-md flex items-center justify-center font-semibold"
            onClick={handleReset}
          >
            Reset
          </button>


          {experience && (
            <button
              onClick={handleExperience}
              disabled={loading}
              className="bg-[#005734] text-white py-2  px-3 text-sm lg:text-lg sm:px-10 rounded-md flex gap-3 items-center font-semibold justify-center"
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

          {/* {showContribute && (
            <button
              className="bg-[#005734] text-white py-2  px-3 sm:px-10 text-sm lg:text-lg rounded-md flex gap-3 items-center font-semibold"
              onClick={handleContribute}
            >
              Contribute
            </button>
          )} */}
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
       {error && <p className="text-red-500 text-lg font-bold">{error}</p>}
    </div>
  );
}

export default Form;
