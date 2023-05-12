const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const FOUR_BYTES_FORMAT = "    db #n, #n, #n, #n\n";
const TWO_BYTES_FORMAT = "    db #n, #n\n";

const CANVAS_SIZE = 600;

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

const PIXEL_GAP = 1;
const SPRITE_SIZE_PX = 8;
const PIXEL_SIZE = CANVAS_SIZE / SPRITE_SIZE_PX;

const BLUE = ["#000080", 0b00000000]; // Format: [color code, bit mask]
const YELLOW = ["#FFFF00", 0b00010000];
const CYAN = ["#00FFFF", 0b00000001];
const RED = ["#FF0000", 0b00010001];

let selectedColor = RED;
const sprite = createEmptySprite();

clearContext(ctx);
renderSprite(ctx, sprite);

function clearContext(ctx) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function renderSprite(ctx, sprite) {
  for (let i = 0; i < sprite.length; i++) {
    const pixel = sprite[i];
    pixel.render(ctx);
  }
}

function createEmptySprite() {
  const sprite = [];
  const PIXEL_COUNT = SPRITE_SIZE_PX * SPRITE_SIZE_PX;

  for (let i = 0; i < PIXEL_COUNT; i++) {
    let x = (i % SPRITE_SIZE_PX) * PIXEL_SIZE;
    let y = ~~(i / SPRITE_SIZE_PX) * PIXEL_SIZE;
    const pixel = new Pixel(x, y, PIXEL_SIZE, BLUE, PIXEL_GAP);
    sprite.push(pixel);
  }

  return sprite;
}

function getPixelByPoint(point, sprite) {
  for (let i = 0; i < sprite.length; i++) {
    const pixel = sprite[i];
    if (pixel.intersectsWithPoint(point)) return pixel;
  }
  return null;
}

function toHex(number) {
  const hexNumber = number.toString(16).toUpperCase();
  return hexNumber.length > 1 ? hexNumber : "0".concat(hexNumber);
}

function getColorCodes(sprite) {
  const colorCodes = [];

  for (let i = 0; i < sprite.length; i += 4) {
    let colorCode = 0;

    colorCode += sprite[i].color[1] << 3;
    colorCode += sprite[i + 1].color[1] << 2;
    colorCode += sprite[i + 2].color[1] << 1;
    colorCode += sprite[i + 3].color[1];

    colorCodes.push(toHex(colorCode));
  }

  return colorCodes;
}

function colorCodesToAssembly(colorCodes) {
  const lineTemplate = TWO_BYTES_FORMAT;
  let assembly = "sprite:\n";

  for (let i = 0; i < colorCodes.length; i += 2) {
    assembly += lineTemplate
      .replace("n", colorCodes[i])
      .replace("n", colorCodes[i + 1]);
  }

  return assembly;
}

canvas.addEventListener("mousedown", function (e) {
  const point = { x: e.offsetX, y: e.offsetY };
  const pixel = getPixelByPoint(point, sprite);

  if (pixel != null) {
    pixel.color = selectedColor;
    clearContext(ctx);
    renderSprite(ctx, sprite);
  }
});

window.addEventListener(
  "keyup",
  function (e) {
    const key = e.key;
    switch (key) {
      case "1":
        selectedColor = BLUE;
        break;
      case "2":
        selectedColor = YELLOW;
        break;
      case "3":
        selectedColor = CYAN;
        break;
      case "4":
        selectedColor = RED;
        break;
      case "5":
        const colorCodes = getColorCodes(sprite);
        textarea.value = colorCodesToAssembly(colorCodes);
        break;
      default:
        break;
    }
  },
  false
);
