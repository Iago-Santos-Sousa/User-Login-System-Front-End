import React from "react";
import { useLogin } from "../context/AppProvider";
import userLogo from "../assets/user-check-icon.svg";
import { useNavigate, NavigateFunction, Link } from "react-router-dom";

const Header = () => {
  const signOut = useLogin()!.signOut;
  const navigate: NavigateFunction = useNavigate();

  return (
    <div className="w-full bg-prymaryBlue py-4 flex justify-between items-center px-8">
      <div className="logo-img w-[80px] h-[80px]">
        <img src={userLogo} alt="user-logo" className="w-full h-full" />
      </div>

      <nav className="navbar">
        <div>
          <ul className="flex gap-6 text-white">
            <li className="">
              <a href="">Home</a>
            </li>
            <li className="">
              <a href="">Details</a>
            </li>
            <li
              className=""
              onClick={() => {
                signOut();
                navigate("/", { replace: true });
              }}
            >
              <a href="">Log out</a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Header;
