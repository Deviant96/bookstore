const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

const AuthService = {
  login: async (username, password) => {
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
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  },

  buyBook: async (user, bookId, pointsSpent) => {
    const currentUser = user;
    if (!currentUser) {
      throw new Error("User not logged in");
    }

    const userId = currentUser.id;
    pointsSpent = Math.trunc(pointsSpent);

    const response = await fetch(`${API_URL}order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, bookId, pointsSpent }),
    });

    if (!response.ok) {
      throw new Error("Book purchase failed");
    }

    return await response.json();
  },

  cancelOrder: async (user, bookId) => {
    const currentUser = user;
    if (!currentUser) {
      throw new Error("User not logged in");
    }

    const userId = currentUser.id;

    const response = await fetch(`${API_URL}cancelorder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, bookId }),
    });

    if (!response.ok) {
      throw new Error("Order cancellation failed");
    }

    return await response.json();
  },
};

export default AuthService;
