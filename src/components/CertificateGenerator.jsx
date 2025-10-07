import React, { useState } from 'react';
import { Download, Share, CheckCircle, Calendar, Award, User, BookOpen } from 'lucide-react';
import { downloadCertificate, verifyCertificate } from '@/services/certificateService';

/**
 * CertificateGenerator - PDF certificate generation and display
 */
export default function CertificateGenerator({ certificate, onClose }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!certificate) return;
    
    setIsDownloading(true);
    try {
      await downloadCertificate(certificate.certificateId);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${certificate.courseName} Certificate`,
        text: `I completed ${certificate.courseName} at Agnidhra Technologies!`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${certificate.courseName} Certificate - ${certificate.certificateId}`);
      alert('Certificate link copied to clipboard!');
    }
  };

  if (!certificate) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 to-blue-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Certificate of Completion</h2>
                <p className="text-sky-100">Agnidhra Technologies</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-sky-200 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Certificate Content */}
        <div className="p-8">
          {/* Certificate Design */}
          <div className="border-4 border-sky-600 rounded-lg p-8 text-center bg-gradient-to-b from-slate-50 to-white">
            {/* Logo/Header */}
            <div className="mb-8">
              <div className="w-20 h-20 bg-sky-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Certificate of Completion</h1>
              <p className="text-slate-600">This is to certify that</p>
            </div>

            {/* Student Name */}
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-sky-600 mb-2 border-b-4 border-sky-600 pb-4">
                {certificate.studentName}
              </h2>
              <p className="text-slate-600">has successfully completed</p>
            </div>

            {/* Course Name */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-slate-800 mb-2">
                {certificate.courseName}
              </h3>
              <p className="text-slate-600">on {new Date(certificate.completionDate).toLocaleDateString()}</p>
            </div>

            {/* Certificate ID */}
            <div className="mb-8">
              <p className="text-sm text-slate-500">Certificate ID: {certificate.certificateId}</p>
            </div>

            {/* Signatures */}
            <div className="flex justify-between items-end mt-12">
              <div className="text-center">
                <div className="border-t-2 border-slate-400 w-32 mx-auto mb-2"></div>
                <p className="text-sm text-slate-600">Instructor</p>
                <p className="font-semibold text-slate-800">{certificate.instructorName}</p>
              </div>
              <div className="text-center">
                <div className="border-t-2 border-slate-400 w-32 mx-auto mb-2"></div>
                <p className="text-sm text-slate-600">Date</p>
                <p className="font-semibold text-slate-800">{new Date(certificate.completionDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
              {isDownloading ? 'Downloading...' : 'Download PDF'}
            </button>
            
            <button
              onClick={handleShare}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Share className="w-5 h-5" />
              Share
            </button>
          </div>

          {/* Verification Info */}
          <div className="mt-6 p-4 bg-slate-100 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="font-semibold text-slate-800">Verified Certificate</span>
            </div>
            <p className="text-sm text-slate-600">
              This certificate can be verified using the Certificate ID: <code className="bg-slate-200 px-2 py-1 rounded">{certificate.certificateId}</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}