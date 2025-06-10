"use client";
import { useState } from 'react';
import { 
  MdHome, 
  MdPlayCircle, 
  MdInsights, 
  MdSettings, 
  MdHelp 
} from 'react-icons/md';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  return (
    <div 
      className={`h-[95vh] bg-white text-gray-700 p-4 w-20 relative z-50 rounded-r-3xl my-4 ml-2 shadow-lg transform origin-left transition-all duration-200 ease-in-out ${isExpanded ? 'w-64' : ''}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div 
        className="cursor-pointer p-3 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-4"
        onClick={() => router.push('/')}
      >
        <MdHome className="min-w-6 text-2xl" />
        {isExpanded && <span className={`whitespace-nowrap transition-opacity delay-100 duration-100 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>Home</span>}
      </div>

      <nav className="mt-8">
        <ul className="space-y-2">
          <li>
            <div className="cursor-pointer p-3 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-4" onClick={() => router.push('/simulations')}>
              <MdPlayCircle className="min-w-6 text-2xl" />
              {isExpanded && <span className={`whitespace-nowrap transition-opacity delay-100 duration-100 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>Simulations</span>}
            </div>
          </li>
          <li>
            <div className="cursor-pointer p-3 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-4" onClick={() => router.push('/analytics')}>
              <MdInsights className="min-w-6 text-2xl" />
              {isExpanded && <span className={`whitespace-nowrap transition-opacity delay-100 duration-100 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>Analytics</span>}
            </div>
          </li>
          <li>
            <div className="cursor-pointer p-3 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-4" onClick={() => router.push('/settings')}>
              <MdSettings className="min-w-6 text-2xl" />
              {isExpanded && <span className={`whitespace-nowrap transition-opacity delay-100 duration-100 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>Settings</span>}
            </div>
          </li>
          <li>
            <div className="cursor-pointer p-3 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-4" onClick={() => router.push('/help')}>
              <MdHelp className="min-w-6 text-2xl" />
              {isExpanded && <span className={`whitespace-nowrap transition-opacity delay-100 duration-100 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>Help</span>}
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}