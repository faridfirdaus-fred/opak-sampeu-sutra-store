"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FaRobot,
  FaTimes,
  FaShoppingCart,
  FaTruck,
  FaBoxOpen,
  FaClipboardList,
} from "react-icons/fa";
import { IoMdSend } from "react-icons/io";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    { type: "bot" | "user"; content: string }[]
  >([
    {
      type: "bot",
      content: "Halo! Saya AI Assistant Opak Sampeu. Ada yang bisa saya bantu?",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (message: string, fromUser: boolean = true) => {
    if (fromUser) {
      setMessages((prev) => [...prev, { type: "user", content: message }]);
    }

    try {
      const response = await fetch("/api/chatbot/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { type: "bot", content: data.reply }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: "Maaf, ada masalah dengan sistem. Silakan coba lagi nanti.",
        },
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage(input);
    setInput("");
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 transition-all duration-300"
          onClick={() => setIsOpen(true)}
        >
          <button className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-[#FF6600] transition-colors">
            <FaRobot className="text-2xl" />
          </button>
        </div>
      )}

      {/* Chat Modal */}
      <div
        className={`fixed bottom-6 right-6 z-50 bg-white rounded-lg shadow-2xl w-[350px] overflow-hidden flex flex-col transform transition-transform duration-300 ${
          isOpen ? "translate-y-0 opacity-100" : "translate-y-[150%] opacity-0"
        }`}
        style={{ height: "550px", maxHeight: "80vh" }}
      >
        {/* Chat Header */}
        <div className="bg-primary text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FaRobot className="text-2xl" />
            <div>
              <div className="font-bold">AI Assistant Opak Sampeu</div>
              <div className="text-xs flex items-center">
                <span className="h-2 w-2 bg-green-400 rounded-full mr-1"></span>
                Online
                <span className="ml-1 opacity-75">
                  • Respon rata-rata: 30 detik
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:text-gray-200"
          >
            <FaTimes />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`my-2 ${
                msg.type === "user" ? "flex justify-end" : "flex justify-start"
              }`}
            >
              {msg.type === "bot" && (
                <div className="mr-2 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                  <FaRobot className="text-sm" />
                </div>
              )}
              <div
                className={`rounded-lg px-4 py-2 max-w-[75%] ${
                  msg.type === "user"
                    ? "bg-blue-100 text-gray-800"
                    : "bg-white text-gray-800 shadow border border-gray-100"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Action Buttons */}
        <div className="px-4 py-2 grid grid-cols-2 gap-2 bg-gray-50">
          {[
            {
              label: "Cek Harga Produk",
              icon: <FaShoppingCart />,
              message: "Cek harga produk",
            },
            {
              label: "Info Pengiriman",
              icon: <FaTruck />,
              message: "Info pengiriman",
            },
            {
              label: "Status Pesanan",
              icon: <FaBoxOpen />,
              message: "Status pesanan",
            },
            {
              label: "Cara Pemesanan",
              icon: <FaClipboardList />,
              message: "Cara pemesanan",
            },
          ].map((btn, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(btn.message)}
              className="flex items-center justify-center gap-2 py-2 px-2 bg-gray-100 hover:bg-gray-200 rounded text-sm text-gray-700"
            >
              {btn.icon} {btn.label}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSubmit}
          className="p-3 border-t flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanyakan seputar produk kami..."
            className="flex-grow px-4 py-2 bg-gray-100 rounded-l-lg border-0 focus:ring-0 focus:outline-none text-sm"
          />
          <button
            type="submit"
            className="bg-primary text-white p-2 rounded-r-lg hover:bg-[#FF6600]"
          >
            <IoMdSend className="text-xl" />
          </button>
        </form>
      </div>
    </>
  );
}
