document.addEventListener("DOMContentLoaded", function (event) {
    start();
});
var start = function () {
    var gridsize = 10;
    var numberOfSquares = 14;
    var maxNumberOfConecctions = 2;
    var grid = [];
    for (var x = 0; x < gridsize; x++) {
        grid[x] = [];
        for (var y = 0; y < gridsize; y++) {
            grid[x][y] = null;
        }
    }
    var middleSquare = new Square(gridsize / 2, gridsize / 2, numberOfSquares);
    grid[gridsize / 2][gridsize / 2] = middleSquare;
    var previousSquare = middleSquare;
    var generation = previousSquare.generation;
    var addedSquares = [];
    for (var index = 0; index < numberOfSquares - 1; index++) {
        var newCoordinates = findNewSquareCoordinates(grid, previousSquare);
        if (!newCoordinates) {
            addedSquares.pop();
            previousSquare = addedSquares[addedSquares.length - 1];
            generation = generation;
            index--;
            continue;
        }
        var newSquare = new Square(newCoordinates.x, newCoordinates.y, generation - 1);
        grid[newCoordinates.x][newCoordinates.y] = newSquare;
        addedSquares.push(newSquare);
        previousSquare = newSquare;
        generation = generation - 1;
    }
    var canvas = document.getElementById("canvas");
    Drawing.drawGrid(canvas, grid);
    for (var y = 0; y < gridsize; y++) {
        var line = "";
        for (var x = 0; x < gridsize; x++) {
            line += "(" + x + "," + y + "," + (grid[x][y] ? "S" : "x") + "), ";
        }
        console.log(line + "\n");
    }
};
var findNewSquareCoordinates = function (grid, previousSquare) {
    var options = [];
    if (previousSquare.y + 1 <= grid.length - 1 &&
        grid[previousSquare.x][previousSquare.y + 1] == null) {
        options.push(Direction.NORTH);
    }
    if (previousSquare.y - 1 >= 0 &&
        grid[previousSquare.x][previousSquare.y - 1] == null) {
        options.push(Direction.SOUTH);
    }
    if (previousSquare.x - 1 >= 0 &&
        grid[previousSquare.x - 1][previousSquare.y] == null) {
        options.push(Direction.WEST);
    }
    if (previousSquare.x + 1 <= grid.length - 1 &&
        grid[previousSquare.x + 1][previousSquare.y] == null) {
        options.push(Direction.EAST);
    }
    if (options.length == 0)
        return null;
    var chosenDirection = options[Math.floor(Math.random() * options.length)];
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
var Direction;
(function (Direction) {
    Direction[Direction["NORTH"] = 0] = "NORTH";
    Direction[Direction["SOUTH"] = 1] = "SOUTH";
    Direction[Direction["WEST"] = 2] = "WEST";
    Direction[Direction["EAST"] = 3] = "EAST";
})(Direction || (Direction = {}));
var Drawing = (function () {
    function Drawing() {
    }
    Drawing.drawGrid = function (canvas, grid) {
        var ctx = canvas.getContext("2d");
        for (var y = 0; y < grid.length; y++) {
            for (var x = 0; x < grid.length; x++) {
                var isoCoords = Drawing.twoDToIso(x, y);
                if (grid[x][y]) {
                    Drawing.drawLayeredSquare(ctx, isoCoords.x, isoCoords.y, grid[x][y].generation, "#808080");
                }
                else {
                    Drawing.drawSquareOutline(ctx, "gray", Drawing.squarePaddingWidth +
                        isoCoords.x * (Drawing.squareWidth - Drawing.squareSpacing), Drawing.squarePaddingHeight +
                        isoCoords.y * (Drawing.squareHeight + Drawing.squareSpacing));
                }
                if (Drawing.drawCoordinates) {
                    Drawing.drawCoordinate(ctx, Drawing.squarePaddingWidth +
                        isoCoords.x * (Drawing.squareWidth - Drawing.squareSpacing), Drawing.squarePaddingHeight +
                        isoCoords.y * (Drawing.squareHeight + Drawing.squareSpacing), x, y);
                }
            }
        }
    };
    Drawing.drawLayeredSquare = function (ctx, x, y, layers, baseColor) {
        for (var index = layers; index > 0; index--) {
            Drawing.drawSquareFill(ctx, Drawing.adjust(baseColor, index * 10), Drawing.squarePaddingWidth +
                x * (Drawing.squareWidth - Drawing.squareSpacing), Drawing.squarePaddingHeight +
                y * (Drawing.squareHeight + Drawing.squareSpacing) +
                (index - 1) * 4 -
                (layers - 1) * 4);
        }
        Drawing.drawSquareOutline(ctx, "lightGray", Drawing.squarePaddingWidth +
            x * (Drawing.squareWidth - Drawing.squareSpacing), Drawing.squarePaddingHeight +
            y * (Drawing.squareHeight + Drawing.squareSpacing) -
            (layers - 1) * 4);
    };
    Drawing.drawCoordinate = function (ctx, x, y, xCoord, yCoord) {
        ctx.fillStyle = "black";
        ctx.fillText(xCoord + ", " + yCoord, x - Drawing.squareWidth / 6, y + Drawing.squareHeight / 12);
    };
    Drawing.drawSquareOutline = function (ctx, strokeStyle, x, y) {
        ctx.strokeStyle = strokeStyle;
        ctx.beginPath();
        ctx.moveTo(x - Drawing.squareWidth / 2, y);
        ctx.lineTo(x, y - Drawing.squareHeight / 2);
        ctx.lineTo(x + Drawing.squareWidth / 2, y);
        ctx.lineTo(x, y + Drawing.squareHeight / 2);
        ctx.lineTo(x - Drawing.squareWidth / 2, y);
        ctx.stroke();
    };
    Drawing.drawSquareFill = function (ctx, fillStyle, x, y) {
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.moveTo(x - Drawing.squareWidth / 2, y);
        ctx.lineTo(x, y - Drawing.squareHeight / 2);
        ctx.lineTo(x + Drawing.squareWidth / 2, y);
        ctx.lineTo(x, y + Drawing.squareHeight / 2);
        ctx.lineTo(x - Drawing.squareWidth / 2, y);
        ctx.fill();
    };
    Drawing.twoDToIso = function (x, y) {
        return { x: x - y, y: (x + y) / 2 };
    };
    Drawing.adjust = function (color, amount) {
        return ("#" +
            color
                .replace(/^#/, "")
                .replace(/../g, function (color) {
                return ("0" +
                    Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2);
            }));
    };
    Drawing.squareHeight = 40;
    Drawing.squareWidth = 60;
    Drawing.squarePaddingWidth = 600;
    Drawing.squarePaddingHeight = 40;
    Drawing.squareSpacing = 17;
    Drawing.drawCoordinates = false;
    return Drawing;
}());
var Square = (function () {
    function Square(x, y, generation) {
        this.x = x;
        this.y = y;
        this.generation = generation;
    }
    return Square;
}());
//# sourceMappingURL=connectedSquares.js.map