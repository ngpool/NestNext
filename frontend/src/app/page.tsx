import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <header className="mb-16">
          <h1 className="text-5xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-4">
            Welcome to NestNext
          </h1>
          <p className="text-xl text-center text-gray-600 dark:text-gray-300">
            A modern full-stack application built with Next.js and Nest.js
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link href="/reversi" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-indigo-100 dark:bg-indigo-900 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">⚫⚪</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                Reversi Game
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Play the classic board game with a modern twist
              </p>
            </div>
          </Link>

          <Link href="/sort-demo" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-purple-100 dark:bg-purple-900 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">📊</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                Sort Demo
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Visualize different sorting algorithms in action
              </p>
            </div>
          </Link>

          <Link href="/test" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-pink-100 dark:bg-pink-900 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">🧪</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-pink-600 dark:group-hover:text-pink-400">
                Test Page
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Explore various features and components
              </p>
            </div>
          </Link>
        </div>

        <footer className="mt-16 text-center text-gray-600 dark:text-gray-400">
          <p>© 2024 NestNext. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
