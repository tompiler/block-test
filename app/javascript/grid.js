export const COLOURS = ["red", "green", "blue", "yellow"];
const MAX_X = 10;
const MAX_Y = 10;

export class Block {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.id = `${x}x${y}`; // added id variable
    this.colour = COLOURS[Math.floor(Math.random() * COLOURS.length)];
  }
}

export class BlockGrid {
  constructor() {
    this.grid = [];

    for (let x = 0; x < MAX_X; x++) {
      let col = [];
      for (let y = 0; y < MAX_Y; y++) {
        col.push(new Block(x, y));
      }

      this.grid.push(col);
    }

    return this;
  }

  render(el = document.querySelector("#gridEl")) {
    for (let x = 0; x < MAX_X; x++) {
      let id = "col_" + x;
      let colEl = document.createElement("div");
      colEl.className = "col";
      colEl.id = id;
      el.appendChild(colEl);

      for (let y = MAX_Y - 1; y >= 0; y--) {
        let block = this.grid[x][y],
          id = `block_${x}x${y}`,
          blockEl = document.createElement("div");

        blockEl.id = id;
        blockEl.className = "block";
        blockEl.style.background = block.colour;
        blockEl.addEventListener("click", evt => this.blockClicked(evt, block));
        colEl.appendChild(blockEl);
      }
    }

    return this;
  }

  getBlock([x, y]) {
    // returns a block object given an array
    // of x and y coords
    return this.grid[x] &&
      this.grid[x].find(block => {
        return block.y === y;
      });
  }

  adjacentColour(block) {
    // given a block, return all adjacent blocks of the same colour

    const { x, y, colour, active } = block;

    const leftBlock = this.getBlock([x - 1, y]);
    const rightBlock = this.getBlock([x + 1, y]);
    const upBlock = this.getBlock([x, y + 1]);
    const downBlock = this.getBlock([x, y - 1]);

    const adjacents = [];

    // 1. ensure that x is within 0-9 inc.
    // 2. ensure that if the colour of the adjacent block is the
    //    same colour as the 'target' block, add this to the array

    if (x - 1 >= 0 && leftBlock && leftBlock.colour === colour) {
      adjacents.push(leftBlock);
    }
    if (x + 1 < MAX_X && rightBlock && rightBlock.colour === colour) {
      adjacents.push(rightBlock);
    }
    if (y - 1 >= 0 && downBlock && downBlock.colour === colour) {
      adjacents.push(downBlock);
    }
    if (y + 1 < MAX_Y && upBlock && upBlock.colour === colour) {
      adjacents.push(upBlock);
    }

    return adjacents;
  }

  blockClicked(e, block) {
    var adjacents = [block];

    for (var i = 0; i < adjacents.length; i++) {
      var newAdjacents = this.adjacentColour(adjacents[i]);
      newAdjacents.forEach(d => {
        // use array of string ids for uniqueness
        var IDs = adjacents.map(adjacent => adjacent.id);
        if (!IDs.includes(d.id)) {
          adjacents.push(d);
        }
      });
    }

    adjacents.forEach(block => {
      var columnDiv = document.getElementById(`col_${block.x}`);
      var rowDiv = document.getElementById(`block_${block.id}`);
      setTimeout(
        (rowDiv, columnDiv) => {
          columnDiv.removeChild(rowDiv);
        },
        0,
        rowDiv,
        columnDiv
      );
    });

    adjacents.forEach(block => {
      // remove block from grid if we have clicked it
      this.grid[block.x].splice(block.y, 1);

      // for each block above this block, subtract 1
      // from the y value to account for the adjustment
      // to position correctly in anticipation of subsequent
      // click events
      for (var j = block.y; j < MAX_Y; j++) {
        if (this.grid[block.x][j] !== undefined) {
          this.grid[block.x][j].y -= 1;
        }
      }
    });
  }
}

window.addEventListener("DOMContentLoaded", () => new BlockGrid().render());
