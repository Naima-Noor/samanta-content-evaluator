import React, { useContext, useState } from "react";
import { ModalContext } from "../App";
import axios from "axios";
import { Oval } from "react-loader-spinner";

function CouponModal() {
  const { globalState, setGlobalState } = useContext(ModalContext);

  const [coupon, setCoupon] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRedeem = async (e) => {
    e.preventDefault();

    if (!coupon) {
      setError("Please enter a coupon");
      return;
    }

    
    try {
        setLoading(true)
        const response = await axios.post(
            "https://100105.pythonanywhere.com/api/v3/experience_database_services/?type=redeem_coupon",
            {
              email: globalState.globalEmail,
              coupon,
              product_number:"UXLIVINGLAB001"
            }
          );
      
          if(response.data.success){
            setLoading(false)
              setGlobalState({
                  ...globalState,
                  couponSuccess: 'You have got one free trial susscessfully'
              })
              globalState.setOpenModal(false);
          } else if(response.data.message.includes('available')){
            setLoading(false)
              setGlobalState({
                  ...globalState,
                  couponError: 'Coupon is not available'
              })
      
              globalState.setOpenModal(false);
          }
        
    } catch (error) {
        setLoading(false)
        setGlobalState({
            ...globalState,
            couponError: 'Coupon is not active. Please ask for a different coupon. Thank you'
        })

        globalState.setOpenModal(false)
        
    }

    
  };

  const handleCloseModal = (e) => {
    e.preventDefault();

    globalState.setOpenModal(false);
  };
  return (
    <>
      <div className="fixed top-0 left-0 w-full bg-gray-400 opacity-50 z-[1000] h-full"></div>
      <div className="fixed bg-white z-[1001] w-[90%] sm:w-1/2 sm:max-w-[80%] h-fit mx-auto left-[5%] sm:left-[25%] rounded-lg top-[25%]">
        <form className="py-10 sm:px-5 px-1">
          <h2 className="text-center lg:text-4xl font-semibold">
            Redeem Coupon
          </h2>
          <p className="text-center font-normal lg:text-lg mt-5">
            Enter Coupon Code
          </p>

          <input
            type="text"
            className="block border border-gray-300 py-3 w-full mt-5"
            placeholder="Enter your code"
            onChange={(e) => setCoupon(e.target.value)}
          />
          <div className="buttons flex flex-col sm:flex-row  justify-center items-center gap-3 mt-8">
            <button
              className="bg-[#4caf50] text-white py-2  px-3 sm:px-10 text-sm lg:text-lg rounded-md flex gap-3 items-center font-semibold"
              onClick={handleRedeem}
            >
              {
                loading &&<Oval
                visible={true}
                height="18"
                width="18"
                color="white"
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
              }
             
            Redeem
            </button>
            <button
              className="bg-[#4caf50] hover:bg-[#c36] text-white py-2   px-10 text-sm lg:text-lg rounded-md flex gap-3 items-center font-semibold"
              onClick={handleCloseModal}
            >
              Close
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 text-lg font-bold text-center">{error}</p>}
      </div>
    </>
  );
}

export default CouponModal;
