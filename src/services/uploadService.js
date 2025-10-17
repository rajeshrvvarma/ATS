import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import app from '@/config/firebase';

const storage = getStorage(app);

export async function uploadFile(path, file, onProgress) {
  const ref = storageRef(storage, path);
  const uploadTask = uploadBytesResumable(ref, file);

  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed', snapshot => {
      if (onProgress) {
        const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(Math.round(percent));
      }
    }, err => reject(err), async () => {
      try {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      } catch (e) {
        reject(e);
      }
    });
  });
}
