import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getUsers() {
  return await prisma.user.findMany({
    include: {
      posts: true,
      _count: {
        select: { posts: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Users</h1>
          <div className="space-x-4">
            <Link
              href="/"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/users/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Add User
            </Link>
          </div>
        </div>

        {users.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No users found</p>
            <Link
              href="/users/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Create your first user
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div key={user.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {user.name || 'Anonymous'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
                  </div>
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs">
                    {user._count.posts} posts
                  </span>
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </div>

                {user.posts.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Recent Posts:
                    </h4>
                    <div className="space-y-1">
                      {user.posts.slice(0, 2).map((post) => (
                        <div key={post.id} className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          • {post.title}
                        </div>
                      ))}
                      {user.posts.length > 2 && (
                        <div className="text-sm text-gray-500 dark:text-gray-500">
                          +{user.posts.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Link
                    href={`/users/${user.id}`}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-2 rounded text-center text-sm transition-colors"
                  >
                    View
                  </Link>
                  <Link
                    href={`/users/${user.id}/edit`}
                    className="flex-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 px-3 py-2 rounded text-center text-sm transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}