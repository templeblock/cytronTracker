
export function videoReady($video) {
  return {
    type: 'VIDEO_READY',
    payload: $video,
  }
}

export function setVideo(url, fps) {
  return {
    type: 'SET_VIDEO',
    payload: { url, fps },
  }
}

export function setFrame(num) {
  return {
    type: 'SET_FRAME',
    payload: num,
  }
}

export function canPlay() {
  return {
    type: 'CAN_PLAY',
    payload: Date.now(),
  }
}