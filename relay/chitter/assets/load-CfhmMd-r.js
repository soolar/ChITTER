import "./modulepreload-polyfill-DaKOjhqt.js";
function getParent() {
  return window.parent.parent.parent;
}
function getFrames() {
  return getParent().frames;
}
function load() {
  const allFrames = getFrames();
  if (!allFrames) {
    console.error("ChITTER: Failed to load. Can't find frames.");
    return;
  }
  const rootset = allFrames.rootset;
  if (!rootset) {
    console.error("ChITTER: Failed to load. Can't find rootset.");
    return;
  }
  const charpane = allFrames.charpane;
  if (!charpane) {
    console.error("ChITTER: Failed to load. Can't find charpane.");
    return;
  }
  const chitterFrame = getParent().document.createElement("frame");
  chitterFrame.id = "chitterpane";
  chitterFrame.src = "/chitter/index.html";
  rootset.insertBefore(chitterFrame, charpane.frameElement);
  rootset.cols = ["20%", "0%", "55%", "25%"].join(",");
  const mainpane = allFrames.mainpane;
  if (mainpane) {
    mainpane.location.href = "/main.php";
  }
}
load();
