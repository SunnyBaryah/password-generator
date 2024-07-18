import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
// Yaha pe hum useCallback and useEffect and useRef ke baare me smjhenge
// useEffect ka kaam ye hai ki hum jo dependencies use denge unme agar kuch bhi hal chal ho to function invoke kardena
// useCallback ka kaam hai ki us function ko dependencies ke hisaab se optimise karna
// useCallback jitna ho skta hai utna memorise karleta hai function ko
// useCallback(fn reference, [dependencies]), it optimises the re-triggering of the function

function App() {
  const [length, setLength] = useState(8);
  const [numAllowed, setNumAllowed] = useState(false);
  const [charAllowed, setCharAllowed] = useState(false);
  const [password, setPassword] = useState("");

  //ref hook
  const passRef = useRef(null);
  const copyPasswordToClipboard = useCallback(() => {
    // Ye copy button click karte hi highlight kardega text ko ki select ho chuka hai ye pta lag jaaye
    // ? is vajah ki ho skta null ho
    passRef.current?.select();
    // Ab hum ye bhi decide kar skte kitna select karwana
    passRef.current?.setSelectionRange(0, 50);

    // Ye to react hai is vajah se window likh paaye kyunki browser side rendering hai
    // Agar next.js hota to ni kar paate kyunki usme Server side rendering hoti hai
    window.navigator.clipboard.writeText(password);
  }, [password]);

  const passwordGenerator = useCallback(() => {
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    if (numAllowed) str += "0123456789";
    if (charAllowed) str += ",./;'[]<>?:|#$%^&*!()=-`~";
    for (let i = 0; i < length; i++) {
      let index = Math.floor(Math.random() * str.length + 1);
      let char = str.charAt(index);
      pass += char;
    }
    setPassword(pass);
  }, [length, numAllowed, charAllowed, setPassword]);
  // Agar password ko daal dia dependency me to baar baar invoke hota rhega kyunki initially password render hoga then
  // usme change ke karan firse function invoke and then render and so on
  // That is why dependency me setPassword dala
  // useCallback ke andar used function memoize kia jata hai to optimise the performance
  // it is recommended to add the setter method inside dependencies of useCallback

  useEffect(() => {
    passwordGenerator();
  }, [length, numAllowed, charAllowed, passwordGenerator]);
  // useEffect ka kaam solely ye hai ki dependency me change aate hi function invoke karna

  // Now kaam reh gya copy ka
  // iske liye use hoga useRef hook
  // This hook is used to return reference
  // Yehi copy button and input field me relation bnayega

  return (
    <>
      <div className="h-screen flex flex-wrap justify-center items-center">
        <div className="w-full max-w-md shadow-md rounded-lg px-4 text-orange-500 bg-gray-700">
          <h1 className="text-white text-center py-5 my-2 text-3xl font-extralight">
            Password Generator
          </h1>
          <div className="flex shadow rounded-lg overflow-hidden mb-4">
            <input
              type="text"
              value={password}
              className="outline-none w-full py-1 px-3"
              placeholder="password"
              // ab jo bhi yaha pe hoga vo passRef me jaaega
              ref={passRef}
              readOnly
            />
            <button
              className="outline-nonde bg-blue-700 text-white px-3 py-0.5 shrink-0 hover:bg-blue-600 active:bg-blue-800"
              onClick={copyPasswordToClipboard}
            >
              copy
            </button>
          </div>
          <div className="flex items-center gap-x-2 py-3">
            <input
              type="range"
              min={6}
              max={50}
              value={length}
              className="cursor-pointer"
              onChange={(e) => {
                setLength(e.target.value);
              }}
            />
            <label>Length : {length}</label>
            <div className="flex items-center gap-x-1">
              <input
                type="checkbox"
                defaultChecked={numAllowed}
                id="numberInput"
                onChange={() => {
                  setNumAllowed((prev) => !prev);
                }}
              />
              <label htmlFor="numberInput">Numbers</label>
            </div>
            <div className="flex items-center gap-x-1">
              <input
                type="checkbox"
                defaultChecked={charAllowed}
                id="charInput"
                onChange={() => {
                  setCharAllowed((prev) => !prev);
                }}
              />
              <label htmlFor="charInput">Characters</label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
