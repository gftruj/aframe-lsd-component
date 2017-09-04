# aframe-lsd-component

Hue Saturation Lightness meets aframe !
Look around and see how the color is changing, according to the direction You're looking at.

## Description

The component changes an entity materials color, while moving the camera ( or any oher object )
Simply put it in a entity : `<a-sky lsd-component>`

The color changes according to the Hue Saturation Lighness system, while the horizontal rotation correspond to the hue angle, and the vertical rotation correspond to the saturation value.


### Installation

#### CDN script to include:<br>
`<script src="https://cdn.rawgit.com/gftruj/aframe-lsd-component/c1782554/dist/lsd-component.js"></script>`
#### npm 
`npm install aframe-lsd-component`

### Attributes

| Property             | Default      | Description                                         |
|----------------------|--------------|-----------------------------------------------------|
| baseHueAngle         |      0       | The Hue angle when initialized                      |
| baseSaturation       |      50      | The saturation value, when the camera rotation.z is 0                 |
| lightness            |      50      | The 'l' from the hsl color system, it's constant.      |
| saturationOffsetMin  |      30      | The minimal saturation value when looking down.                             |
| saturationOffsetMax  |      120     | The maximum saturation value when looking up.         |
| activeCamera         |  'a-camera'  | This selector takes the object to which the component should be corresponding  |
| performance          |      true    | Change the color either on tick (false), or on component change(true) |

### Notes:

* Why component instead of a material ? 
Afaik, the custom materials don't work with the 'tick' function, I want to implement it, so the color change would be a lot smoother.
On the other hand I will have to work on the resource usage.
