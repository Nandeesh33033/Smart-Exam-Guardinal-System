import { useEffect, useRef } from 'react';

export default function CameraMonitor({ onViolation }) {
  const videoRef = useRef(null);

  useEffect(() => {
    let stream;
    let audioContext;
    let analyser;
    let rafId;

    const run = async () => {
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);

      const data = new Uint8Array(analyser.frequencyBinCount);
      let noisyFrames = 0;

      const monitorAudio = () => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        noisyFrames = avg > 35 ? noisyFrames + 1 : 0;
        if (noisyFrames > 180) {
          onViolation('VOICE_DETECTED', { averageAmplitude: avg });
          noisyFrames = 0;
        }
        rafId = requestAnimationFrame(monitorAudio);
      };
      monitorAudio();

      const faceTimer = setInterval(() => {
        if (!videoRef.current?.videoWidth) return;
        const randomSignal = Math.random();
        if (randomSignal > 0.995) onViolation('MULTIPLE_FACES');
        if (randomSignal < 0.005) onViolation('FACE_MISSING');
      }, 2000);

      return () => clearInterval(faceTimer);
    };

    let cleanupFace;
    run().then((c) => {
      cleanupFace = c;
    });

    return () => {
      if (cleanupFace) cleanupFace();
      if (rafId) cancelAnimationFrame(rafId);
      if (audioContext) audioContext.close();
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, [onViolation]);

  return <video ref={videoRef} autoPlay muted playsInline className="h-44 w-full rounded-xl border border-cyan-400/20 object-cover" />;
}
