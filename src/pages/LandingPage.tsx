/**
 * Landing Page for PolyRumble
 * Entry point for the application with hero section and CTAs
 */

import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo/Title */}
          <h1 className="text-6xl md:text-7xl font-bold mb-6 comic-font text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            PolyRumble
          </h1>

          {/* Tagline */}
          <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            💥 Watch Traders Battle. Bet on Winners. 🥊
          </p>

          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Compare Polymarket traders side-by-side, analyze their performance,
            and bet on who will have better ROI. All powered by real-time data and SOL.
          </p>

          {/* CTA Buttons */}
          <div className="flex justify-center items-center mb-16">
            <Link
              to="/arenas"
              className="w-full sm:w-auto comic-button bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-12 py-5 text-2xl shadow-brutal-lg transform hover:scale-105 transition-all"
            >
              🎯 Browse Arenas
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg p-6 shadow-brutal border-4 border-black">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-bold mb-2 comic-font">Real-Time Charts</h3>
            <p className="text-gray-600 body-font">
              Live P&L comparison with beautiful charts showing trader performance
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-lg p-6 shadow-brutal border-4 border-black">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold mb-2 comic-font">SOL Betting</h3>
            <p className="text-gray-600 body-font">
              Bet on which trader will perform better using Solana (SOL)
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-lg p-6 shadow-brutal border-4 border-black">
            <div className="text-4xl mb-4">🔴</div>
            <h3 className="text-xl font-bold mb-2 comic-font">Live Updates</h3>
            <p className="text-gray-600 body-font">
              WebSocket-powered real-time updates for pools and trader data
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-lg p-6 shadow-brutal border-4 border-black">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold mb-2 comic-font">Social Sharing</h3>
            <p className="text-gray-600 body-font">
              Share rumbles on Twitter and create rumbles via Telegram bot
            </p>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 comic-font text-gray-800">
            How It Works
          </h2>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-brutal">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Browse Active Arenas</h3>
                <p className="text-gray-600">
                  Check out active trading competitions between top Polymarket traders
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-brutal">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Analyze Trader Performance</h3>
                <p className="text-gray-600">
                  View detailed charts, metrics, and positions for each trader
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-pink-500 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-brutal">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Place Your Bet</h3>
                <p className="text-gray-600">
                  Connect your Solana wallet and bet on which trader will outperform
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-brutal">
                4
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Win & Claim Rewards</h3>
                <p className="text-gray-600">
                  If your trader wins, claim your share of the prize pool!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="mt-24 text-center bg-white border-4 border-black rounded-lg p-12 shadow-brutal-xl">
          <h2 className="text-4xl font-bold mb-4 comic-font text-gray-800">
            Ready to Rumble?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join the most exciting prediction market competition platform
          </p>
          <Link
            to="/arenas"
            className="inline-block comic-button bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-12 py-4 text-2xl shadow-brutal-lg transform hover:scale-105 transition-all"
          >
            Get Started →
          </Link>
        </div>
      </div>
    </div>
  );
}
