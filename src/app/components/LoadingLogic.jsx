// LoadingLogic.jsx
"use client";
import { useSelector } from "react-redux";

const LoadingLogic = ({ children }) => {
  const isLoading = useSelector((state) => state.isLoading);
  return isLoading ? children : null;
};

export default LoadingLogic;
