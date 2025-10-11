// Simple React QR code component using 'qrcode.react' (to be installed)
import React from 'react';
import QRCode from 'qrcode.react';

export default function UPIQRCode({ upiUrl, size = 160 }) {
  if (!upiUrl) return null;
  return (
    <div className="flex flex-col items-center gap-2 mt-2">
      <QRCode value={upiUrl} size={size} level="H" includeMargin={true} />
      <span className="text-xs text-slate-400">Scan to pay via UPI</span>
    </div>
  );
}
