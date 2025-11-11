import type { FC } from "react";
import { QRCodeSVG } from "qrcode.react";

interface TelegramQRCodeProps {
  deepLink: string;
}

export const TelegramQRCode: FC<TelegramQRCodeProps> = ({ deepLink }) => {
  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg border-4 border-black">
      <h3 className="text-lg font-bold comic-font">Scan with Telegram</h3>
      <div className="p-4 bg-white">
        <QRCodeSVG value={deepLink} size={256} level="H" includeMargin />
      </div>
      <p className="text-sm text-gray-600 text-center body-font max-w-xs">
        Open Telegram on your phone and scan this QR code to create your rumble
      </p>
    </div>
  );
};
