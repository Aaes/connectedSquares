class Drawing {
  private static squareHeight = 40;
  private static squareWidth = 60;
  private static squarePaddingWidth = 600;
  private static squarePaddingHeight = 40;
  private static squareSpacing = 17;
  private static drawCoordinates = false;

  public static drawGrid(canvas: HTMLCanvasElement, grid: Square[][]) {
    let ctx = canvas.getContext("2d");

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid.length; x++) {
        let isoCoords = Drawing.twoDToIso(x, y);
        if (grid[x][y]) {
          Drawing.drawLayeredSquare(
            ctx,
            isoCoords.x,
            isoCoords.y,
            grid[x][y].generation,
            "#808080"
          );
        } else {
          Drawing.drawSquareOutline(
            ctx,
            "gray",
            Drawing.squarePaddingWidth +
              isoCoords.x * (Drawing.squareWidth - Drawing.squareSpacing),
            Drawing.squarePaddingHeight +
              isoCoords.y * (Drawing.squareHeight + Drawing.squareSpacing)
          );
        }
        if (Drawing.drawCoordinates) {
          Drawing.drawCoordinate(
            ctx,
            Drawing.squarePaddingWidth +
              isoCoords.x * (Drawing.squareWidth - Drawing.squareSpacing),
            Drawing.squarePaddingHeight +
              isoCoords.y * (Drawing.squareHeight + Drawing.squareSpacing),
            x,
            y
          );
        }
      }
    }
  }

  public static drawLayeredSquare(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    layers: number,
    baseColor: string
  ) {
    for (let index = layers; index > 0; index--) {
      Drawing.drawSquareFill(
        ctx,
        Drawing.adjust(baseColor, index * 10),
        Drawing.squarePaddingWidth +
          x * (Drawing.squareWidth - Drawing.squareSpacing),
        Drawing.squarePaddingHeight +
          y * (Drawing.squareHeight + Drawing.squareSpacing) +
          (index - 1) * 4 -
          (layers - 1) * 4
      );
    }

    // Draw the outline of the top square
    Drawing.drawSquareOutline(
      ctx,
      "lightGray",
      Drawing.squarePaddingWidth +
        x * (Drawing.squareWidth - Drawing.squareSpacing),
      Drawing.squarePaddingHeight +
        y * (Drawing.squareHeight + Drawing.squareSpacing) -
        (layers - 1) * 4
    );
  }

  public static drawCoordinate(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    xCoord: number,
    yCoord: number
  ) {
    ctx.fillStyle = "black";
    ctx.fillText(
      `${xCoord}, ${yCoord}`,
      x - Drawing.squareWidth / 6,
      y + Drawing.squareHeight / 12
    );
  }

  public static drawSquareOutline(
    ctx: CanvasRenderingContext2D,
    strokeStyle: string,
    x: number,
    y: number
  ) {
    ctx.strokeStyle = strokeStyle;
    ctx.beginPath();
    ctx.moveTo(x - Drawing.squareWidth / 2, y);
    ctx.lineTo(x, y - Drawing.squareHeight / 2);
    ctx.lineTo(x + Drawing.squareWidth / 2, y);
    ctx.lineTo(x, y + Drawing.squareHeight / 2);
    ctx.lineTo(x - Drawing.squareWidth / 2, y);
    ctx.stroke();
  }

  public static drawSquareFill(
    ctx: CanvasRenderingContext2D,
    fillStyle: string,
    x: number,
    y: number
  ) {
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.moveTo(x - Drawing.squareWidth / 2, y);
    ctx.lineTo(x, y - Drawing.squareHeight / 2);
    ctx.lineTo(x + Drawing.squareWidth / 2, y);
    ctx.lineTo(x, y + Drawing.squareHeight / 2);
    ctx.lineTo(x - Drawing.squareWidth / 2, y);
    ctx.fill();
  }

  // Credit to https://gamedevelopment.tutsplus.com/tutorials/creating-isometric-worlds-a-primer-for-game-developers--gamedev-6511
  public static twoDToIso(x: number, y: number): { x: number; y: number } {
    return { x: x - y, y: (x + y) / 2 };
  }

  // https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
  private static adjust(color: string, amount: number) {
    return (
      "#" +
      color
        .replace(/^#/, "")
        .replace(/../g, (color) =>
          (
            "0" +
            Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(
              16
            )
          ).substr(-2)
        )
    );
  }
}
