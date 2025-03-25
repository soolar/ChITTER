import "./modulepreload-polyfill-DaKOjhqt.js";
const CHARPANE_URL = "charpane.php";
function getParent() {
  return window.parent.parent.parent;
}
function getFrames() {
  return getParent().frames;
}
function findCharPane() {
  const allFrames = getFrames();
  if (!allFrames) return { pane: void 0, parent: void 0 };
  for (let i = 0; i < allFrames.length; ++i) {
    const frame = allFrames[i];
    if (!frame || !frame.location) continue;
    if (frame.location.href.endsWith(CHARPANE_URL)) {
      const frameElement = frame.frameElement;
      if (!(frameElement == null ? void 0 : frameElement.parentElement)) continue;
      return {
        pane: frame,
        parent: frameElement.parentElement
      };
    }
  }
  return { pane: void 0, parent: void 0 };
}
const MINIMUM_REVISION = 28088;
function load() {
  const currentRevision = window.parent.parent.revision;
  if (currentRevision !== void 0 && 0 < currentRevision && currentRevision < MINIMUM_REVISION) {
    document.body.innerHTML = `<h1>Need KoLmafia at least version ${MINIMUM_REVISION} for ChITTER (you have ${currentRevision}).</h1>`;
    return;
  }
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
  const existingChitterPane = allFrames.chitterpane;
  if (existingChitterPane) {
    existingChitterPane.location.reload();
    return;
  }
  const { pane: charPane, parent: framesetParent } = findCharPane();
  if (!(charPane == null ? void 0 : charPane.frameElement) || !framesetParent) {
    console.error("ChITTER: Failed to load. Can't find char pane.");
    return;
  }
  const chitterFrame = getParent().document.createElement("frame");
  chitterFrame.id = "chitterpane";
  chitterFrame.src = "/chitter/index.html";
  rootset.insertBefore(chitterFrame, charPane.frameElement);
  const currentCols = rootset.cols.split(",");
  currentCols.splice(1, 0, "0%");
  rootset.cols = currentCols.join(",");
  const mainpane = allFrames.mainpane;
  if (mainpane) {
    mainpane.location.href = "/main.php";
  }
}
load();
