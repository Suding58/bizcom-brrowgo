"use client";
import { PulseLoader } from "react-spinners";

const LoadingPage = () => {
  return (
    <div className="absolute right-1/2 bottom-1/2  transform translate-x-1/2 translate-y-1/2 ">
      <PulseLoader color="#0C356A" aria-label="Loading" />
    </div>
  );
};

export default LoadingPage;
