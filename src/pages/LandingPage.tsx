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
            💥 Compare Polymarket Traders. Bet on Winners. 🥊
          </p>

          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            The ultimate Polymarket trader comparison platform. Analyze performance with real-time P&L charts,
            bet on top traders with SOL, and integrate AI agents using the x402 payment protocol for autonomous betting.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
            <Link
              to="/arenas"
              className="w-full sm:w-auto comic-button bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-12 py-5 text-2xl shadow-brutal-lg transform hover:scale-105 transition-all"
            >
              🎯 Browse Arenas
            </Link>
            <a
              href="/x402"
              target="_blank"
              className="w-full sm:w-auto comic-button bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-12 py-5 text-2xl shadow-brutal-lg transform hover:scale-105 transition-all"
            >
              📡 View x402 Spec (JSON)
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg p-6 shadow-brutal border-4 border-black">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-bold mb-2 comic-font">Polymarket Analytics</h3>
            <p className="text-gray-600 body-font">
              Real-time P&L comparison charts for Polymarket traders with live performance data and ROI metrics
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-lg p-6 shadow-brutal border-4 border-black">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold mb-2 comic-font">Solana Betting</h3>
            <p className="text-gray-600 body-font">
              Bet on Polymarket trader performance using SOL cryptocurrency on the Solana blockchain
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-lg p-6 shadow-brutal border-4 border-black">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-2 comic-font">x402 AI Agent API</h3>
            <p className="text-gray-600 body-font">
              Integrate AI agents with x402 payment protocol for autonomous Polymarket betting and trading
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-lg p-6 shadow-brutal border-4 border-black">
            <div className="text-4xl mb-4">🔴</div>
            <h3 className="text-xl font-bold mb-2 comic-font">Live Updates</h3>
            <p className="text-gray-600 body-font">
              WebSocket-powered real-time updates for betting pools and Polymarket trader data
            </p>
          </div>
        </div>

        {/* AI Integration Section */}
        <div className="mt-24 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border-4 border-black rounded-lg p-8 shadow-brutal-xl">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="text-6xl">🤖</div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-3xl font-bold mb-3 comic-font text-gray-800">
                  AI Agent Integration (x402) <span className="text-lg text-gray-500">(coming soon)</span>
                </h3>
                <p className="text-gray-600 body-font mb-4">
                  Integrate PolyRumble with your AI agents using the standard x402 payment protocol.
                  Pay-per-use API access powered by PayAI on Solana.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <a
                    href="/x402"
                    target="_blank"
                    className="comic-button bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 text-lg"
                  >
                    📡 View x402 Spec (JSON)
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded border-2 border-black p-4">
                <div className="font-bold text-blue-600 mb-1">Standard Protocol</div>
                <div className="text-sm text-gray-600">Use existing x402 libraries and tools</div>
              </div>
              <div className="bg-white rounded border-2 border-black p-4">
                <div className="font-bold text-purple-600 mb-1">Pay-per-Use</div>
                <div className="text-sm text-gray-600">Only pay for API calls you actually make</div>
              </div>
            </div>
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
