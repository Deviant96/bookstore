'use client'

import Image from "next/image";
import { useState, useEffect } from 'react';

const API_URL = 'http://openlibrary.org/search.json?q=the+lord+of+the+rings&limit=10';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}?page=${page}`);
        const rawData = await response.json();
        const data = rawData.docs;
        console.log(data)
        if (data.length === 0) {
          setHasMore(false);
        }
        setBooks([...books, ...data]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleScroll = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
    if (scrollPercent > 80 && !loading && hasMore) {
      setPage(page + 1);
      setLoading(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, hasMore]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Prima Bookstore</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {books.map((book) => (
            <div key={book.id} className="flex flex-col justify-start items-center p-4 bg-white shadow-md rounded-lg overflow-hidden">
              <Image 
                className="w-full h-48 object-cover max-w-72 max-h-72" 
                src={`https://covers.openlibrary.org/a/id/${book.cover_i}.jpg`} 
                alt={book.title}
                width={500}
                height={500}
                style={{
                  width: '100%',
                  height: 'auto',
                }}
                objectFit="cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{book.title}</h2>
                <p className="text-gray-600">{book.author_name?.join(', ')}</p>
                <p className="text-gray-800 font-bold">${book.last_modified_i}</p>
                {/* <p className="text-gray-600">{book.tag.join(', ')}</p> */}
              </div>
            </div>
          ))}
        </div>
        {loading && <p className="text-center mt-8">Loading...</p>}
      </div>
    </main>
  );
}
