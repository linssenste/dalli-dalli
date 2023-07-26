import Delaunator from "delaunator";
import { Delaunay } from "d3-delaunay";

export type Point = [number, number];
export type Triangle = Array<{ x: number; y: number }>;
export type Rectangle = { x: number; y: number; width: number; height: number };
export type Hexagon = {
    points: Point[];
};

export type VoronoiPoint = { x: number; y: number };
export type VoronoiCell = Array<VoronoiPoint>;

function shuffleArray<T>(array: T[]): T[] {
    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }

    return array.sort(() => 0.5 - Math.random());
}

export function generateTriangles(
    width: number,
    height: number,
    numPoints: number
): Triangle[] {
    let points: Point[] = [];

    // Generate random points for the triangles.
    for (let i = 0; i < numPoints; i++) {
        points.push([
            Math.random() * width, // x-coordinate
            Math.random() * height, // y-coordinate
        ]);
    }

    // Add the corners of the canvas to the points list.
    points.push([0, 0], [0, height], [width, 0], [width, height]);

    // Use the Delaunator library to generate a Delaunay triangulation.
    let delaunay = Delaunator.from(points);
    let triangles = delaunay.triangles;

    // Format the triangles array.
    let formattedTriangles: Triangle[] = [];
    for (let i = 0; i < triangles.length; i += 3) {
        formattedTriangles.push([
            { x: points[triangles[i]][0], y: points[triangles[i]][1] },
            { x: points[triangles[i + 1]][0], y: points[triangles[i + 1]][1] },
            { x: points[triangles[i + 2]][0], y: points[triangles[i + 2]][1] },
        ]);
    }

    return shuffleArray(formattedTriangles);
}

export function generateRectangles(
    width: number,
    height: number,
    number: number
): Rectangle[] {
    // Calculate two factors that are as equal as possible
    let factor1 = Math.ceil(Math.sqrt(number));
    while (number % factor1 !== 0) {
        factor1++;
    }
    let factor2 = number / factor1;

    // Calculate the width and height of each rectangle in the grid
    let rectangleWidth = width / factor1;
    let rectangleHeight = height / factor2;

    // Generate the rectangles
    let rectangles: Rectangle[] = [];
    for (let i = 0; i < factor1; i++) {
        for (let j = 0; j < factor2; j++) {
            rectangles.push({
                x: i * rectangleWidth,
                y: j * rectangleHeight,
                width: rectangleWidth,
                height: rectangleHeight,
            });
        }
    }

    // Shuffle the rectangles using the Fisher-Yates algorithm
    for (let i = rectangles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rectangles[i], rectangles[j]] = [rectangles[j], rectangles[i]];
    }

    return shuffleArray(rectangles);
}

function generateHexagon(x: number, y: number, size: number): Hexagon {
    const points: Point[] = [];
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        points.push({
            x: x + size * Math.cos(angle),
            y: y + size * Math.sin(angle),
        });
    }
    return { points };
}
export function generateHexagons(
    width: number,
    height: number,
    number: number
): Hexagon[] {
    const side = Math.sqrt(
        (width * height) / (((3 * Math.sqrt(3)) / 2) * number)
    );
    const hexHeight = Math.sqrt(3) * side;
    const hexWidth = 2 * side;
    const horizHex = Math.ceil(width / ((3 / 2) * side));
    const vertHex = Math.ceil(height / hexHeight);

    let hexagons: Hexagon[] = [];

    for (let row = 0; row <= vertHex; row++) {
        for (let col = 0; col <= horizHex; col++) {
            let x = col * 1.5 * side;
            let y = row * hexHeight;

            if (col % 2 !== 0) {
                // shift every other column
                y += hexHeight / 2;
            }

            let hexagon = generateHexagon(x, y, side);
            hexagons.push(hexagon);
        }
    }

    return shuffleArray(hexagons);
}

export function generateVoronoiDiagram(
    width: number,
    height: number,
    numPoints: number
): VoronoiCell[] {
    let points: Point[] = [];

    // Generate random points for the triangles.
    for (let i = 0; i < numPoints; i++) {
        let point = [
            Math.random() * width, // x-coordinate
            Math.random() * height, // y-coordinate
        ];
        points.push(point);
    }

    // Add the corners of the canvas to the points list.
    points.push([0, 0], [0, height], [width, 0], [width, height]);

    // Use the d3-delaunay library to generate a Delaunay triangulation.
    let delaunay = Delaunay.from(points);

    // Generate the Voronoi diagram
    let voronoi = delaunay.voronoi([0, 0, width, height]);

    // Format the Voronoi cells array.
    let formattedCells: VoronoiCell[] = [];
    for (let cell of voronoi.cellPolygons()) {
        let formattedCell: VoronoiCell = [];
        for (let point of cell) {
            formattedCell.push({ x: point[0], y: point[1] });
        }
        formattedCells.push(formattedCell);
    }

    return shuffleArray(formattedCells);
}
