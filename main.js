const settings = acode.require("settings");
const aceContent = document.documentElement;
let initialDistance = 0;
let initialScale = 1;
let fontSize = parseFloat(editorManager.editor.getFontSize().split("px"));
const minimum = 10;
const maximum = 40;

let getPos;
let currentHeight;
let exactPos;
let currentLeft;

const span = document.createElement("span");
Object.assign(span.style, {
  position: "fixed",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
  color: "white",
  background: "#00000010",
  backdropFilter: "blur(2px)",
  borderRadius: "5px",
  border: "white 1px solid",
  padding: "10px 15px",
  fontSize: "15px",
});

function getDistance(touch1, touch2) {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

function start(e) {
  if (e.touches.length === 2) {
    initialDistance = getDistance(e.touches[0], e.touches[1]);
    initialScale = fontSize;

    getPos = editorManager.editor.session.getScrollTop();
    currentHeight = editorManager.editor.renderer.scrollBarV.scrollHeight;
    exactPos = getPos / currentHeight;
    currentLeft = editorManager.editor.session.getScrollLeft();

    document.body.appendChild(span);
  }
}

function move(e) {
  if (e.touches.length === 2) {
    e.preventDefault();
    const currentDistance = getDistance(e.touches[0], e.touches[1]);
    fontSize = initialScale * (currentDistance / initialDistance);
    if (fontSize <= minimum) fontSize = minimum;
    else if (fontSize >= maximum) fontSize = maximum;

    settings.value.fontSize = `${fontSize.toFixed(2)}px`;
    span.textContent = settings.value.fontSize;
    settings.update(false);

    editorManager.editor.session.setScrollTop(
      editorManager.editor.renderer.scrollBarV.scrollHeight * exactPos
    );
    editorManager.editor.session.setScrollLeft(currentLeft);
  }
}

function end() {
  if (document.body.contains(span)) {
    document.body.removeChild(span);
  }
}

function init() {
  aceContent.addEventListener("touchstart", start);
  aceContent.addEventListener("touchmove", move);
  aceContent.addEventListener("touchend", end);
}

function destroy() {
  aceContent.removeEventListener("touchstart", start);
  aceContent.removeEventListener("touchmove", move);
  aceContent.removeEventListener("touchend", end);
}

acode.setPluginInit("acode.pinch", init);
acode.setPluginUnmount("acode.pinch", destroy);
