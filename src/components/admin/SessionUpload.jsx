import React, { useState, useRef } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/config/firebase.js';

export default function SessionUpload({ batchId, onUploaded }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const xhrRef = useRef(null);

  const MAX_SIZE = 1024 * 1024 * 1024; // 1GB limit
  const RESUMABLE_THRESHOLD = 50 * 1024 * 1024; // 50MB
  const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB

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

  async function initResumableSession(path, contentType) {
    const user = auth.currentUser;
    let idToken = null;
    if (user) idToken = await user.getIdToken();
    const res = await fetch('/.netlify/functions/init-resumable-upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}) },
      body: JSON.stringify({ path, contentType })
    });
    if (!res.ok) throw new Error('Failed to init resumable session');
    return res.json();
  }

  const handleUpload = async () => {
    if (!file || !batchId) return;
    setUploading(true);
    setProgress(0);
    try {
      const remotePath = `recordings/batches/${batchId}/${Date.now()}_${file.name}`;

      if (file.size > RESUMABLE_THRESHOLD) {
        // Use resumable chunked upload
        const { uploadUrl, downloadUrl } = await initResumableSession(remotePath, file.type);
        // Upload in chunks with Content-Range
        let offset = 0;
        while (offset < file.size) {
          if (!xhrRef.current) xhrRef.current = {};
          const chunkEnd = Math.min(offset + CHUNK_SIZE, file.size);
          const chunk = file.slice(offset, chunkEnd);
          // PUT chunk with Content-Range
          const r = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': file.type,
              'Content-Range': `bytes ${offset}-${chunkEnd - 1}/${file.size}`
            },
            body: chunk
          });
          if (!(r.status >= 200 && r.status < 300) && r.status !== 308) {
            throw new Error('Chunk upload failed: ' + r.status);
          }
          offset = chunkEnd;
          setProgress(Math.round((offset / file.size) * 100));
        }

        // finalize: write session doc
        const sessionsCol = collection(db, 'batches', batchId, 'sessions');
        const docRef = await addDoc(sessionsCol, {
          title: file.name,
          recordingUrl: downloadUrl,
          size: file.size,
          contentType: file.type,
          createdAt: serverTimestamp()
        });

        setFile(null);
        setProgress(0);
        if (onUploaded) onUploaded({ id: docRef.id, url: downloadUrl });
      } else {
        // Small file: use existing signed PUT flow
        const signed = await getSignedUrl(remotePath, file.type);

        // upload via PUT to signed URL and track progress
        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;
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
      }
    } catch (err) {
      console.error('Upload failed', err);
      alert('Upload failed: ' + err.message);
      setUploadError(err.message || 'Upload failed');
    }
    setUploading(false);
  };

  const handleCancel = () => {
    if (xhrRef.current) {
      try { xhrRef.current.abort(); setUploading(false); setUploadError('Upload cancelled'); setProgress(0); }
      catch (e) { console.warn('Cancel failed', e); }
    }
  };

  const handleRetry = async () => {
    setUploadError(null);
    await handleUpload();
  };

  return (
    <div className="space-y-2">
      <input type="file" accept="video/*,audio/*" onChange={handleFile} />
      {file && <div className="text-sm text-slate-300">{file.name} ({Math.round(file.size/1024)} KB)</div>}
      {uploading && <div className="text-sm text-slate-400">Uploading: {progress}%</div>}
      {uploadError && <div className="text-sm text-red-500">{uploadError}</div>}
      <div>
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="px-3 py-2 bg-sky-600 rounded text-white disabled:opacity-50"
        >Upload Session</button>
        <button onClick={handleCancel} disabled={!uploading} className="ml-2 px-3 py-2 bg-gray-600 rounded text-white">Cancel</button>
        {uploadError && !uploading && <button onClick={handleRetry} className="ml-2 px-3 py-2 bg-yellow-600 rounded text-white">Retry</button>}
      </div>
    </div>
  );
}
