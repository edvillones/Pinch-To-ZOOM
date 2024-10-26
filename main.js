class AcodePlugin {
  constructor() {
    this.settings = acode.require("settings");
    this.initialDistance = 0;
    this.initialScale = 1;
    this.currentScale = 15;

    this.start = this.start.bind(this);
    this.move = this.move.bind(this);
  }

  async init() {
    document.documentElement.addEventListener("touchstart", this.start);
    document.documentElement.addEventListener("touchmove", this.move);
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
      this.currentScale =  this.initialScale * (currentDistance / this.initialDistance);

      if (this.currentScale <= 10) this.currentScale = 10;
      else if (this.currentScale >= 40) this.currentScale = 40;

      this.settings.value.fontSize = this.currentScale + "px";
      this.settings.update(false);
    }
  }

  async destroy() {
    document.documentElement.removeEventListener("touchstart", this.start);
    document.documentElement.removeEventListener("touchmove", this.move);
  }
}

if (window.acode) {
  const acodePlugin = new AcodePlugin();
  acode.setPluginInit("acode.pinch", async baseUrl => {
    if (!baseUrl.endsWith("/")) {
      baseUrl += "/";
    }
    acodePlugin.baseUrl = baseUrl;
    await acodePlugin.init();
  });
  acode.setPluginUnmount("acode.pinch", () => {
    acodePlugin.destroy();
  });
}
