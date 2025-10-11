"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Thermometer, Shield, TrendingUp } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  // Auto-redirect to dashboard (bypassing auth for now)
  useEffect(() => {
    // TODO: Add authentication check here
    // For now, auto-redirect after a brief moment
    const timer = setTimeout(() => {
      // router.push('/home');
    }, 100);

    return () => clearTimeout(timer);
  }, [router]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Thermometer className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            ColdChain Monitor
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Real-time IoT monitoring for cold storage facilities
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => router.push('/home')}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-lg"
            >
              Enter Dashboard
            </button>
            <button
              onClick={() => router.push('/login')}
              className="px-8 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg font-semibold transition-colors"
            >
              Login
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
              <Thermometer className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Real-time Monitoring
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track temperature, humidity, and door events in real-time from Arduino sensors
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Instant Alerts
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Receive critical alerts when temperature or humidity exceeds thresholds
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Analytics Dashboard
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Visualize trends and analyze historical data with interactive charts
            </p>
          </div>
        </div>

        {/* Redirecting message */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    </div>
  );
}
