import React from "react";
import * as C from "./style";

const Button = ({ Text, onClick, type = "button" }) => {
  return (
    <C.Button type={type} onClick={onClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
      {Text}
      
    </C.Button>
  );
};

export default Button;