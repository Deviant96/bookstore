"use client";

import React, { useContext, useEffect, useState } from "react";
import AuthService from "@/auth/AuthService";
import Link from "next/link";
import { UserContext } from "@/contexts/UserContext";

const NavBar = () => {
  const { user } = useContext(UserContext);
  const [points, setPoints] = useState(null);

  useEffect(() => {
    if (user) {
      setPoints(user.points);
    }
  }, [user]);

  const handleLogout = () => {
    AuthService.logout();
    window.location.href = "/";
  };

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="text-white">
                Prima Bookstore
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/books"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Books
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user ? (
                <div className="flex items-center">
                  <span className="text-white mr-2">
                    Welcome, {user.username}!
                  </span>
                  <span className="text-white mr-2">Points: {points}</span>
                  <button
                    onClick={handleLogout}
                    className="text-white hover:text-gray-300"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div>
                  <Link
                    href="/user/login"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/user/register"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
