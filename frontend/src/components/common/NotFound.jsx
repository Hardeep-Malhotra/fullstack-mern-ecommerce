import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] text-center px-4 overflow-hidden bg-gradient-to-br from-orange-50 via-white to-slate-50">

      {/* Background blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-orange-100 rounded-full blur-3xl opacity-70"></div>
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-amber-100 rounded-full blur-3xl opacity-70"></div>

      <div className="relative animate-[fadeUp_0.6s_ease-out]">

        {/* Icon badge */}
        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-4xl shadow-lg shadow-orange-200 mb-6 animate-[float_3s_ease-in-out_infinite]">
          🛍️
        </div>

        {/* 404 */}
        <h1 className="text-7xl sm:text-8xl font-black bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent leading-none animate-[popIn_0.6s_ease-out_0.1s_backwards]">
          404
        </h1>

        <p className="text-2xl font-bold text-slate-800 mt-4 animate-[fadeUp_0.5s_ease-out_0.2s_backwards]">
          Oops! Page Not Found
        </p>

        <p className="text-slate-500 mt-2 max-w-sm mx-auto animate-[fadeUp_0.5s_ease-out_0.3s_backwards]">
          Jis page ko aap dhoondh rahe hain wo exist nahi karta ya move ho chuka hai.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 animate-[fadeUp_0.5s_ease-out_0.4s_backwards]">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-7 py-3.5 rounded-xl font-bold shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            ← Go Back Home
          </Link>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 border border-slate-300 hover:border-orange-400 hover:text-orange-500 bg-white px-7 py-3.5 rounded-xl font-bold transition-all duration-200"
          >
            Browse Products
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.7); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

export default NotFound;