// components/Sidebar.js

import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4 space-y-4">
      <h2 className="text-xl font-bold mb-4">Navigation</h2>
      <nav className="flex flex-col space-y-2">
        <Link href="/" className="hover:text-blue-400">Home</Link>
        <Link href="/test" className="hover:text-blue-400">Test Page</Link> {/* 👈 Add this */}
        <Link href="/queens" className="hover:text-blue-400">8 Queens</Link>
        {/* Add more links as needed */}
      </nav>
    </aside>
  );
}
