import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="bg-white rounded-xl shadow-lg p-10 max-w-md mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">
          Welcome to the Quiz Management Platform
        </h1>
        <p className="mb-8 text-gray-600">
          Please select your role to continue:
        </p>
        <div className="space-y-3">
          <Link href="/admin">
            <button className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition">
              Login as Admin
            </button>
          </Link>
          <Link href="/teacher">
            <button className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
              Login as Teacher
            </button>
          </Link>
          <Link href="/student">
            <button className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition">
              Login as Student
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
