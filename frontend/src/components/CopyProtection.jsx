import { useEffect } from 'react';

const forbidden = new Set(['c', 'v', 'x', 'i']);

export default function CopyProtection({ onViolation }) {
  useEffect(() => {
    const blockEvent = (eventName, type = 'COPY_ATTEMPT') => {
      const handler = (e) => {
        e.preventDefault();
        onViolation(type);
      };
      document.addEventListener(eventName, handler);
      return () => document.removeEventListener(eventName, handler);
    };

    const removeContext = blockEvent('contextmenu');
    const removeCopy = blockEvent('copy');
    const removePaste = blockEvent('paste');

    const onKeyDown = (e) => {
      const key = e.key.toLowerCase();
      const ctrlCombo = e.ctrlKey && forbidden.has(key);
      const devToolsCombo = e.ctrlKey && e.shiftKey && (key === 'i' || key === 'c');
      const functionKey = e.key === 'F12' || e.key === 'PrintScreen';
      if (ctrlCombo || devToolsCombo || functionKey) {
        e.preventDefault();
        onViolation('COPY_ATTEMPT', { key: e.key });
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      removeContext();
      removeCopy();
      removePaste();
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onViolation]);

  return null;
}
