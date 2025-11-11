import { useState, type FC } from "react";
import { FiX } from "react-icons/fi";
import { TelegramQRCode } from "./TelegramQRCode";
import type { Timeframe, TraderSelection } from "../../types";

interface StartBrawlModalProps {
  trader1: TraderSelection;
  trader2: TraderSelection;
  onClose: () => void;
}

export const StartBrawlModal: FC<StartBrawlModalProps> = ({
  trader1,
  trader2,
  onClose,
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>(7);
  const [showQR, setShowQR] = useState(false);

  // Generate deep link payload
  const generateDeepLink = (timeframe: Timeframe): string => {
    const payload = {
      traderAAddress: trader1.walletAddress,
      traderAName: trader1.name || trader1.pseudonym || "Unknown Trader",
      traderAImage: trader1.profileImage || undefined,
      traderBAddress: trader2.walletAddress,
      traderBName: trader2.name || trader2.pseudonym || "Unknown Trader",
      traderBImage: trader2.profileImage || undefined,
      timeframe,
    };

    // Base64 encode the payload
    const encoded = btoa(JSON.stringify(payload));

    // Bot username - update this with your actual bot username
    const botUsername =
      import.meta.env.VITE_TELEGRAM_BOT_USERNAME || "polyarena_bot";

    return `https://t.me/${botUsername}?start=${encoded}`;
  };

  const deepLink = generateDeepLink(selectedTimeframe);

  const handleContinue = () => {
    setShowQR(true);
  };

  const handleOpenTelegram = () => {
    window.open(deepLink, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-2xl bg-background rounded-lg border-4 border-black shadow-brutal overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b-4 border-black p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold comic-font">Start Rumble 💥🥊</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!showQR ? (
            <>
              {/* Fighters */}
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-trader1 flex items-center justify-center text-white font-bold text-2xl mb-2">
                    {(trader1.name || trader1.pseudonym || "T").charAt(0)}
                  </div>
                  <p className="font-semibold body-font text-sm">
                    {trader1.name || trader1.pseudonym || "Trader 1"}
                  </p>
                </div>

                <div className="text-4xl">💥🥊</div>

                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-trader2 flex items-center justify-center text-white font-bold text-2xl mb-2">
                    {(trader2.name || trader2.pseudonym || "T").charAt(0)}
                  </div>
                  <p className="font-semibold body-font text-sm">
                    {trader2.name || trader2.pseudonym || "Trader 2"}
                  </p>
                </div>
              </div>

              {/* Timeframe Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 body-font">
                  Battle Duration
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[7, 30, 90].map((days) => (
                    <button
                      key={days}
                      onClick={() => setSelectedTimeframe(days as Timeframe)}
                      className={`
                        p-4 rounded-lg border-2 font-bold transition-all
                        ${
                          selectedTimeframe === days
                            ? "border-black bg-yellow-300 shadow-brutal-sm"
                            : "border-gray-300 bg-white hover:border-gray-400"
                        }
                      `}
                    >
                      <div className="text-2xl font-bold comic-font">
                        {days}
                      </div>
                      <div className="text-xs body-font text-gray-600">
                        days
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900 body-font">
                  📱 You'll be redirected to Telegram to create your rumble. One
                  tap and you're done!
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={handleContinue}
                className="w-full comic-button bg-green-500 hover:bg-green-600 text-white py-4 text-lg"
              >
                Continue to Telegram 🚀
              </button>
            </>
          ) : (
            <>
              {/* QR Code View */}
              <div className="space-y-6">
                {/* Important Notice */}
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                  <h3 className="font-bold text-yellow-900 mb-2 comic-font">
                    ⚠️ Important
                  </h3>
                  <p className="text-sm text-yellow-800 body-font mb-3">
                    If you've used this bot before, the button below might just
                    open your existing chat. If nothing happens after clicking:
                  </p>
                  <ol className="text-sm text-yellow-800 body-font list-decimal list-inside space-y-1">
                    <li>Stop/Block the bot in Telegram settings</li>
                    <li>Click the button below again</li>
                    <li>Press [Start] when prompted</li>
                  </ol>
                </div>

                {/* Mobile: Direct Link */}
                <div className="md:hidden">
                  <button
                    onClick={handleOpenTelegram}
                    className="w-full comic-button bg-blue-500 hover:bg-blue-600 text-white py-4 text-lg"
                  >
                    Open Telegram 📱
                  </button>
                  <p className="text-sm text-gray-600 text-center mt-2 body-font">
                    Tap the button above to create your rumble
                  </p>
                </div>

                {/* Desktop: QR Code + Link */}
                <div className="hidden md:flex flex-col items-center gap-4">
                  <TelegramQRCode deepLink={deepLink} />

                  <div className="text-center">
                    <p className="text-sm text-gray-600 body-font mb-2">Or</p>
                    <button
                      onClick={handleOpenTelegram}
                      className="comic-button bg-blue-500 hover:bg-blue-600 text-white px-6 py-3"
                    >
                      Open Telegram Desktop 💻
                    </button>
                  </div>
                </div>

                {/* Back Button */}
                <button
                  onClick={() => setShowQR(false)}
                  className="w-full comic-button bg-gray-200 hover:bg-gray-300 py-3"
                >
                  ← Back
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
