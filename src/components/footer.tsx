'use client';

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-teal-600 via-indigo-800 to-purple-700 text-white py-3 px-4 mt-10 shadow-inner">
      <div className="max-w-7xl mx-auto text-center space-y-2">
        <p className="text-sm sm:text-base font-medium">
          &copy; {new Date().getFullYear()}{' '}
          <span className="text-amber-300 font-bold">HisabKitab System</span> | All rights reserved.
        </p>
        <p className="text-sm text-gray-200">
          Developed by{' '}
          <span className="text-white font-semibold hover:text-amber-300 transition duration-300 cursor-pointer">
            MAK
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
