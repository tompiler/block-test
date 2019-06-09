export const COLOURS = ["red", "green", "blue", "yellow"];
const MAX_X = 10;
const MAX_Y = 10;

export class Block {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.id = `${x}x${y}`;
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
        blockEl.innerHTML = id;
        blockEl.className = "block";
        blockEl.style.background = block.colour;
        blockEl.addEventListener("click", evt => this.blockClicked(evt, block));
        colEl.appendChild(blockEl);
      }
    }

    return this;
  }

  getBlock([x, y]) {
    return this.grid[x] &&
      this.grid[x].find(block => {
        return block.y === y;
      });
  }

  adjacentColour(block) {
    // given a block, return all adjacent blocks of the same colour

    console.log("BLOCK:", block);
    const { x, y, colour, id, active } = block;

    const leftBlock = this.getBlock([x - 1, y]);
    const rightBlock = this.getBlock([x + 1, y]);
    const upBlock = this.getBlock([x, y + 1]);
    const downBlock = this.getBlock([x, y - 1]);

    console.log(leftBlock, rightBlock, upBlock, downBlock);
    const adjacents = [block];
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
    // console.log(...adjacents);
    return adjacents;
  }

  blockClicked(e, block) {
    console.log("BLOCK:", block);
    var adjacents = this.adjacentColour(block);
    // var IDs = new Set(adjacents.map(d => d.id));
    console.log("Adjacents:", adjacents);
    for (var i = 0; i < adjacents.length; i++) {
      var newAdjacents = this.adjacentColour(adjacents[i]);
      // newAdjacents.map(d => d.id).forEach(d => IDs.add(d));
      // var newIDs = newAdjacents.map(d => d.id);
      // console.log("NewAdjacents:", newAdjacents);
      newAdjacents.forEach(d => {
        var IDs = adjacents.map(adjacent => adjacent.id);
        if (!IDs.includes(d.id)) {
          adjacents.push(d);
        }
      });
    }

    // var columnDiv = document.getElementById(`col_${block.x}`);
    // var rowDiv = document.getElementById(`block_${block.id}`);
    // rowDiv.className += "-removed";
    // // if (active) {
    // setTimeout(
    //   () => {
    //     columnDiv.removeChild(rowDiv);
    //   },
    //   0
    // );

    console.log("Adjacents:", adjacents);
  }
}

window.addEventListener("DOMContentLoaded", () => new BlockGrid().render());
