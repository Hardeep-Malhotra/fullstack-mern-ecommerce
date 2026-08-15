import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-6xl font-extrabold text-indigo-600">404</h1>
      <p className="text-2xl font-semibold text-gray-800 mt-2">Page Not Found</p>
      <p className="text-gray-500 mt-1">Jis page ko aap dhoondh rahe hain wo exist nahi karta.</p>
      <Link
        to="/"
        className="mt-6 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;