"use client";

import React, { useState } from 'react';
import { Menu, Moon, Search, Bell, Sun } from "lucide-react";
import { useAppDispatch, useAppSelector } from '@/app/redux';
import { setIsDarkMode, setIsSidebarCollapsed } from '@/state';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(state => state.global.isSidebarCollapsed);
  const isDarkMode = useAppSelector(state => state.global.isDarkMode);
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className='flex items-center justify-between bg-white/80 dark:bg-black/60 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 px-4 py-3'>
        {/* Left Section */}
        <div className='flex items-center gap-4'>
            {isSidebarCollapsed && (
                <button 
                    onClick={() => dispatch(setIsSidebarCollapsed(false))}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                    <Menu className='w-5 h-5 text-gray-700 dark:text-gray-200' />
                </button>
            )}
            
            {/* Search Bar */}
            <div className='relative flex h-min w-[320px]'>
                <Search className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500'/>
                <input 
                    className='w-full rounded-lg bg-white dark:bg-white/5 ring-1 ring-gray-200 dark:ring-white/10 shadow-sm py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:text-gray-100 dark:placeholder-gray-500'
                    type="search" 
                    placeholder="Search devices, locations..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </div>
        </div>

        {/* Right Section */}
        <div className='flex items-center gap-3'>
            {/* Current Time */}
            <div className='hidden md:flex flex-col items-end mr-2'>
                <span className='text-xs text-gray-500 dark:text-gray-400'>
                    {new Date().toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric'
                    })}
                </span>
                <span className='text-sm font-medium text-gray-900 dark:text-white'>
                    {new Date().toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit'
                    })}
                </span>
            </div>

            {/* Notifications */}
            <button
              className="relative p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors dark:text-gray-200 dark:hover:bg-white/5"
            >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors dark:text-gray-200 dark:hover:bg-white/5"
            >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-700">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                    AD
                </div>
            </div>
        </div>
    </div>
  );
}

export default Navbar;
