'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './index.module.css';
import Image from "next/image";

export default function ProfileAvatar({ userId, initialAvatar }) {
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const [src, setSrc] = useState(initialAvatar || null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  

  function openPicker() {
    fileInputRef.current?.click();
  }


  async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    
    if (file.size > 2 * 1024 * 1024) {
      alert("File is too large! Please select an image under 2MB");
      return;
    }

    setIsUploading(true);

    
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result; 
      setSrc(base64String);

      try {
        
        const res = await fetch(`/api/users/${userId}/avatar`, {
          method: 'PATCH', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            avatarBase64: base64String,
          }), 

        });

        if (!res.ok) throw new Error('Upload failed');
        
        // Refresh the page to show the new avatar
        router.refresh();
        

      } catch (error) {
        console.error(error);
      } finally {
        setIsUploading(false);
      }
    };
    
    // This triggers the onloadend function above
    reader.readAsDataURL(file); 
  }

  return (
    <div className={styles.avatarWrap}>
      <button
        type="button"
        onClick={openPicker}
        className={styles.avatarButton}
        aria-label="Change profile picture"
      >
        {src ? (
          <Image src={src} alt="Profile picture" fill sizes="160px" unoptimized className={styles.avatarImg} />
        ) : (
          <span className="material-symbols-outlined" aria-hidden="true">
            account_circle
          </span>
        )}
        <span className={styles.avatarOverlay} aria-hidden="true">
          Change
        </span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className={styles.fileInput}
        aria-hidden="true"
        tabIndex={-1}
      />
      {error && <p className={styles.error} role="alert">{error}</p>}
    </div>
  );
}
