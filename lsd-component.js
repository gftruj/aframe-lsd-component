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
    }
  },
  init: function() {
    this.componentChangedListener = this.componentChangedListener.bind(this);
    this.data.activeCamera.addEventListener('componentchanged', this.componentChangedListener);

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

    sceneEl.addEventListener('camera-set-active', function(evt) {
      //this.el.setAttribute("lsd-component")
      activeCamera = evt.detail.cameraEl.components.camera.camera;
    });

    el.setAttribute("material", "color", "hsl(" + baseHueAngle + "," + baseSaturation + "%," + lightness + "%)");
    
  },
  componentChangedListener: function(evt){
    var el = this.el;
    var data = this.data;
    if (evt.detail.name === 'rotation') {
        this.angleCheck(evt.detail.newData, data.baseHueAngle, data.activeCamera);
        saturation = this.setSaturation(evt.detail.newData.x, data.baseSaturation, data.saturationOffsetMin, data.saturationOffsetMax);
        this.setMaterial(el, this.setHue(evt.detail.newData.y, data.baseHueAngle), saturation, data.lightness);
      }

  },
  remove: function() {
    this.data.activeCamera.removeEventListener('componentchanged', this.componentChangedListener)
  },
  getColor: function(hue, saturation, luminocity) {
    return "hsl(" + hue + "," + Math.round(saturation) + "%," + luminocity + "%)";
  },
  angleCheck: function(angle, baseHue, camera) {
    if (angle.y <= baseHue + 10) {
      angle.y += 360;
      camera.setAttribute("rotation", angle);
    } else if (angle.y > baseHue + 370) {
      angle.y -= 360;
      camera.setAttribute("rotation", angle);
    } else if (angle.y < 0) {
      angle.y = 0 + baseHue;
      camera.setAttribute("rotation", angle);
    }
  },
  setSaturation: function(height, base, offsetMin, offsetMax) {
    return (height > 0) ? (((height / 90) * (offsetMax - base)) + base) : ((height / 90) * (base - offsetMin)) + base
  },
  setHue: function(angle, baseHue) {
    return angle + baseHue;
  },
  setMaterial: function(object, hslColor, saturation, luminocity) {
    object.setAttribute("material", "color", this.getColor(hslColor, saturation, luminocity));
  },
  pause: function(){
    this.data.activeCamera.removeEventListener('componentchanged', this.componentChangedListener)
  },
  play: function(){
    this.data.activeCamera.addEventListener('componentchanged', this.componentChangedListener)
  }
  
  
});
