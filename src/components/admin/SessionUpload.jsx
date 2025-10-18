import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/config/firebase.js';

export default function SessionUpload({ batchId, onUploaded }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const MAX_SIZE = 1024 * 1024 * 1024; // 1GB limit

  const handleFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    // basic content type check
    if (!f.type.startsWith('video/') && !f.type.startsWith('audio/')) {
      alert('Please select a video or audio file');
      return;
    }
    if (f.size > MAX_SIZE) {
      alert('File too large. Max 1GB allowed');
      return;
    }
    setFile(f);
  };

  async function getSignedUrl(path, contentType) {
    // include ID token for server-side verification
    const user = auth.currentUser;
    let idToken = null;
    if (user) {
      idToken = await user.getIdToken();
    }
    const res = await fetch('/.netlify/functions/generate-upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}) },
      body: JSON.stringify({ path, contentType, ttlSeconds: 900 })
    });
    if (!res.ok) throw new Error('Failed to get upload URL');
    return res.json();
  }

  const handleUpload = async () => {
    if (!file || !batchId) return;
    setUploading(true);
    setProgress(0);
    try {
      const remotePath = `recordings/batches/${batchId}/${Date.now()}_${file.name}`;
      const signed = await getSignedUrl(remotePath, file.type);

      // upload via PUT to signed URL and track progress
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', signed.uploadUrl, true);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable) {
          setProgress(Math.round((ev.loaded / ev.total) * 100));
        }
      };
      const uploadPromise = new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve(true);
          else reject(new Error('Upload failed: ' + xhr.status));
        };
        xhr.onerror = () => reject(new Error('Network error during upload'));
      });
      xhr.send(file);
      await uploadPromise;

      // write session doc with downloadUrl
      const sessionsCol = collection(db, 'batches', batchId, 'sessions');
      const docRef = await addDoc(sessionsCol, {
        title: file.name,
        recordingUrl: signed.downloadUrl,
        size: file.size,
        contentType: file.type,
        createdAt: serverTimestamp()
      });

      setFile(null);
      setProgress(0);
      if (onUploaded) onUploaded({ id: docRef.id, url: signed.downloadUrl });
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
