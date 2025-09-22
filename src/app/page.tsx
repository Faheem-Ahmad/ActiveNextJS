"use client";

import { useState, useEffect, useCallback } from "react";

interface DiagnosticInfo {
  timestamp: string;
  userAgent?: string;
  url?: string;
  clientside: {
    windowExists: boolean;
    documentExists: boolean;
    navigatorExists: boolean;
    location?: string;
    userAgent?: string;
  };
  serverResponse?: Record<string, unknown>;
  errors: string[];
}

export default function Home() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticInfo>({
    timestamp: new Date().toISOString(),
    clientside: {
      windowExists: false,
      documentExists: false,
      navigatorExists: false,
    },
    errors: [],
  });
  const [serverData, setServerData] = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    console.log(logEntry);
    setLogs((prev) => [...prev, logEntry]);
  }, []);

  const fetchServerDiagnostics = useCallback(async () => {
    addLog("🌐 Starting server diagnostics fetch...");
    setLoading(true);

    try {
      addLog("📡 Making fetch request to /api/diagnostics");
      const response = await fetch("/api/diagnostics");

      addLog(`📊 Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      addLog("✅ Server response received successfully");

      setServerData(JSON.stringify(data, null, 2));
      setDiagnostics((prev) => ({
        ...prev,
        serverResponse: data,
      }));
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      addLog(`❌ Server fetch error: ${errorMsg}`);
      setServerData(`Error fetching server diagnostics: ${errorMsg}`);
      setDiagnostics((prev) => ({
        ...prev,
        errors: [...prev.errors, `Server fetch error: ${errorMsg}`],
      }));
    } finally {
      setLoading(false);
      addLog("🏁 Server diagnostics fetch completed");
    }
  }, [addLog]);

  useEffect(() => {
    addLog("🚀 React useEffect started - Component mounted");

    try {
      const clientDiag = {
        windowExists: typeof window !== "undefined",
        documentExists: typeof document !== "undefined",
        navigatorExists: typeof navigator !== "undefined",
        location: typeof window !== "undefined" ? window.location.href : "N/A",
        userAgent:
          typeof navigator !== "undefined" ? navigator.userAgent : "N/A",
      };

      addLog(`📱 Client Environment Check:`);
      addLog(`  - Window exists: ${clientDiag.windowExists}`);
      addLog(`  - Document exists: ${clientDiag.documentExists}`);
      addLog(`  - Navigator exists: ${clientDiag.navigatorExists}`);
      addLog(`  - Location: ${clientDiag.location}`);

      setDiagnostics((prev) => ({
        ...prev,
        clientside: clientDiag,
      }));

      addLog("✅ Client-side diagnostics completed");
      fetchServerDiagnostics();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      addLog(`❌ Error in useEffect: ${errorMsg}`);
      setDiagnostics((prev) => ({
        ...prev,
        errors: [...prev.errors, `useEffect error: ${errorMsg}`],
      }));
    }
  }, [addLog, fetchServerDiagnostics]);

  const allLogs =
    logs.join("\n") +
    "\n\n" +
    "=== DIAGNOSTIC SUMMARY ===\n" +
    JSON.stringify(diagnostics, null, 2) +
    "\n\n" +
    "=== SERVER RESPONSE ===\n" +
    serverData;

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-red-800 mb-2">
            🔍 Next.js Azure Diagnostics Dashboard
          </h1>
          <p className="text-lg text-red-600">
            Comprehensive Application Runtime Analysis
          </p>
          <p className="text-sm text-gray-600">
            Page loaded at: {diagnostics.timestamp}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="font-bold text-gray-800">Client Status</h3>
            <p
              className={`text-sm ${
                diagnostics.clientside.windowExists
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              Window: {diagnostics.clientside.windowExists ? "✅" : "❌"}
            </p>
            <p
              className={`text-sm ${
                diagnostics.clientside.documentExists
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              Document: {diagnostics.clientside.documentExists ? "✅" : "❌"}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="font-bold text-gray-800">Server Status</h3>
            <p
              className={`text-sm ${
                !loading && serverData && !serverData.includes("Error")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              API:{" "}
              {loading
                ? "🔄 Loading..."
                : serverData && !serverData.includes("Error")
                ? "✅ Connected"
                : "❌ Failed"}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="font-bold text-gray-800">Error Count</h3>
            <p
              className={`text-sm ${
                diagnostics.errors.length === 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              Errors: {diagnostics.errors.length}{" "}
              {diagnostics.errors.length === 0 ? "✅" : "❌"}
            </p>
          </div>
        </div>

        <div className="flex gap-4 mb-6 justify-center">
          <button
            onClick={fetchServerDiagnostics}
            disabled={loading}
            className="bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
          >
            {loading ? "🔄 Refreshing..." : "🔄 Refresh Diagnostics"}
          </button>

          <button
            onClick={() => {
              setLogs([]);
              setServerData("");
              addLog("🧹 Logs cleared by user");
            }}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            🧹 Clear Logs
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              📋 Complete Diagnostic Log Output
            </h2>
            <span className="text-sm text-gray-500">
              Logs: {logs.length} entries
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            📝 Copy the content below and share it for diagnosis. This includes
            all client-side, server-side, and runtime information.
          </p>

          <textarea
            value={allLogs}
            readOnly
            placeholder="Diagnostic information will appear here..."
            className="w-full h-96 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-xs bg-gray-50 text-black overflow-auto"
          />

          <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-sm text-yellow-800">
            <p>
              <strong>📋 Instructions:</strong>
            </p>
            <p>1. Wait for all diagnostics to load completely</p>
            <p>2. Copy the entire content from the text area above</p>
            <p>3. Share this information to diagnose Azure deployment issues</p>
            <p>
              4. Check browser console (F12) for additional client-side errors
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
