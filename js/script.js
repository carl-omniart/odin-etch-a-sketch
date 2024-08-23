// Grid

function newGrid(width, height = width) {
  clear(page.grid);
  addRows(page.grid, height, width);
}

function clear(element) {
  while (element.lastChild) element.removeChild(element.lastChild);
  return element;
}

function addRows(container, height, width) {
  for (let y = 0; y < height; y++) container.appendChild(newRow(width));
}

function addCells(row, width) {
  for (let x = 0; x < width; x++) row.appendChild(newCell());
}

function newRow(width) {
  const row = document.createElement("div");
  row.classList.add("row");
  addCells(row, width);
  return row;
}

function newCell() {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.style.opacity  = isOpaque ? "1.0" : "0.0";
  cell.style._opacity = isOpaque ? "0.0" : "1.0";
  cell.addEventListener("mouseover", onMouseOverCell);
  return cell;
}

// Mouse Over Handler

function onMouseOverCell(event) {
  const cell = event.target;
  setColor(cell);
  increaseOpacity(cell);
}

function setColor(cell) {
  if (isRainbow) hue = (hue + 1) % 360;
  cell.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
}

function increaseOpacity(cell) {
  const attribute = isOpaque ? "_opacity" : "opacity";
  cell.style[attribute] = Number(cell.style[attribute]) + 0.1;
}

// Buttons

function initiateButtons() {
  page.button(  "width").addEventListener("click", onClickButtonWidth  );
  page.button("rainbow").addEventListener("click", onClickButtonRainbow);
  page.button("opacity").addEventListener("click", onClickButtonOpacity);
}

function onClickButtonWidth() {
  const width = prompt("How many squares per side?");
  if (width > 100) width = 100;
  newGrid(width);
}

function onClickButtonRainbow() {
  isRainbow = !isRainbow;
}

function onClickButtonOpacity() {
  toggleCellOpacity();
  isOpaque = !isOpaque;
}

function toggleCellOpacity() {
  const [a, b] = isOpaque ? ["opacity", "_opacity"] : ["_opacity", "opacity"];
  for (const cell of page.cells()) {
    cell.style[a] = cell.style[b];
    cell.style[b] = "1.0";
  };
}

const page = {
  grid:   document.getElementById("grid"),
  rows:   function()   { return document.querySelectorAll(".row" ) },
  cells:  function()   { return document.querySelectorAll(".cell") },
  button: function(id) { return document.querySelector(`button#${id}`) }
};

let width     = 16;
let hue       = Math.floor(Math.random() * 360);
let isRainbow = false;
let isOpaque  = true;

newGrid(width);
initiateButtons();