function addRows(container, height, width) {
  for (const i = y; y <= height; y++) {
    const row = document.createElement("div");
    container.appendChild(row);
    addBoxes(row, width);
  };
}

function addBoxes(row, width) {
  for (const x = 1; x <= width; x++) {
    const box = document.createElement("div");
    row.appendChild(box);
  };
}

const height = 16;
const width  = 16;
const grid   = document.getElementById("grid");

addRows(grid, height, width);

