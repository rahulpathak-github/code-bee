import { ILocalVideoTrack, IRemoteVideoTrack, ILocalAudioTrack, IRemoteAudioTrack } from "agora-rtc-sdk-ng";
import React, { useRef, useEffect } from "react";


const MediaPlayer = (props) => {
  const container = useRef(null);
  useEffect(() => {
    if (!container.current) return;
    if (props.videoTrack) props.videoTrack.play(container.current);
    return () => {
      if (props.videoTrack) props.videoTrack.stop();
    };
  }, [container, props.videoTrack]);
  useEffect(() => {
    if (props.audioTrack) props.audioTrack.play();
    return () => {
      if (props.audioTrack) props.audioTrack.stop();
    };
  }, [props.audioTrack]);
  return (
    <div ref={container} className="video-player" style={{ width: "320px", height: "240px" }}></div>
  );
}

export default MediaPlayer;