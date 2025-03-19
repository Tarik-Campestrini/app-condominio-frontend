/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import NavAdmin from "@/components/ui/navAdmin";

const Home = () => {

  return (
    <div className="flex flex-col min-h-screen">
      <NavAdmin />
      <main className="flex-grow flex flex-col items-center justify-center bg-gray-100 p-6">
        <h1>Essa é a Pagina Home</h1>
      </main>
    </div>
  );
};

export default Home;
