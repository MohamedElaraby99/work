import React, { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./../styles/VideoDetailsPage.css";

const VideoDetailsPage = () => {
  const location = useLocation();
  const { state } = location;
  const [video] = useState(state?.video);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [quality, setQuality] = useState("large");
  const [volume, setVolume] = useState(50);
  const [isRotated, setIsRotated] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const videoContainerRef = useRef(null);
  const playerRef = useRef(null);

  const extractEmbedUrl = (url) => {
    if (!url) return null;
    const regExp =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match
      ? `https://www.youtube.com/embed/${match[1]}?enablejsapi=1&modestbranding=1&rel=0&controls=0`
      : null;
  };

  useEffect(() => {
    if (window.YT && window.YT.Player) {
      playerRef.current = new window.YT.Player("youtube-player", {
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);

      window.onYouTubeIframeAPIReady = () => {
        playerRef.current = new window.YT.Player("youtube-player", {
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
          },
        });
      };
    }
  }, []);

  const onPlayerReady = (event) => {
    setDuration(event.target.getDuration());
    setInterval(() => {
      setProgress(event.target.getCurrentTime());
    }, 1000);
  };

  const onPlayerStateChange = (event) => {
    setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
  };

  const handleFullscreenToggle = () => {
    const container = videoContainerRef.current;
    if (!document.fullscreenElement) {
      container?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const handleForward = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(currentTime + 10, true);
      setProgress(currentTime + 10);
    }
  };

  const handleBackward = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(Math.max(currentTime - 10, 0), true);
      setProgress(Math.max(currentTime - 10, 0));
    }
  };

  const handleRotateScreen = () => {
    setIsRotated(!isRotated);
    if (window.screen.orientation) {
      if (!isRotated) {
        window.screen.orientation.lock("landscape");
      } else {
        window.screen.orientation.unlock();
      }
    }
  };

  const handlePlayPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleQualityChange = (event) => {
    const newQuality = event.target.value;
    setQuality(newQuality);
    if (playerRef.current) {
      playerRef.current.setPlaybackQuality(newQuality);
    }
  };

  const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    setVolume(newVolume);
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume);
    }
  };

  // Added speed change handler
  const handleSpeedChange = (event) => {
    const newSpeed = parseFloat(event.target.value);
    setSpeed(newSpeed);
    if (playerRef.current) {
      playerRef.current.setPlaybackRate(newSpeed);
    }
  };

  const handleTimelineChange = (event) => {
    const newTime = event.target.value;
    setProgress(newTime);
    if (playerRef.current) {
      playerRef.current.seekTo(newTime, true);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (!video) {
    return <p>لا يوجد فيديو لعرضه.</p>;
  }

  const videoEmbedUrl = extractEmbedUrl(video?.lesson_link);

  return (
    <div
      className={`video-details-page-container ${
        isFullscreen ? "fullscreen-mode" : ""
      }`}
    >
      <div className="video-details">
        <div className="video-title">
          <h1>{video.title}</h1>
        </div>
        <div className="video-details-page">
          <div className="video-player-container" ref={videoContainerRef}>
            <div className="video-overlay"></div>
            <iframe
              id="youtube-player"
              src={videoEmbedUrl}
              title={video.title}
              className={`video-player ${isFullscreen ? "fullscreen" : ""}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
            <div className="video-con">
              <div className="timeline-container">
                <span>{formatTime(progress)}</span>
                <input
                  type="range"
                  className="timeline-slider"
                  min="0"
                  max={duration}
                  value={progress}
                  onChange={handleTimelineChange}
                />
                <span>{formatTime(duration)}</span>
              </div>

              <div className="video-controls">
                <button className="control-buttonn" onClick={handleBackward}>
                  →
                </button>

                <button className="control-buttonn" onClick={handlePlayPause}>
                  {isPlaying ? " إيقاف" : " تشغيل"}
                </button>

                <button className="control-buttonn" onClick={handleForward}>
                  ←
                </button>

                <select
                  className="control-select"
                  onChange={handleQualityChange}
                  value={quality}
                >
                  <option value="auto">تلقائي</option>
                  <option value="highres">عالية جدًا</option>
                  <option value="hd1080">1080p</option>
                  <option value="hd720">720p</option>
                  <option value="large">480p</option>
                  <option value="medium">360p</option>
                  <option value="small">240p</option>
                </select>

                <input
                  type="range"
                  className="volume-slider"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                />

                {/* Modified speed control */}
                <select
                  className="control-select"
                  onChange={handleSpeedChange}
                  value={speed}
                >
                  <option value="0.5">0.5x</option>
                  <option value="1">عادي</option>
                  <option value="1.5">1.5x</option>
                  <option value="2">2x</option>
                </select>

                <button
                  className="control-buttonn"
                  onClick={handleFullscreenToggle}
                >
                  {isFullscreen ? "🔲 تصغير" : "⛶ تكبير"}
                </button>

                <button
                  className="control-buttonn rotate-button"
                  onClick={handleRotateScreen}
                >
                  قلب الشاشة
                </button>
              </div>
            </div>
          </div>

          <div className="video-description-container">
            <div className="video-description">
              <h3 className="description-title">وصف الفيديو</h3>
              <p className="description">
                {video.description || "لا يوجد وصف"}
              </p>
            </div>
            <div className="notes-container">
              <h3 className="notes-title">ملاحظات</h3>
              <p className="notes">{video.notes || "لا توجد ملاحظات"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetailsPage;
