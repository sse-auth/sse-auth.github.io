import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface CanvasVideo {
  srcMp4: string;
  srcWebm: string;
  className?: string;
  inView: boolean;
  autoPlay?: boolean;
  preload?: string;
  setBackgroundColor?: React.Dispatch<React.SetStateAction<string>>;
  lazyLoading?: boolean;
}

const CanvasVideo: React.FC<CanvasVideo> = ({
  srcMp4,
  srcWebm,
  className = '',
  inView,
  autoPlay = true,
  preload = 'auto',
  setBackgroundColor = undefined,
  lazyLoading = true,
}) => {
  const requestAnimationFrameId = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wrapperRef, wrapperInView] = useInView({
    threshold: 0,
    triggerOnce: true,
    rootMargin: '400px',
  });

  const showVideo = !lazyLoading || wrapperInView;

  const renderVideo = useCallback((ctx: CanvasRenderingContext2D, video: HTMLVideoElement) => {
    ctx.drawImage(video, 0, 0);
    requestAnimationFrameId.current = window.requestAnimationFrame(() => {
      renderVideo(ctx, video);
    });
  }, []);

  // Set canvas size when video metadata is available
  const onVideoReady = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }
  }, []);

  // Check whether video has width which could be considered as a sign that metadata is loaded
  // I use it as an alternative for state attribute in video, since it has a different behaviour in Safari and Chrome

  const onMount = () => {
    const video = videoRef.current;
    if (video && typeof video.videoWidth === 'number' && video.videoWidth > 0) {
      setIsVideoReady(true);
    } else {
      setIsVideoReady(false);
    }
  };

  // Run a video ready function or subscribe to event listener waiting meta data loading
  // SSR could cause the issue when we subscribe to even when it's already triggered
  // For this reason we have an additional video width check

  useEffect(() => {
    if (showVideo) {
      const video = videoRef.current;
      if (isVideoReady) {
        onVideoReady();
      } else if (video) {
        video.addEventListener('loadedmetadata', () => {
          onVideoReady();
          setIsVideoReady(true);
        });
      }
    }
  }, [isVideoReady, onVideoReady, showVideo]);

  useEffect(() => {
    if (showVideo) {
      onMount();
    }
  }, [showVideo]);

  const setBackgroundColorIfPossible = (ctx: CanvasRenderingContext2D) => {
    const rawColorData = ctx.getImageData(0, 0, 8, 8).data;
    const r: number = rawColorData[60];
    const g: number = rawColorData[61];
    const b: number = rawColorData[62];
    if (r === 0 && g === 0 && b === 0) {
      setTimeout(() => {
        setBackgroundColorIfPossible(ctx);
      }, 1000);
    } else {
      setBackgroundColor?.(`rgb(${r},${g},${b})`);
    }
  };
  // Play the video and render video in canvas simultaneously
  const play = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    video.play();
    const ctx = canvas.getContext('2d');

    if (ctx) {
      renderVideo(ctx, video);

      if (setBackgroundColor) {
        setBackgroundColorIfPossible(ctx);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pause the video and stop execution of animation frame
  const pause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();

    if (requestAnimationFrameId.current !== null) {
      window.cancelAnimationFrame(requestAnimationFrameId.current);
    }
  }, []);

  // Move to a playing state when all condition are met
  useEffect(() => {
    if (showVideo && inView && isVideoReady && !isPlaying) {
      setIsPlaying(true);
      play();
    }
    if (!inView && isVideoReady && isPlaying) {
      setIsPlaying(false);
      pause();
    }
  }, [inView, isPlaying, isVideoReady, pause, play, showVideo]);

  return (
    <div ref={wrapperRef}>
      <canvas ref={canvasRef} className={className} />
      {showVideo && (
        <video
          ref={videoRef}
          className="hidden"
          autoPlay={autoPlay}
          preload={preload}
          muted
          playsInline
          loop
        >
          <source src={srcMp4} type="video/mp4" />
          <source src={srcWebm} type="video/webm" />
        </video>
      )}
    </div>
  );
};
