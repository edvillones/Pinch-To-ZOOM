class AcodePlugin {
  constructor() {
    this.settings = acode.require("settings");
    this.initialDistance = 0;
    this.initialScale = 1;
    this.currentScale = 15;
    this.minimum = 10;
    this.maximum = 40;

    this.start = this.start.bind(this);
    this.move = this.move.bind(this);
  }

  getDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  start(e) {
    if (e.touches.length === 2) {
      this.initialDistance = this.getDistance(e.touches[0], e.touches[1]);
      this.initialScale = this.currentScale;
    }
  }

  move(e) {
    if (e.touches.length === 2) {
      e.preventDefault(); // Prevent page scrolling
      const currentDistance = this.getDistance(e.touches[0], e.touches[1]);
      this.currentScale =
        this.initialScale * (currentDistance / this.initialDistance);

      if (this.currentScale <= this.minimum) this.currentScale = this.minimum;
      else if (this.currentScale >= this.maximum)
        this.currentScale = this.maximum;

      this.settings.value.fontSize = this.currentScale + "px";
      this.settings.update(false);
    }
  }

  init() {
    document.documentElement.addEventListener("touchstart", this.start);
    document.documentElement.addEventListener("touchmove", this.move);
  }
  
  destroy() {
    document.documentElement.removeEventListener("touchstart", this.start);
    document.documentElement.removeEventListener("touchmove", this.move);
  }
}

const acodePlugin = new AcodePlugin();
acode.setPluginInit("acode.pinch", () => acodePlugin.init());
acode.setPluginUnmount("acode.pinch", () => acodePlugin.destroy());
