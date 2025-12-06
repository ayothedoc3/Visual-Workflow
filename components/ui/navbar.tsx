'use client';

import Link from 'next/link';
import { Home, Workflow, Library } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Workflow className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-semibold text-gray-900">
                E8Matrix Visual workflow
              </span>
            </Link>

            <div className="flex items-center gap-1">
              <Link
                href="/"
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  pathname === '/'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Home className="w-4 h-4" />
                <span className="text-sm font-medium">Home</span>
              </Link>

              <Link
                href="/workflows"
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  isActive('/workflows')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Workflow className="w-4 h-4" />
                <span className="text-sm font-medium">Workflows</span>
              </Link>

              <Link
                href="/templates"
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  isActive('/templates')
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Library className="w-4 h-4" />
                <span className="text-sm font-medium">Templates</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
