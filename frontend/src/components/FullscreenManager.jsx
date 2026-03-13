import { useEffect } from 'react';

export default function FullscreenManager({ onViolation }) {
  useEffect(() => {
    const enterFullscreen = async () => {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen().catch(() => null);
      }
    };

    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        onViolation('FULLSCREEN_EXIT');
      }
    };

    enterFullscreen();
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, [onViolation]);

  return null;
}
