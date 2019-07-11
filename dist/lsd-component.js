AFRAME.registerComponent('lsd-component', {
  schema: {
    saturationOffsetMin: {
      default: 30
    },
    saturationOffsetMax: {
      default: 120
    },
    lightness: {
      default: 50
    },
    baseSaturation: {
      default: 50
    },
    baseHueAngle: {
      default: 0
    },
    activeCamera: {
      type: 'selector',
      default: "a-camera"
    },
    performance:{
      type: 'boolean',
      default: false
    }
  },
  init: function() {
    console.clear();
    if(!this.data.activeCamera){
      let cam = document.createElement("a-camera");
      this.el.sceneEl.appendChild(cam);
      this.data.activeCamera = cam;
    }
    this.paused = false;
    this.componentChangedListener = this.componentChangedListener.bind(this);
  },
  update: function(oldData) {
    var self = this;
    var data = this.data;
    var sceneEl = this.el.sceneEl;
    var renderer = this.el.renderer;
    var activeCamera = document.querySelector('a-camera');
    var el = this.el;
    var saturation,
      hslColor,
      saturationOffsetMin = data.saturationOffsetMin,
      saturationOffsetMax = data.saturationOffsetMax,
      lightness = data.lightness,
      baseSaturation = data.baseSaturation,
      baseHueAngle = data.baseHueAngle;
    this.pause();
    sceneEl.addEventListener('camera-set-active', function(evt) {
      activeCamera = evt.detail.cameraEl.components.camera.camera;
    });

    el.setAttribute("material", "color", "hsl(" + baseHueAngle + "," + baseSaturation + "%," + lightness + "%)");
    if(data.performance){
    this.data.activeCamera.addEventListener('componentchanged', this.componentChangedListener);
    }
  },
  componentChangedListener: function(evt){
    var el = this.el;
    var data = this.data;
    if (evt.detail.name === 'rotation') {
        this.angleCheck(evt.detail.newData, data.baseHueAngle, data.activeCamera);
        saturation = this.getSaturation(evt.detail.newData.x, data.baseSaturation, data.saturationOffsetMin, data.saturationOffsetMax);
        this.setMaterial(el, this.getHue(evt.detail.newData.y, data.baseHueAngle), saturation, data.lightness);
      }
  },
  remove: function() {
    this.data.activeCamera.removeEventListener('componentchanged', this.componentChangedListener)
    this.paused = true;
    
  },
  getColor: function(hue, saturation, luminocity) {
    return "hsl(" + hue + "," + Math.round(saturation) + "%," + luminocity + "%)";
  },
  angleCheck: function(angle, baseHue) {
    this.y = this.absMod(angle.y + baseHue, 360)
  },
  getSaturation: function(angle, base, offsetMin, offsetMax) {
    let offset = angle > 0 ? offsetMax - base : base - offsetMin
    let saturation = angle * offset + base
    return saturation > 0 ? saturation : 0
  },
  getHue: function(angle, baseHue) {
    return this.absMod(angle + baseHue, 360);
  },
  setMaterial: function(object, hslColor, saturation, luminocity) {
    object.setAttribute("material", "color", this.getColor(hslColor, saturation, luminocity));
  },
  pause: function(){
    this.data.activeCamera.removeEventListener('componentchanged', this.componentChangedListener)
  },
  play: function(){
    if(this.data.performance){
    this.data.activeCamera.addEventListener('componentchanged', this.componentChangedListener)
    }
  },
  tick: function(){
    if(!this.data.performance){
      if(!this.paused){
        let rotation = this.data.activeCamera.object3D.rotation;
        let saturation = this.getSaturation(rotation.x, this.data.baseSaturation, this.data.saturationOffsetMin, this.data.saturationOffsetMax);
        this.setMaterial(this.el, this.getHue(rotation.y * 180 / Math.PI, this.data.baseHueAngle), saturation, this.data.lightness);
      }
    }
  },
  absMod: function(number, n) {
    return ((number % n) + n) % n;
  }
});
