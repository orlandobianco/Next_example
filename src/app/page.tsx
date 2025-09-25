import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getStats() {
  const [userCount, postCount, recentPosts] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.post.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { name: true, email: true }
        }
      }
    })
  ]);

  return { userCount, postCount, recentPosts };
}

export default async function Home() {
  const { userCount, postCount, recentPosts } = await getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Next.js 15 Full-Stack Demo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Powered by Prisma, SQLite, and Tailwind CSS
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">{userCount}</h3>
            <p className="text-gray-600 dark:text-gray-300">Users</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">{postCount}</h3>
            <p className="text-gray-600 dark:text-gray-300">Posts</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">API</h3>
            <p className="text-gray-600 dark:text-gray-300">Ready</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Recent Posts
            </h2>
            {recentPosts.length > 0 ? (
              <div className="space-y-3">
                {recentPosts.map((post) => (
                  <div key={post.id} className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">{post.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      by {post.author.name || post.author.email}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No posts yet</p>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="space-y-4">
              <Link
                href="/users"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Manage Users
              </Link>
              <Link
                href="/posts"
                className="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Manage Posts
              </Link>
              <Link
                href="/api/users"
                className="block w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                View Users API
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Features Demonstrated
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">Server Components</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">API Routes</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">Prisma ORM</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">SQLite Database</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">Tailwind CSS</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">TypeScript</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
