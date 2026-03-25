import React from "react";

const VideoTile = ({ stream, name }) => {
  return (
    <div className="video-tile">
      <video
        autoPlay
        ref={el => el && (el.srcObject = stream)}
      />
      <div className="name">{name}</div>
    </div>
  );
};

export default VideoTile;