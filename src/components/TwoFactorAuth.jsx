import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';

/**
 * TwoFactorAuth - 2FA setup and verification component
 */
export default function TwoFactorAuth({ onVerify, onCancel }) {
  const [step, setStep] = useState('setup'); // 'setup', 'verify', 'success'
  const [qrCode, setQrCode] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (step === 'setup') {
      generateQRCode();
    }
  }, [step]);

  useEffect(() => {
    if (step === 'verify') {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setTimeLeft(30);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [step]);

  const generateQRCode = () => {
    // Mock QR code generation
    const mockSecret = 'JBSWY3DPEHPK3PXP';
    const mockQRCode = `otpauth://totp/AgnidhraTechnologies:student@example.com?secret=${mockSecret}&issuer=AgnidhraTechnologies`;
    
    setSecretKey(mockSecret);
    setQrCode(mockQRCode);
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    setError('');

    try {
      // Mock verification - in real app, verify with server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (verificationCode === '123456') { // Mock valid code
        setStep('success');
        onVerify?.(true);
      } else {
        setError('Invalid verification code');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = () => {
    setTimeLeft(30);
    setError('');
    // In real app, resend code via SMS/Email
  };

  if (step === 'setup') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 rounded-lg max-w-md w-full p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Enable Two-Factor Authentication</h2>
            <p className="text-slate-400">Secure your account with an extra layer of protection</p>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-4">Step 1: Scan QR Code</h3>
              <div className="bg-white p-4 rounded-lg mb-4">
                <div className="w-48 h-48 bg-gray-200 rounded flex items-center justify-center mx-auto">
                  <span className="text-gray-500">QR Code Placeholder</span>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Use an authenticator app like Google Authenticator or Authy
              </p>
            </div>

            <div className="bg-slate-700 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-white mb-2">Manual Entry Key:</h4>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-slate-800 text-sky-400 p-2 rounded text-sm font-mono">
                  {secretKey}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(secretKey)}
                  className="text-sky-400 hover:text-sky-300"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('verify')}
                className="flex-1 bg-sky-600 text-white py-3 rounded-lg hover:bg-sky-700 transition-colors"
              >
                Next Step
              </button>
              <button
                onClick={onCancel}
                className="px-6 py-3 text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'verify') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 rounded-lg max-w-md w-full p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Verify Setup</h2>
            <p className="text-slate-400">Enter the 6-digit code from your authenticator app</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white text-center text-2xl font-mono focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                maxLength={6}
              />
              {error && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  {error}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Code expires in {timeLeft}s</span>
              <button
                onClick={handleResendCode}
                className="text-sky-400 hover:text-sky-300 flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" />
                Resend
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleVerify}
                disabled={isVerifying || verificationCode.length !== 6}
                className="flex-1 bg-sky-600 text-white py-3 rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify & Enable'
                )}
              </button>
              <button
                onClick={() => setStep('setup')}
                className="px-6 py-3 text-slate-400 hover:text-white transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 rounded-lg max-w-md w-full p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">2FA Enabled Successfully!</h2>
            <p className="text-slate-400 mb-6">
              Your account is now protected with two-factor authentication
            </p>
            <button
              onClick={() => onVerify?.(true)}
              className="w-full bg-sky-600 text-white py-3 rounded-lg hover:bg-sky-700 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}