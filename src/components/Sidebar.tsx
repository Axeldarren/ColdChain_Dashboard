"use client";

import { useAppDispatch, useAppSelector } from '@/app/redux';
import { setIsSidebarCollapsed } from '@/state';
import { 
  AlertCircle, 
  AlertTriangle, 
  BarChartHorizontal, 
  ChevronDown, 
  ChevronUp, 
  HomeIcon, 
  ShieldAlert, 
  X,
  Thermometer,
  Droplets,
  DoorOpen,
  MapPin,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

const Sidebar = () => {
    const [showLocations, setShowLocations] = useState(true);
    const [showMonitoring, setShowMonitoring] = useState(true);
    
    const dispatch = useAppDispatch();
    const isSidebarCollapsed = useAppSelector(
        (state) => state.global.isSidebarCollapsed,
    );

    const sidebarClassNames = `fixed left-0 top-0 flex flex-col h-screen justify-between
        transition-all duration-300 ease-in-out z-40 bg-white dark:bg-gray-900 
        border-r border-gray-200 dark:border-gray-700 overflow-y-auto shadow-sm dark:shadow-none
        ${isSidebarCollapsed ? 'w-0' : 'w-64'}
    `;

    return (
        <div className={sidebarClassNames}>
            <div className='flex h-full w-64 flex-col justify-start'>
                {/* Header */}
                <div className='z-50 flex min-h-[56px] w-64 items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-700'>
                    <div className='flex items-center gap-3'>
                        <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm'>
                            <Thermometer className='w-5 h-5 text-white' />
                        </div>
                        <div className='text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100'>
                            ColdChain
                        </div>
                    </div>
                    <button 
                        className='p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors' 
                        onClick={() => dispatch(setIsSidebarCollapsed(true))}
                    >
                        <X className='h-5 w-5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100' />
                    </button>
                </div>

                {/* System Status */}
                <div className='px-5 py-4 border-b border-gray-200 dark:border-gray-700'>
                    <div className='flex items-center gap-2 mb-2'>
                        <div className='w-2 h-2 rounded-full bg-green-500 animate-pulse'></div>
                        <span className='text-xs font-medium text-gray-700 dark:text-gray-300'>System Online</span>
                    </div>
                    <div className='text-xs text-gray-500 dark:text-gray-400'>
                        4 Active Devices
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className='z-10 w-full'>
                    <SidebarLink icon={HomeIcon} label='Dashboard' href='/home' />
                    <SidebarLink icon={Activity} label='Real-time Monitor' href='/monitor' />
                    <SidebarLink icon={BarChartHorizontal} label='Analytics' href='/analytics' />
                    <SidebarLink icon={AlertTriangle} label='Alerts' href='/alerts' />
                </nav>

                {/* Locations Section */}
                <button 
                    onClick={() => setShowLocations((prev) => !prev)} 
                    className='flex w-full items-center justify-between px-5 py-2.5 text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors'
                >
                    <span className='text-sm font-medium'>Locations</span>
                    {showLocations ? (
                        <ChevronUp className='h-4 w-4' />
                    ) : (
                        <ChevronDown className='h-4 w-4' />
                    )}
                </button>
                {showLocations && (
                    <div className="space-y-0.5">
                        <SidebarLink icon={MapPin} label='Warehouse North' href='/location/warehouse-north' />
                        <SidebarLink icon={MapPin} label='Warehouse South' href='/location/warehouse-south' />
                        <SidebarLink icon={MapPin} label='Storage Area' href='/location/storage' />
                    </div>
                )}

                {/* Monitoring Parameters */}
                <button 
                    onClick={() => setShowMonitoring((prev) => !prev)} 
                    className='flex w-full items-center justify-between px-5 py-2.5 text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors'
                >
                    <span className='text-sm font-medium'>Parameters</span>
                    {showMonitoring ? (
                        <ChevronUp className='h-4 w-4' />
                    ) : (
                        <ChevronDown className='h-4 w-4' />
                    )}
                </button>
                {showMonitoring && (
                    <>
                        <SidebarLink icon={Thermometer} label='Temperature' href='/parameters/temperature' />
                        <SidebarLink icon={Droplets} label='Humidity' href='/parameters/humidity' />
                        <SidebarLink icon={DoorOpen} label='Door Events' href='/parameters/door-events' />
                    </>
                )}

                {/* Priority Alerts */}
                <div className='px-5 py-2.5 mt-4 border-t border-gray-200 dark:border-gray-700'>
                    <span className='text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'>Alert Levels</span>
                </div>
                <SidebarLink icon={AlertCircle} label='Critical' href='/alert_level/critical' badge={1} badgeColor="red" />
                <SidebarLink icon={ShieldAlert} label='Warning' href='/alert_level/warning' badge={2} badgeColor="orange" />
            </div>
        </div>
    );
};

interface SidebarLinkProps {
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    badge?: number;
    badgeColor?: 'red' | 'orange' | 'blue';
}

const SidebarLink = ({
    href,
    icon: Icon,
    label,
    badge,
    badgeColor = 'blue',
}: SidebarLinkProps) => {
    const pathname = usePathname();
    const isActive = pathname?.startsWith(href);

    const badgeColors = {
        red: 'bg-red-500',
        orange: 'bg-orange-500',
        blue: 'bg-blue-500',
    };

    return (
        <Link href={href} className="w-full">
            <div 
                className={`relative flex cursor-pointer items-center gap-3 transition-colors ${
                    isActive 
                        ? href.includes('critical') 
                            ? "bg-rose-500/15 text-rose-200" 
                            : href.includes('warning')
                            ? "bg-amber-500/15 text-amber-200"
                            : "bg-gray-50 dark:bg-white/5"
                        : "hover:bg-gray-50 dark:hover:bg-white/5"
                } justify-between px-6 py-2.5`}
            >
                <div className='flex items-center gap-3'>
                    <Icon className={`h-5 w-5 flex-shrink-0 ${
                        isActive 
                            ? 'text-blue-600 dark:text-blue-400' 
                            : 'text-gray-600 dark:text-gray-300'
                    }`} />
                    <span className={`text-sm font-medium truncate ${
                        isActive 
                            ? 'text-blue-700 dark:text-blue-300' 
                            : 'text-gray-700 dark:text-gray-200'
                    }`}>
                        {label}
                    </span>
                </div>
                {badge !== undefined && badge > 0 && (
                    <span className={`${badgeColors[badgeColor]} text-white text-xs font-bold px-2 py-0.5 rounded-full`}>
                        {badge}
                    </span>
                )}
            </div>
        </Link>
    );
};

export default Sidebar;
