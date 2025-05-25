import { Link } from "react-router-dom";

const NotFound = () => {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300">
        <div className="text-center">
          <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 mb-4">
            404
          </h1>
          <div className="w-24 h-1 mx-auto bg-gradient-to-r from-purple-600 to-blue-500 rounded-full mb-6"></div>
          <p className="text-2xl font-semibold text-gray-700 mb-6">
            Oops! Page Not Found
          </p>
          <p className="text-gray-500 mb-8">
            The page you're looking for doesn't seem to exist
          </p>
          <Link to="/">
            <a
              href="/"
              className="inline-block px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-500 rounded-full hover:opacity-90 transition-opacity duration-300 shadow-lg hover:shadow-xl"
            >
              Return to Home
            </a>
          </Link>
           
        </div>
      </div>
    </div>
  );
};

export default NotFound;
