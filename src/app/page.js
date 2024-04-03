"use client";

import AuthService from "@/auth/AuthService";
import { UserContext } from "@/contexts/UserContext";
import Image from "next/image";
import { useState, useEffect, useContext } from "react";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}books`;

export default function Home() {
  const { user, getCurrentUserOrders, updateUserPoints } =
    useContext(UserContext);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}?page=${page}&limit=10`);
      const rawData = await response.json();
      const data = rawData;
      if (data.length === 0) {
        setHasMore(false);
      }
      if (user) {
        const listOrders = await getCurrentUserOrders();
        const userOrders = listOrders.map((order) => order.book_id);
        const updatedBooks = data.map((book) => ({
          ...book,
          isOrdered: userOrders.includes(book.id),
        }));
        setBooks([...books, ...updatedBooks]);
      } else {
        setBooks([...books, ...data]);
      }
      setLoading(false);
      setPage(page + 1);
    } catch (error) {
      setError(`Error getting book list: ${error}`);
    }
  };

  const handleScroll = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
    if (scrollPercent > 80 && !loading && hasMore) {
      fetchData();
      setLoading(true);
    }
  };

  const handleBuy = async (bookId, points) => {
    try {
      await AuthService.buyBook(user, bookId, points);
      setBooks((prevBooks) => {
        return prevBooks.map((book) => {
          if (book.id === bookId) {
            return { ...book, isOrdered: true };
          }
          return book;
        });
      });

      updateUserPoints(points);
    } catch (error) {
      setError(`Failed to buy book: ${error}`);
    }
  };

  const handleCancel = async (bookId, points) => {
    try {
      const result = await AuthService.cancelOrder(user, bookId);
      if (result < 0) {
        throw new Error("Failed canceling the order");
      }
      setBooks((prevBooks) => {
        return prevBooks.map((book) => {
          if (book.id === bookId) {
            return { ...book, isOrdered: false };
          }
          return book;
        });
      });

      updateUserPoints(points);
    } catch (error) {
      setError(`Error canceling order: ${error}`);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, hasMore]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Prima Bookstore</h1>
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {books.map((book, index) => (
            <div
              key={index}
              className="flex flex-col justify-start items-center p-4 bg-white shadow-md rounded-lg overflow-hidden"
            >
              <Image
                className="w-full h-48 object-cover max-w-72 max-h-72"
                src={book.cover_image}
                alt={book.title}
                width={500}
                height={500}
                style={{
                  width: "100%",
                  height: "auto",
                }}
                objectFit="cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{book.title}</h2>
                <p className="text-gray-600">{book.author}</p>
                <p className="text-gray-800 font-bold">{book.point} points</p>
                <p className="text-gray-600">{book.tags.join(", ")}</p>
                {book.isOrdered ? (
                  <button
                    onClick={() => handleCancel(book.id, book.point)}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    onClick={() => handleBuy(book.id, book.point)}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
                  >
                    Buy
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        {loading && <p className="text-center mt-8">Loading...</p>}
      </div>
    </main>
  );
}
