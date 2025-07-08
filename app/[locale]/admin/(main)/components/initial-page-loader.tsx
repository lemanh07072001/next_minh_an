"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InitialPageLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Thời gian loading 1s

    return () => clearTimeout(timer);
  }, []); // [] => chỉ chạy 1 lần khi mount (F5)

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center">
            {/* Geometric Loading Animation */}
            <div className="relative w-20 h-20 mx-auto mb-6">
              {/* Outer Square */}
              <motion.div
                className="absolute inset-0 border-2 border-gray-700 rounded-sm"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />

              {/* Inner Square */}
              <motion.div
                className="absolute inset-2 border border-gray-500 rounded-sm"
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />

              {/* Center Dot */}
              <motion.div
                className="absolute top-1/2 left-1/2 w-2 h-2 bg-gray-800 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>

            {/* Loading Text with Bounce Dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center justify-center space-x-2"
            >
              <h2 className="text-sm font-mono tracking-widest text-gray-800">
                LOADING
              </h2>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
