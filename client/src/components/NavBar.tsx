import { useState, useEffect, useContext, useMemo } from "react";
import { FiMenu, FiX, FiBell } from "react-icons/fi";
import { Link, useFetcher } from "react-router-dom";
import defaultAvatar from "../assets/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg";
import { AuthContext } from "../context/AuthContext.js";

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);
  const { currentUser, updateUser } = useContext(AuthContext);
const firstLetter = currentUser?.username?.charAt(0);
console.log("firstLetter of the user",firstLetter);
  const toggleMobileMenu = useMemo(
    () => () => {
      setIsMobileMenuOpen((prev) => !prev);
    },
    []
  );

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    updateUser(currentUser);
  }, [currentUser]);

  const userAvatar = currentUser?.avatar || firstLetter;
  const userName = currentUser?.username || firstLetter;

  return (
    <>
      <nav className="flex items-center justify-between mx-auto max-w-[1400px] py-6 px-6 sticky top-0 z-50 bg-transparent">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-900 font-bold text-xl">
              B
            </div>
            <span className="text-xl font-bold text-white">
              BrookRealEstate
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-white font-medium hover:text-green-200 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-white font-medium hover:text-green-200 transition-colors"
          >
            About
          </Link>
          <Link
            to="/agents"
            className="text-white font-medium hover:text-green-200 transition-colors"
          >
            Agents
          </Link>
          <Link
            to="/contact"
            className="text-white font-medium hover:text-green-200 transition-colors"
          >
            Contact
          </Link>
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-6">
              <div className="relative">
                <FiBell className="text-white w-6 h-6 cursor-pointer hover:text-green-200" />
                {hasNotifications && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full"></span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Link to="/profile">
                    <div className="rounded-full w-10 h-10 overflow-hidden border-2 border-white shadow-md">
                      <img
                        src={userAvatar}
                        alt={firstLetter}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <span className="text-white hover:underline flex flex-col">
                      {userName}
                    </span>
                  </Link>
                  {hasNotifications && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full"></span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-white font-medium hover:text-green-200 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2 text-green-950 bg-white rounded-md font-medium hover:bg-green-100 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </nav>

      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMobileMenu}
      ></div>

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-end mb-8">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700"
              aria-label="Close menu"
            >
              <FiX size={24} />
            </button>
          </div>

          <div className="flex flex-col gap-6 mb-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 text-lg font-medium py-2 transition-colors"
              onClick={toggleMobileMenu}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-blue-600 text-lg font-medium py-2 transition-colors"
              onClick={toggleMobileMenu}
            >
              About
            </Link>
            <Link
              to="/agents"
              className="text-gray-700 hover:text-blue-600 text-lg font-medium py-2 transition-colors"
              onClick={toggleMobileMenu}
            >
              Agents
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-blue-600 text-lg font-medium py-2 transition-colors"
              onClick={toggleMobileMenu}
            >
              Contact
            </Link>
          </div>

          {currentUser ? (
            <div className="mt-auto flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="rounded-full w-14 h-14 overflow-hidden border-2 border-gray-200 shadow-md">
                    <img
                      src={userAvatar}
                      alt="User avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {hasNotifications && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full">
                      {hasNotifications}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{userName}</span>
                  <Link
                    to="/profile"
                    className="text-green-600 text-sm hover:underline"
                    onClick={toggleMobileMenu}
                  >
                    View Profile
                  </Link>
                </div>
              </div>
              <button className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 font-medium transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <div className="mt-auto flex flex-col gap-3 pt-8">
              <Link
                to="/login"
                className="px-4 py-3 text-center text-gray-700 hover:text-blue-600 font-medium transition-colors border border-gray-200 rounded-md"
                onClick={toggleMobileMenu}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-center transition-colors"
                onClick={toggleMobileMenu}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NavBar;
