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
  for (let y = 0; y < squares; y++) container.appendChild(newRow(squares));
}

function newRow(squares) {
  const row = document.createElement("div");
  row.classList.add("row");
  addCells(row, squares);
  return row;
}

function addCells(row, squares) {
  for (let x = 0; x < squares; x++) row.appendChild(newCell());
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
  if (state.button.single ) return state.hue;
  if (state.button.rainbow) return (state.hue = getNextHue(state.hue));
  if (state.button.random ) return (state.hue = getRandomHue());
  return hue;
}

function newSaturation(saturation) {
  if (saturation) {
    if (state.button.saturate   && saturation < 1) saturation += 0.1;
    if (state.button.desaturate && saturation > 0) saturation -= 0.1;
    return saturation;
  } else {
    return 0.5;
  };
}

function newLightness(lightness) {
  if (lightness) {
    if (state.button.lighten && lightness < 1) lightness += 0.1;
    if (state.button.darken  && lightness > 0) lightness -= 0.1;
    return lightness;
  } else {
    return 0.5;
  };
}

function getNextHue(hue, increment = 1) {
  return ((hue + increment) % 360);
}

function getRandomHue() {
  return getRandomInteger(0, 359);
}

// Buttons

function initiateButtons() {
  page.button("resolution").addEventListener("click", onClickButtonResolution);
  page.button(    "single").addEventListener("click", onClickButtonSingle    );
  page.button(   "rainbow").addEventListener("click", onClickButtonRainbow   );
  page.button(    "random").addEventListener("click", onClickButtonRandom    );
  page.button(   "lighten").addEventListener("click", onClickButtonLighten   );
  page.button(    "darken").addEventListener("click", onClickButtonDarken    );
  page.button(  "saturate").addEventListener("click", onClickButtonSaturate  );
  page.button("desaturate").addEventListener("click", onClickButtonDesaturate);
  page.button(     "clear").addEventListener("click", onClickButtonClear     );

  toggleButton("single");
}

function onClickButtonResolution() {
  const userInput = prompt("How many squares per side? (1-100)");
  const squares   = Number(userInput);
  if (isValidResolution(squares)) newGrid(squares);
}

function onClickButtonSingle() {
  toggleButton("single");
  if (areActive("single", "rainbow")) toggleButton("rainbow");
  if (areActive("single",  "random")) toggleButton("random" );
}

function onClickButtonRainbow() {
  toggleButton("rainbow");
  if (areActive("rainbow", "random")) toggleButton("random");
  if (areActive("rainbow", "single")) toggleButton("single");
}

function onClickButtonRandom() {
  toggleButton("random");
  if (areActive("random", "rainbow")) toggleButton("rainbow");
  if (areActive("random",  "single")) toggleButton("single" );
}

function onClickButtonLighten() {
  toggleButton("lighten");
  if (areActive("lighten", "darken")) toggleButton("darken");
}

function onClickButtonDarken() {
  toggleButton("darken");
  if (areActive("darken", "lighten")) toggleButton("lighten");
}

function onClickButtonSaturate() {
  toggleButton("saturate");
  if (areActive("saturate", "desaturate")) toggleButton("desaturate");
}

function onClickButtonDesaturate() {
  toggleButton("desaturate");
  if (areActive("desaturate", "saturate")) toggleButton("saturate");
}

function onClickButtonClear() {
  newGrid();
}

function areActive(...buttons) {
  return buttons.reduce((flag, name) => flag && state.button[name], true);
}

function toggleButton(name) {
  state.button[name] = !state.button[name];
  page.button(name).classList.toggle("active");
}

// Values

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

MAX_SQUARES_PER_SIDE = 100;

const page = {
  grid:   document.getElementById("grid"),
  rows:   function()   { return document.querySelectorAll(".row" ) },
  cells:  function()   { return document.querySelectorAll(".cell") },
  button: function(id) { return document.querySelector(`button#${id}`) }
};

const state = {
  hue:    getRandomHue(),
  button: {
    single:     false,
    rainbow:    false,
    random:     false,
    lighten:    false,
    darken:     false,
    saturate:   false,
    desaturate: false
  }
}

newGrid(16);
initiateButtons();