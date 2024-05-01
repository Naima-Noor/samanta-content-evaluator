import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import { ModalContext } from "../App";
import Result from "./Result";
import data from "../SamantaContentEvaluator_2.json";

function ActionModal({
  result,
  setResult,
  check,
  setCheck,
  contribute,
  setShowActionModal,
  title,
  email,
  content,
  setShowContribute,
  showTimesUsed,
  setShowTimesUsed,
  numofTimes,
  setNumOfTimes,
  setContent,
  setTitle,
  setEmail,
  cancel,
  setCancel
}) {
  const { globalState, setGlobalState } = useContext(ModalContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openCouponForm, setOpenCouponForm] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [showSuccess, setShowSuccess] = useState(true);
  
  const scaleData = data.urls;

  useEffect(() => {
    setShowTimesUsed(true);

    if ((numofTimes < 4) | (numofTimes > 6)) {
      setCancel(true);
    }
    if ((numofTimes === 4) | (numofTimes === 5)) {
      setCancel(false);
      setShowContribute(true);
      setCheck(true);
    }
    if (numofTimes > 6 && !globalState.couponSuccess) {
      setShowContribute(true);
      setCancel(true)
      setCheck(false);
    }
    if (numofTimes > 6 && globalState.couponSuccess) {
      setShowContribute(true);
      setCheck(true);
      setCancel(false);
    }
    
  }, [numofTimes, globalState.couponSuccess]);

  const handleCancel = () => {
    // setGlobalState({...globalState,couponError:''})
    // setShowActionModal(false);

    setResult(null);
    setGlobalState({
      ...globalState,
      couponError: "",
      couponSuccess: "",
    });
    setShowActionModal(false);
  };

  const handleScale = async (item) => {
    try {
      const res = await axios.get(item);
      if (res.data.success) {
        setSuccess(
          "Thank you for using our application. We really appreciate your feedback"
        );
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleTryAgain = () => {
    setResult(null);
    setTitle("");
    setContent("");
    setEmail("");
    setGlobalState({
      ...globalState,
      globalEmail: "",
      couponError: "",
      couponSuccess: "",
    });
    setShowActionModal(false);
  };

  const handleCheck = async () => {
    setError("");
    setShowSuccess(false);
    setResult(null);

    // make request to evaluator api
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/${
          import.meta.env.VITE_API_KEY
        }/`,
        {
          title,
          content,
        }
      );

      // remove errors in UI if they exist
      setError("");
      setGlobalState({
        ...globalState,
        couponError: "",
        couponSuccess: "",
      });

      if (response.data.success) {
        // reset coupon to empty if it was used successfully to make the request
        setGlobalState({ ...globalState, couponSuccess: "" });

        // update number of times used for the user
        await axios.get(
          `https://100105.pythonanywhere.com/api/v3/experience_database_services/?type=update_user_usage&product_number=UXLIVINGLAB001&email=${email}&occurrences=${
            numofTimes+1
          }`
        );

        setNumOfTimes(prev=>prev++);
        
        setShowTimesUsed(true);
        setResult(response.data);
        setCancel(false);
        setShowContribute(false);
        setCheck(false);
        setLoading(false);
      } else {
        setLoading(false);
        setError(response.data.message);
      }      
      
    } catch (error) {
      setLoading(false);
      setError("Something went wrong..");
    }
  };

  const handleRedeem = async (e) => {
    e.preventDefault();
    setShowSuccess(true);

    if (!coupon) {
      setError("Please enter a coupon");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "https://100105.pythonanywhere.com/api/v3/experience_database_services/?type=redeem_coupon",
        {
          email,
          coupon,
          product_number: "UXLIVINGLAB001",
        }
      );

      if (response.data.success) {
        setLoading(false);
        setGlobalState({
          ...globalState,
          couponSuccess: "You have got one free trial successfully",
        });
        if (!check) {
          setCheck(true);
        }
        setOpenCouponForm(false);
      } else if (response.data.message.includes("available")) {
        setLoading(false);
        setGlobalState({
          ...globalState,
          couponError: "Coupon is not available",
        });

        setOpenCouponForm(false);
      }
    } catch (error) {
      setLoading(false);
      setGlobalState({
        ...globalState,
        couponError:
          "Coupon is not active. Please ask for a different coupon. Thank you",
      });

      setOpenCouponForm(false);
    }
  };

  const handleContribute = (e) => {
    e.preventDefault();
    // redirect to payment page
    window.open("https://dowellpay.online/contribute-payment/?product_number=UXLIVINGLAB001", '_blank');
  };

  const handleOpenCouponModal = () => {
    setOpenCouponForm(true);
    setError("");
    setGlobalState({ ...globalState, couponError: "" });
  };

  return (
    <>
      <div className="flex justify-center items-center overflow-hidden fixed inset-0 z-50 outline-none focus:outline-none font-poppins">
        <div className="relative w-11/12 my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none max-h-screen overflow-y-auto">
            <div className="mb-5">
              <div className="logo">
                <img
                  src="/images/samantalogo.png"
                  alt=""
                  className="w-[125px] h-[150px] mx-auto object-contain mt-10"
                />
              </div>
              <p className="text-xl font-semibold text-[#005734] mt-1 text-center">
                Samanta Content Evaluator
              </p>
              {showTimesUsed && (
                <p className="p-2 rounded text-center bg-neutral-100 text-black w-fit mx-auto my-5">
                  You have used Samanta Content Evaluator {numofTimes} times
                </p>
              )}
              <div className="buttons flex gap-4 justify-center mt-4">
                {cancel && (
                  <button
                    className="bg-gray-500 hover:bg-gray-400 text-white p-2 text-sm md:text-[15px] rounded-md"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                )}

                {check && (
                  <button
                    className="bg-green-500 hover:bg-green-400 text-white p-2 text-sm md:text-[15px] rounded-md flex gap-2 items-center"
                    onClick={handleCheck}
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
                    <i className="fas fa-search text-white w-3 h-3"></i>
                    <span>Check</span>
                  </button>
                )}

                {contribute && (
                  <button className="bg-green-500 hover:bg-green-400 text-white p-2 text-sm md:text-[15px] rounded-md flex gap-2 items-center" 
                  onClick={handleContribute}>
                    Contribute
                  </button>
                )}
              </div>

              <div
                className="close cursor-pointer text-gray-300 hover:text-black absolute right-[30px] top-[30px] font-bold"
                onClick={handleCancel}
              >
                X
              </div>

              {(contribute && !result) && (
                <div className="flex gap-2 mt-10 justify-center items-center border-t py-2">
                  <p className="text-sm md:text-base">Do you have a coupon?</p>
                  <button
                    className="px-2 py-1 text-white bg-green-500 hover:bg-green-400 rounded-md"
                    onClick={handleOpenCouponModal}
                  >
                    Yes
                  </button>
                </div>
              )}
              {result && <Result result={result} email={email} title={title} content={content}/>}
              {result && (
                <div className="scale my-3 mt-5">
                  <p className="text-gray-800 px-5 text-center text-sm">
                    On a scale of 0-10, how likely are you to recommend the product
                    to a friend or colleague?
                  </p>
                  <div className="scaleButtons p-3 flex flex-wrap gap-2 w-fit mx-auto">
                    {scaleData.map((item, index) => (
                      <button
                        key={index}
                        className="px-2 text-white bg-green-500 rounded-lg mt-2"
                        onClick={() => handleScale(item.item[0])}
                      >
                        {index}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {result && 
                <button
                  className="flex items-center gap-2 text-white bg-slate-700 hover:bg-slate-500 rounded-md p-2 py-1 mt-5 mb-3 mx-auto"
                  onClick={handleTryAgain}
                >
                  Try Again
                </button>
              }

              {error && <p className="text-red-500 text-center mt-3 font-bold">{error}</p>}

              {openCouponForm && (
                <form className="flex flex-col sm:flex-row gap-3 mb-5 items-center justify-between sm:p-5">
                  <input
                    type="text"
                    className="block border border-gray-300 p-2 w-10/12 rounded-md"
                    placeholder="Enter your code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                  />
                  <button
                    className="flex items-center gap-2 text-white bg-green-500 hover:bg-green-400 rounded-md p-2 py-1"
                    onClick={handleRedeem}
                  >
                    {loading && (
                      <Oval
                        visible={true}
                        height="18"
                        width="18"
                        color="white"
                        ariaLabel="oval-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                      />
                    )}
                    Redeem
                  </button>
                </form>
              )}

              {globalState.couponError && (
                <p className="text-red-500 font-bold w-fit mx-auto py-3">
                  {globalState.couponError}
                </p>
              )}

              {globalState.couponSuccess && (
                <p
                  className={
                    showSuccess ? "text-green-500 font-semibold w-fit mx-auto py-3" : "hidden"
                  }
                >
                  {globalState.couponSuccess}
                </p>
              )}
              
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

export default ActionModal;
