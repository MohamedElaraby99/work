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
            <div className="video-overlay" onClick={handlePlayPause}></div>
            <iframe
              id="youtube-player"
              src={videoEmbedUrl}
              title={video.title}
              className={`video-player ${isFullscreen ? "fullscreen" : ""}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
            {/* زر التشغيل في المنتصف */}
            <button
              className="center-play-button"
              onClick={handlePlayPause}
              style={{ display: isPlaying ? "none" : "block" }}
            >
              <svg viewBox="0 0 24 24" width="50" height="50" fill="white">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </button>
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
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="white">
                    <polygon points="9,3 23,12 9,21" />
                    <rect x="5" y="3" width="2" height="18" />
                  </svg>
                </button>

                <button className="control-buttonn" onClick={handlePlayPause}>
                  {isPlaying ? (
                    <svg
                      viewBox="0 0 15 15"
                      width="15"
                      height="15"
                      fill="white"
                    >
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="white"
                    >
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  )}
                </button>

                <button className="control-buttonn" onClick={handleForward}>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="white">
                    <polygon points="15,3 1,12 15,21" />
                    <rect x="17" y="3" width="2" height="18" />
                  </svg>
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
                  {isFullscreen ? (
                    <svg
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="white"
                    >
                      <path d="M5 16h3v3h2v-5H5v2zm9-2h5v-2h-3v-3h-2v5zm-4 7v-2H5v-5H3v7h7zm11-7v-5h-5v-2h7v7h-2z" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="white"
                    >
                      <path d="M7 7H5v2H2v2h5V7zm10 0h2v4h5V9h-3V7h-4zm0 10v-2h3v-2h-5v4h2zm-10 0v-4H2v2h3v2h2z" />
                    </svg>
                  )}
                </button>

                <button
                  className="control-buttonn rotate-button"
                  onClick={handleRotateScreen}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm2-10h-4v2h4v4l3-3-3-3z" />
                  </svg>
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
