"use client";

import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [points, setPoints] = useState(null);
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setPoints(userData.points);
    }
  }, []);

  const updateUserPoints = (action, price) => {
    let updatedPoints = points;
    if (action === "buy") {
      updatedPoints -= price;
    } else if (action === "cancel") {
      updatedPoints += price;
    }
    setPoints(updatedPoints);
    setUser((prevUser) => ({
      ...prevUser,
      points: updatedPoints,
    }));
  };

  const login = async (username, password) => {
    const response = await fetch(`${API_URL}login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      throw new Error("Login failed");
    }
    const data = await response.json();
    const { id, points } = data;
    const dataCleaned = { id, username, points };

    localStorage.setItem("user", JSON.stringify(dataCleaned));
    return data;
  };

  const register = async (username, password) => {
    const response = await fetch(`${API_URL}register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      throw new Error("Registration failed");
    }
    const data = await response.json();
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const getCurrentUser = async () => {
    if (!user) {
      throw new Error("User not logged in");
    }

    const userId = user.id;

    const response = await fetch(`${API_URL}user/get`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error("Get user data failed");
    }

    return await response.json();
  };

  const getCurrentUserOrders = async () => {
    // const currentUser = getCurrentUser();
    if (!user) {
      throw new Error("User not logged in");
    }

    const userId = user.id;

    const response = await fetch(`${API_URL}listorder?limit=10&offset=0`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error("Order listing failed");
    }

    return await response.json();
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        getCurrentUser,
        getCurrentUserOrders,
        updateUserPoints,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
