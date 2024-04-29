import { createContext, useState } from "react";
import Header from "./components/Header";
import Body from "./components/Body";

export const ModalContext = createContext();

function App() {
  const [globalState, setGlobalState] = useState({
    
    globalEmail: "",
    couponError: "",
    couponSuccess: '',
      
  });

  return (
    <ModalContext.Provider value={{ globalState, setGlobalState }}>
      <div>
        <div id="main" className="bg-white text-sm w-full md:w-8/12 lg:w-7/12 sm:text-md md:text-base mx-auto p-4 my-2 rounded-md border border-gray-400 md:border-none">
          <Header />
          <Body />
        </div>
      </div>
    </ModalContext.Provider>
  );
}

export default App;
