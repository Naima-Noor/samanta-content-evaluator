import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import { ModalContext } from "../App";
import Result from "./Result";
import data from "../SamantaContentEvaluator_2.json";

function ContributeModal({
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
    setGlobalState({...globalState,couponError:''})
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
      console.log(error.message);
      // setError(error.message);
    }
  };
  const handleTryAgain = () => {
    setContent("");

    setResult(null);
  };

  const handleCheck = async () => {
    setError("");
    setShowSuccess(false);
    setResult(null);
    setShowTimesUsed(false);

    setLoading(true);

    if (!content) {
      setLoading(false);
      setError("The content field is required");
      return;
    }

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
        const numberUsed = response.data.response[0].used_time;
        setGlobalState({ ...globalState, timesUsed: numberUsed });

        // if they have used more than five times and don't have a coupon, show contribute button
        if (!globalState.couponSuccess && numberUsed > 5) {
          // show contribute button
          setLoading(false);
          setShowContribute(true);

          setCheck(false);
          setShowTimesUsed(true);
          setCancel(true)

          return;
        } else {
          // else make request to evaluator api
          try {
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

            console.log(response.data);

            // reset coupon to empty if it was used successfully to make the request
            setGlobalState({ ...globalState, couponSuccess: "" });

            // update number of times used for the user
            await axios.get(
              `https://100105.pythonanywhere.com/api/v3/experience_database_services/?type=update_user_usage&product_number=UXLIVINGLAB001&email=wokodavid002@gmail.com&occurrences=5https://100105.pythonanywhere.com/api/v3/experience_database_services/?type=update_user_usage&product_number=UXLIVINGLAB001&email=${email}&occurrences=${
                numofTimes+1
              }`
            );

            setNumOfTimes(prev=>prev++);
            
            setShowTimesUsed(true);
            setResult(response.data);
            setLoading(false);
            
          } catch (error) {
            setLoading(false);
            setError("Something went wrong..");
          }
        }
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleRedeem = async (e) => {
    e.preventDefault();
    setShowSuccess(true)

    if (!coupon) {
      setError("Please enter a coupon");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "https://100105.pythonanywhere.com/api/v3/experience_database_services/?type=redeem_coupon",
        {
          email: globalState.globalEmail,
          coupon,
          product_number: "UXLIVINGLAB001",
        }
      );

      if (response.data.success) {
        setLoading(false);
        setGlobalState({
          ...globalState,
          couponSuccess: "You have got one free trial susscessfully",
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
    window.location.href =
      "https://dowellpay.online/contribute-payment/?product_number=UXLIVINGLAB001";
  };

  const handleOpenCouponModal = () => {
    setOpenCouponForm(true);
    setError("");
    setGlobalState({ ...globalState, couponError: "" });
  };

  return (
    <div className="">
      <div className="fixed top-0 left-0 w-full bg-gray-400 opacity-50 h-full flex justify-center items-center"></div>
      <div
        className={
          !result
            ? "flex flex-col justify-center items-center fixed text-center bg-white z-[1500] w-[90%] sm:w-1/2 sm:max-w-[80%] mx-auto h-fit  rounded-lg top-[70px] sm:top-5 py-10 overflow-y-auto"
            : "flex flex-col justify-center items-center fixed text-center bg-white z-[1500] w-[90%] sm:w-1/2 sm:max-w-[80%] mx-auto h-full  rounded-lg top-[70px] sm:top-5 py-10 overflow-y-auto"
        }
      >
        <div className={result && 'mt-[300px] sm:mt-[100px]'}>
          <div className="logo">
            <img
              src="/images/samanthalogo.png"
              alt=""
              className="w-[150px] h-[150px] mx-auto object-contain mt-10"
            />
          </div>
          <p className="text-xl font-bold mt-1 text-center">
            Samantha Content Evaluator
          </p>
          {showTimesUsed && (
            <p className="text-sm sm:text-xl bg-gray-300 sm:mx-auto w-fit p-2 px-10 my-5 rounded-sm mx-2 text-center">
              You have used Samantha Content Evaluator {numofTimes} times
            </p>
          )}
          <div className="buttons flex gap-4 justify-center mt-4">
            {cancel && (
              <button
                className="bg-gray-500 text-white py-2  px-3 text-sm lg:text-lg sm:px-10 rounded-[20px] flex gap-3 items-center justify-center font-semibold"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}

            {check && (
              <button
                className="bg-green-500 text-white py-2  px-3 text-sm lg:text-lg sm:px-10 rounded-[20px] flex gap-3 items-center justify-center font-semibold"
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
                <span className>check</span>
              </button>
            )}

            {contribute && (
              <button className="bg-green-500 text-white py-2  px-3 text-sm lg:text-lg sm:px-10 rounded-[20px] flex gap-3 items-center justify-center font-semibold" onClick={handleContribute}>
                Contribute
              </button>
            )}
          </div>

          <div
            className="close cursor-pointer text-gray-300 absolute right-[30px] sm:right-[50px] top-[30px] sm:top-[50px] font-bold"
            onClick={handleCancel}
          >
            X
          </div>

          {contribute && (
            <div className="flex gap-3 mt-10 justify-center items-center border-t border-gray-200 shadow-md py-2">
              <p className="text-lg font-normal">Do you have a coupon?</p>
              <button
                className="p-3 text-white bg-green-500 rounded-lg"
                onClick={handleOpenCouponModal}
              >
                Yes
              </button>
            </div>
          )}
          {result && <Result result={result} email={email} />}
          {result && (
            <div className="scale my-2">
              <p className="text-gray-800 sm:text-sm text-center">
                On a scale of 0-10, how likely are you to recommend the product
                to a friend or colleague?
              </p>
              <div className="scaleButtons flex flex-wrap gap-1 mx-auto w-[80%]">
                {scaleData.map((item, index) => (
                  <button
                    key={index}
                    className="py-1 px-3 text-white bg-green-500 rounded-lg mt-2"
                    onClick={() => handleScale(item.item[0])}
                  >
                    {index}
                  </button>
                ))}
              </div>
            </div>
          )}

          

          {openCouponForm && (
            <form className="flex gap-2 px-3 py-5 mx-auto">
              <input
                type="text"
                className="block border border-gray-300 py-3 w-3/4 mt-5"
                placeholder="Enter your code"
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button
                className="bg-[#4caf50] text-white rounded-md flex gap-3 items-center font-semibold h-[50px] self-center px-3 mt-4"
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
            <p className="text-red-500 text-lg font-bold">
              {globalState.couponError}
            </p>
          )}
          {globalState.couponSuccess && (
            <p
              className={
                showSuccess ? "text-green-500 text-lg font-bold" : "hidden"
              }
            >
              {globalState.couponSuccess}
            </p>
          )}
          {error && <p className="text-red-500 text-lg font-bold">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default ContributeModal;
