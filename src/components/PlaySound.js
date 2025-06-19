import { useRef } from "react";

const useClickSound = (url = '', volume = 0, delayMs = 500) => {
  const audioRef = useRef(null);
  const lastPlayedRef = useRef(0);

  if (!audioRef.current) {
    const audio = new Audio(url);
    audio.volume = volume;
    audio.preload = 'auto';
    audioRef.current = audio;
  }

  const play = () => {
    const now = Date.now();
    if (now - lastPlayedRef.current >= delayMs) {
      lastPlayedRef.current = now;
      const sound = audioRef.current;
      sound.currentTime = 0;
      sound.play().catch(err => console.console.warn("Sound error:", err));
    }
  };

  return play;
};

export default useClickSound;