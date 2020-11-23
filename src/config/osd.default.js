export default {
  id: 'canvas',

  tileSources: [],
  sequenceMode: false,
  animationTime: 1.5,
  showReferenceStrip: true,
  showRotationControl: true,
  showNavigator: true,
  navigatorRotate: false,
  navigatorId: 'navigator',
  showFullPageControl: false,
  zoomInButton: 'zoomIn',
  zoomOutButton: 'zoomOut',
  homeButton: 'desktopOverview',
  // rotateLeftButton: containerID + '_rotateLeft',
  // rotateRightButton: containerID + '_rotateRight',
  // toolbar: 'desktopToolbar',
  pixelsPerWheelLine: 60,
  // Enable touch rotation on tactile devices
  gestureSettingsTouch: {
    pinchRotate: true
  },
  gestureSettingsMouse: {
    clickToZoom: false,
    dblClickToZoom: true
  },
  collectionMode: false

}
