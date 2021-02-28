document.addEventListener("DOMContentLoaded", function (event) {
  start();
});

const start = () => {
  const gridsize = 10;
  const numberOfSquares = 14;
  const maxNumberOfConecctions = 2;

  // Init the grid
  let grid: Square[][] = [];

  for (let x = 0; x < gridsize; x++) {
    grid[x] = [];
    for (let y = 0; y < gridsize; y++) {
      grid[x][y] = null;
    }
  }

  // Create the middle square
  const middleSquare = new Square(gridsize / 2, gridsize / 2, numberOfSquares);
  grid[gridsize / 2][gridsize / 2] = middleSquare;

  // Create the connected squares and their connection
  let previousSquare = middleSquare;
  let generation = previousSquare.generation;
  let addedSquares: Square[] = [];
  for (let index = 0; index < numberOfSquares - 1; index++) {
    // Look at the previous square and choose a direction to create your new square
    const newCoordinates: { x: number; y: number } = findNewSquareCoordinates(
      grid,
      previousSquare
    );

    if (!newCoordinates) {
      addedSquares.pop();
      previousSquare = addedSquares[addedSquares.length - 1];
      generation = generation;
      index--;
      continue;
    }

    // Create the new square
    const newSquare = new Square(
      newCoordinates.x,
      newCoordinates.y,
      generation - 1
    );

    grid[newCoordinates.x][newCoordinates.y] = newSquare;
    addedSquares.push(newSquare);
    previousSquare = newSquare;
    generation = generation - 1;
  }

  // Draw the squares
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  Drawing.drawGrid(canvas, grid);

  // Printing the grid for debugging
  for (let y = 0; y < gridsize; y++) {
    let line = "";
    for (let x = 0; x < gridsize; x++) {
      line += `(${x},${y},${grid[x][y] ? "S" : "x"}), `;
    }
    console.log(line + "\n");
  }
};

const findNewSquareCoordinates = (
  grid: Square[][],
  previousSquare: Square
): { x: number; y: number } | null => {
  // Check that the candidate direction is not occupied and not outside the grid
  // (It possible to end up in a spiral pattern where no directions are valid)
  let options: Direction[] = [];

  if (
    previousSquare.y + 1 <= grid.length - 1 &&
    grid[previousSquare.x][previousSquare.y + 1] == null
  ) {
    options.push(Direction.NORTH);
  }
  if (
    previousSquare.y - 1 >= 0 &&
    grid[previousSquare.x][previousSquare.y - 1] == null
  ) {
    options.push(Direction.SOUTH);
  }
  if (
    previousSquare.x - 1 >= 0 &&
    grid[previousSquare.x - 1][previousSquare.y] == null
  ) {
    options.push(Direction.WEST);
  }
  if (
    previousSquare.x + 1 <= grid.length - 1 &&
    grid[previousSquare.x + 1][previousSquare.y] == null
  ) {
    options.push(Direction.EAST);
  }

  if (options.length == 0) return null;

  const chosenDirection: Direction =
    options[Math.floor(Math.random() * options.length)];
  switch (chosenDirection) {
    case Direction.NORTH:
      return { x: previousSquare.x, y: previousSquare.y + 1 };
    case Direction.SOUTH:
      return { x: previousSquare.x, y: previousSquare.y - 1 };
    case Direction.WEST:
      return { x: previousSquare.x - 1, y: previousSquare.y };
    case Direction.EAST:
      return { x: previousSquare.x + 1, y: previousSquare.y };
  }
};
