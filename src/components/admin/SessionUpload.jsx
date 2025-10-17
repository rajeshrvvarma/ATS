import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/config/firebase.js';
import { uploadFile } from '@/services/uploadService.js';

export default function SessionUpload({ batchId, onUploaded }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFile = (e) => {
    setFile(e.target.files && e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !batchId) return;
    setUploading(true);
    try {
      const path = `recordings/batches/${batchId}/${Date.now()}_${file.name}`;
      const url = await uploadFile(path, file, (p) => setProgress(p));

      // write session doc
      const sessionsCol = collection(db, 'batches', batchId, 'sessions');
      const docRef = await addDoc(sessionsCol, {
        title: file.name,
        recordingUrl: url,
        size: file.size,
        createdAt: serverTimestamp()
      });

      setFile(null);
      setProgress(0);
      if (onUploaded) onUploaded({ id: docRef.id, url });
    } catch (err) {
      console.error('Upload failed', err);
      alert('Upload failed: ' + err.message);
    }
    setUploading(false);
  };

  return (
    <div className="space-y-2">
      <input type="file" accept="video/*,audio/*" onChange={handleFile} />
      {file && <div className="text-sm text-slate-300">{file.name} ({Math.round(file.size/1024)} KB)</div>}
      {uploading && <div className="text-sm text-slate-400">Uploading: {progress}%</div>}
      <div>
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="px-3 py-2 bg-sky-600 rounded text-white disabled:opacity-50"
        >Upload Session</button>
      </div>
    </div>
  );
}
