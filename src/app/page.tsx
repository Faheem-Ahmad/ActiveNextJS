"use client";

import { useState } from "react";

export default function Home() {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const callAPI = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/hello");
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse("Error: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Background: Very light blue gradient. To customize:
       - Change 'from-blue-50' to any blue shade (blue-25, blue-100, etc.)
       - Change 'to-blue-100' for the gradient end color  
       - Use 'bg-blue-50' for solid color instead of gradient
       - Try other colors like 'from-sky-50 to-sky-100' for different blue tones */
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome Home - Again
          </h1>
          <p className="text-lg text-gray-600">Next.js app is ready</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          g
          <div className="flex justify-center mb-6">
            <button
              onClick={callAPI}
              disabled={loading}
              className="bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed text-lg"
            >
              {loading ? "Loading...." : "Call API"}
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Response:
            </label>
            <textarea
              value={response}
              readOnly
              placeholder="Click the button above to call the API..."
              className="w-full h-80 p-6 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-base bg-gray-50 text-black"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
