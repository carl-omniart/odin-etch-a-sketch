// Helpers

function removeChildren(element) {
  while (element.lastChild) element.removeChild(element.lastChild);
  return element;
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function toPercentage(decimal) {
  return Math.floor(decimal * 100)
}

// Grid

function newGrid(squares = getSquaresPerSide()) {
  removeChildren(page.grid);
  addRows(page.grid, squares);
}

function getSquaresPerSide() {
  return page.rows().length;
}

function addRows(container, squares) {
  for (const y = 0; y < squares; y++) container.appendChild(newRow(squares));
}

function newRow(squares) {
  const row = document.createElement("div");
  row.classList.add("row");
  addCells(row, squares);
  return row;
}

function addCells(row, squares) {
  for (const x = 0; x < squares; x++) row.appendChild(newCell());
}

function newCell() {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.addEventListener("mouseover", onMouseOverCell);
  return cell;
}

// Mouse Over Handler

function onMouseOverCell(event) {
  const cell = event.target;
  setColor(cell);
}

function setColor(cell) {
  let hue        = newHue(cell.style._hue);
  let saturation = newSaturation(cell.style._saturation);
  let lightness  = newLightness(cell.style._lightness);

  cell.style._hue        = hue;
  cell.style._saturation = saturation;
  cell.style._lightness  = lightness;

  hsl = `hsl(${hue} ${toPercentage(saturation)}% ${toPercentage(lightness)}%)`;
  cell.style.backgroundColor = hsl;
}

function newHue(hue) {
  if (buttons.single.active) {
    return color.hue.value;
  } else if (buttons.rainbow.active) {
    color.hue.value = getNextHue(color.hue.value);
    return color.hue.value;
  } else if (buttons.random.active) {
    color.hue.value = getRandomHue();
    return color.hue.value;
  } else if (buttons.complement.active) {
    if (hue) hue = getNextHue(hue, 180);
    return hue;
  } else {
    return hue
  };
}

function newSaturation(saturation, step = color.saturation.step) {
  if (saturation) {
    if (buttons.saturate.active   && saturation + step < 1) saturation += step;
    if (buttons.desaturate.active && saturation - step > 0) saturation -= step;
    return saturation;
  } else {
    return color.saturation.value;
  };
}

function newLightness(lightness, step = color.lightness.step) {
  if (lightness) {
    if (buttons.lighten.active && lightness + step < 1.0) lightness += step;
    if (buttons.darken.active  && lightness - step > 0.0) lightness -= step;
    return lightness;
  } else {
    return color.lightness.value;
  };
}

function getNextHue(hue, step = color.hue.step) {
  return ((hue + step) % 360);
}

function getRandomHue() {
  return getRandomInteger(0, 359);
}

// Buttons

function onClickButtonResolution() {
  const message = `How many squares per side? (1-${MAX_SQUARES_PER_SIDE})`
  const squares = Number(prompt(message));
  if (isValidResolution(squares)) newGrid(squares);
}

function onClickButtonSingle() {
  toggleButton("single");
  if (buttons.single.active) turnOff("rainbow", "random", "complement");
}

function onClickButtonRainbow() {
  toggleButton("rainbow");
  if (buttons.rainbow.active) turnOff("single", "random", "complement");
}

function onClickButtonRandom() {
  toggleButton("random");
  if (buttons.random.active) turnOff("single", "rainbow", "complement");
}

function onClickButtonComplement() {
  toggleButton("complement");
  if (buttons.complement.active) turnOff("single", "rainbow", "random");
}

function onClickButtonLighten() {
  toggleButton("lighten");
  if (buttons.lighten.active) turnOff("darken");
}

function onClickButtonDarken() {
  toggleButton("darken");
  if (buttons.darken.active) turnOff("lighten");
}

function onClickButtonSaturate() {
  toggleButton("saturate");
  if (buttons.saturate.active) turnOff("desaturate");
}

function onClickButtonDesaturate() {
  toggleButton("desaturate");
  if (buttons.desaturate.active) turnOff("saturate");
}

function onClickButtonClear() {
  newGrid();
}

function toggleButton(name) {
  buttons[name].active = !buttons[name].active
  page.button(name).classList.toggle("active");
}

function turnOff(...buttonNames) {
  for (const name of buttonNames) {
    if (buttons[name].active) toggleButton(name);
  };
}

function isValidResolution(squaresPerSide) {
  if (
    isNaN(squaresPerSide)             ||
    !Number.isInteger(squaresPerSide) ||
    squaresPerSide < 1                ||
    squaresPerSide > MAX_SQUARES_PER_SIDE
  ) {
    return false;
  } else {
    return true;
  };
}

// Constants

DEFAULT_SQUARES_PER_SIDE =   19; // 19x19 = 361, and there are 360 hues
MAX_SQUARES_PER_SIDE     =  100;

const page = {
  grid:   document.getElementById("grid"),
  rows:   function()   { return document.querySelectorAll(".row" ) },
  cells:  function()   { return document.querySelectorAll(".cell") },
  button: function(id) { return document.querySelector(`button#${id}`) }
};

const color = {
  hue:        { value: getRandomHue(), step:    1 },
  saturation: { value:            0.5, step: 0.12 },
  lightness:  { value:            0.5, step: 0.12 }
}

const buttons = {
  single:     { active: false, handler: onClickButtonSingle     },
  rainbow:    { active: false, handler: onClickButtonRainbow    },
  random:     { active: false, handler: onClickButtonRandom     },
  complement: { active: false, handler: onClickButtonComplement },
  saturate:   { active: false, handler: onClickButtonSaturate   },
  desaturate: { active: false, handler: onClickButtonDesaturate },
  lighten:    { active: false, handler: onClickButtonLighten    },
  darken:     { active: false, handler: onClickButtonDarken     },
  clear:      { active: false, handler: onClickButtonClear      }
}

// Draw Grid!
newGrid(DEFAULT_SQUARES_PER_SIDE);

// Activate Buttons!
for (const [name, button] of Object.entries(buttons)) {
  page.button(name).addEventListener("click", button.handler);
};

// Turn the "Single" button on!
toggleButton("single");