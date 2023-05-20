import React, { useEffect, useRef, useState } from "react"
import { STROKE_TYPE } from "./tool_selector"
import { BORDER, Cell, HEIGHT, WIDTH, secondary_light, secondary_medium, useWindowSize } from "./consts"

const r0 = BORDER * BORDER
const r1 = r0 + WIDTH * BORDER
const r2 = r1 + BORDER * BORDER
const r3 = r2 + HEIGHT * BORDER
const r4 = r3 + HEIGHT * BORDER
const r5 = r4 + BORDER * BORDER
const r6 = r5 + WIDTH * BORDER
const r7 = r6 + BORDER * BORDER


export function DrawCanvas(props: {
    stroke_type: STROKE_TYPE,
    dessinRef: React.MutableRefObject<any[]>,
    contour: React.MutableRefObject<{ sideCells: Cell[], currentCell?: Cell }>
}) {


    let [isPressed, setPressed] = useState(false)

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const tempCanvasRef = useRef<HTMLCanvasElement>(null)
    const [cellSize, setCellSize] = useState(21)

    function getMousePos(evt: React.MouseEvent) {
        const canvas = canvasRef.current
        if (!canvas) return
        let rect = canvas.getBoundingClientRect();
        let real_pos = {
            x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
            y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
        };
        return {
            x: Math.floor(real_pos.x / cellSize),
            y: Math.floor(real_pos.y / cellSize)
        }
    }


    function draw(x: number, y: number, width: number, height: number, fillStyle: string) {
        const canvas = canvasRef.current
        if (!canvas) return
        const context = canvas.getContext('2d')
        if (!context) return

        context.fillStyle = fillStyle
        context.fillRect(x, y, width, height)
    }

    function apply_tool(event: React.MouseEvent) {
        let posResult = getMousePos(event)
        if (!posResult) {
            return
        }
        let pos = posResult as { x: number, y: number }

        // border limits
        if (pos.x < BORDER || pos.x >= WIDTH + BORDER) {
            return
        }

        if (pos.y < BORDER || pos.y >= HEIGHT + BORDER) {
            return
        }


        let fillStyle = ""
        if (props.stroke_type === STROKE_TYPE.PEN) {
            fillStyle = 'black'
        } else {
            fillStyle = 'white'
        }

        draw(pos.x * cellSize, pos.y * cellSize, cellSize, cellSize, fillStyle)

        const next_dessin = props.dessinRef.current.map((pixel, index) => {
            if (index === (pos.x - BORDER + WIDTH * (pos.y - BORDER))) {
                return fillStyle === 'black' ? 1 : 0
            }
            return pixel;

        })
        props.dessinRef.current = next_dessin

    }

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        // background
        draw(0, 0, canvas.width, canvas.height, 'white')

        if (!props.contour.current.currentCell) {
            console.log("error not currentCell")
            return
        }
        //Array(2*BORDER * (2*BORDER + WIDTH + HEIGHT)).fill(0)
        let sideDessins = side_dessins(props.contour.current.sideCells, props.contour.current.currentCell)
        // draw sides
        sideDessins.forEach((pixel, index) => {

            let color = pixel === 1 ? "black" : pixel === -1 ? secondary_light : pixel === -2 ? secondary_medium : "white";
            if (index < r0) {
                draw((index % BORDER) * cellSize, Math.floor(index / BORDER) * cellSize, cellSize, cellSize, color);
            } else if (index < r1) {
                draw(BORDER * cellSize + ((index - r0) % WIDTH) * cellSize, Math.floor((index - r0) / WIDTH) * cellSize, cellSize, cellSize, color);
            } else if (index < r2) {
                draw((BORDER + WIDTH) * cellSize + ((index - r1) % BORDER) * cellSize, Math.floor((index - r1) / BORDER) * cellSize, cellSize, cellSize, color);
            } else if (index < r3) {
                draw(((index - r2) % BORDER) * cellSize, BORDER * cellSize + Math.floor((index - r2) / BORDER) * cellSize, cellSize, cellSize, color);
            } else if (index < r4) {
                draw((BORDER + WIDTH) * cellSize + ((index - r3) % BORDER) * cellSize, BORDER * cellSize + Math.floor((index - r3) / BORDER) * cellSize, cellSize, cellSize, color);
            }
            else if (index < r5) {
                draw(((index - r4) % BORDER) * cellSize, (BORDER + HEIGHT) * cellSize + Math.floor((index - r4) / BORDER) * cellSize, cellSize, cellSize, color);
            }
            else if (index < r6) {
                draw(BORDER * cellSize + ((index - r5) % WIDTH) * cellSize, (BORDER + HEIGHT) * cellSize + Math.floor((index - r5) / WIDTH) * cellSize, cellSize, cellSize, color);
            }
            else if (index < r7) {
                draw((BORDER + WIDTH) * cellSize + ((index - r6) % BORDER) * cellSize, (BORDER + HEIGHT) * cellSize + Math.floor((index - r6) / BORDER) * cellSize, cellSize, cellSize, color);
            } else {
                console.log("SIDE TOO BIG")
            }
        })

        // draw limit
        draw(BORDER * cellSize, BORDER * cellSize - 1, WIDTH * cellSize, 1, 'red')
        draw(BORDER * cellSize, (HEIGHT + BORDER) * cellSize, WIDTH * cellSize, 1, 'red')
        draw(BORDER * cellSize - 1, BORDER * cellSize, 1, HEIGHT * cellSize, 'red')
        draw((HEIGHT + BORDER) * cellSize, BORDER * cellSize, 1, HEIGHT * cellSize, 'red')

    }, [props.contour,cellSize])

    const handleDown: React.MouseEventHandler<HTMLCanvasElement> = event => {
        setPressed(true);
        apply_tool(event)
    }
    const handleUp: React.MouseEventHandler<HTMLCanvasElement> = event => {
        setPressed(false);
    }
    const handleEnter: React.MouseEventHandler<HTMLCanvasElement> = event => {
        setPressed(event.buttons === 1);
    }

    const handleMove: React.MouseEventHandler<HTMLCanvasElement> = event => {
        if (isPressed) {
            apply_tool(event)
        }
    }

    let w = useWindowSize().width ?? 1200;

    if (w < 600 && cellSize > 20) {
        setCellSize(10)
    }
    if (w > 800 && cellSize < 20) {
        setCellSize(21)
    }

    return <div>
        <canvas
            ref={canvasRef}
            width={(2 * BORDER + WIDTH) * cellSize}
            height={(2 * BORDER + HEIGHT) * cellSize}
            onMouseDown={handleDown}
            onMouseUp={handleUp}
            onMouseEnter={handleEnter}
            onMouseLeave={handleUp}
            onMouseMove={handleMove}
        />
        <canvas
            ref={tempCanvasRef}
            hidden={true}
        />
    </div>
}



function epoch_ten_minute_ago() { return (Math.floor(Date.now() / 1000) - 600) }
function rrr(sideCell: Cell, size: number) {
    if (sideCell.last_request) {
        let difference = epoch_ten_minute_ago() - sideCell.last_request.secs_since_epoch
        if (difference < 0) {
            return Array(size).fill(-2)
        } else {
            return Array(size).fill(-1)
        }

    } else {
        return Array(size).fill(-1)
    }
}

function side_dessins(sideCells: Cell[], currentCell: Cell): number[] {

    let topLeftCorner: number[] = Array(BORDER * BORDER).fill(-1)
    let topSide: number[] = Array(BORDER * WIDTH).fill(-1)
    let topRightCorner: number[] = Array(BORDER * BORDER).fill(-1)
    let leftSide: number[] = Array(BORDER * HEIGHT).fill(-1)
    let rightSide: number[] = Array(BORDER * HEIGHT).fill(-1)
    let bottomLeftCorner: number[] = Array(BORDER * BORDER).fill(-1)
    let bottomSide: number[] = Array(BORDER * WIDTH).fill(-1)
    let bottomRightCorner: number[] = Array(BORDER * BORDER).fill(-1)


    for (let sideCell of sideCells) {
        if (sideCell.x == currentCell.x - 1) {
            if (sideCell.y == currentCell.y + 1) {
                if (sideCell.done === true) {
                    bottomLeftCorner = bottom_left_corner(sideCell.content)
                } else {
                    bottomLeftCorner = rrr(sideCell, BORDER * BORDER)
                }
            }
            else if (sideCell.y == currentCell.y - 1) {
                if (sideCell.done === true) {
                    topLeftCorner = top_left_corner(sideCell.content)
                } else {
                    topLeftCorner = rrr(sideCell, BORDER * BORDER)
                }
            }
            else if (sideCell.y == currentCell.y) {
                if (sideCell.done === true) {
                    leftSide = left_side(sideCell.content)
                } else {
                    leftSide = rrr(sideCell, BORDER * HEIGHT)
                }
            } else {
                console.log("error side_cell too far y received")

            }
        }
        else if (sideCell.x == currentCell.x + 1) {
            if (sideCell.y == currentCell.y + 1) {
                if (sideCell.done === true) {
                    bottomRightCorner = bottom_right_corner(sideCell.content)
                    //bottomRightCorner = Array(BORDER * BORDER).fill(0)
                } else {
                    bottomRightCorner = rrr(sideCell, BORDER * BORDER)
                }
            }
            else if (sideCell.y == currentCell.y - 1) {
                if (sideCell.done === true) {
                    topRightCorner = top_right_corner(sideCell.content)
                    //topRightCorner = Array(BORDER * BORDER).fill(0)
                } else {
                    topRightCorner = rrr(sideCell, BORDER * BORDER)
                }
            }
            else if (sideCell.y == currentCell.y) {
                if (sideCell.done === true) {
                    rightSide = right_side(sideCell.content)
                    //rightSide = Array(HEIGHT * BORDER).fill(0)

                } else {
                    rightSide = rrr(sideCell, BORDER * HEIGHT)
                }
            } else {
                console.log("error side_cell too far y received")
            }
        }
        else if (sideCell.x == currentCell.x) {
            if (sideCell.y == currentCell.y + 1) {
                if (sideCell.done === true) {
                    bottomSide = bottom_side(sideCell.content)
                    //bottomSide = Array(BORDER * WIDTH).fill(0)
                } else {
                    bottomSide = rrr(sideCell, BORDER * WIDTH)
                }
            }
            else if (sideCell.y == currentCell.y - 1) {
                if (sideCell.done === true) {
                    topSide = top_side(sideCell.content)
                    //topSide = Array(BORDER * WIDTH).fill(-2)
                } else {
                    topSide = rrr(sideCell, BORDER * WIDTH)
                }
            }
            else if (sideCell.y == currentCell.y) {
                //console.log("own cell received")
            } else {
                console.log("error side_cell too far y received")
            }
        } else {
            console.log("error side_cell too far x received ")
        }
    }

    let array = topLeftCorner.concat(topSide).concat(topRightCorner.concat(leftSide.concat(rightSide.concat(bottomLeftCorner.concat(bottomSide.concat(bottomRightCorner))))));

    return array

}

function top_left_corner(content: number[]): number[] {
    let array: number[] = [];
    for (let i = 0; i < BORDER; i++) {
        array = array.concat(
            content.slice(
                WIDTH * HEIGHT - (BORDER - 1 - i) * WIDTH - BORDER,
                WIDTH * HEIGHT - (BORDER - 1 - i) * WIDTH
            )
        )
    }
    return array;
}

function top_side(content: number[]): number[] {
    return content.slice(
        WIDTH * HEIGHT - WIDTH * BORDER,
        WIDTH * HEIGHT
    )
}
function top_right_corner(content: number[]): number[] {
    let array: number[] = [];
    for (let i = 0; i < BORDER; i++) {
        array = array.concat(
            content.slice(
                WIDTH * HEIGHT - (BORDER - i) * WIDTH,
                WIDTH * HEIGHT - (BORDER - i) * WIDTH + BORDER
            )
        )
    }
    return array;
}
function left_side(content: number[]): number[] {
    let array: number[] = []
    for (let i = 0; i < HEIGHT; i++) {
        array = array.concat(content.slice((i + 1) * WIDTH - BORDER, (i + 1) * WIDTH))
    }
    return array

}

function right_side(content: number[]): number[] {
    let array: number[] = []
    for (let i = 0; i < HEIGHT; i++) {
        array = array.concat(content.slice(i * WIDTH, i * WIDTH + BORDER))
    }
    return array
}

function bottom_left_corner(content: number[]): number[] {
    let r: number[] = []
    for (let i = 0; i < BORDER; i++) {
        r = r.concat(content.slice((i + 1) * WIDTH - BORDER, (i + 1) * WIDTH))
    }
    return r
}

function bottom_side(content: number[]): number[] {
    return content.slice(
        0,
        WIDTH * BORDER
    )
}

function bottom_right_corner(content: number[]): number[] {
    let array: number[] = []
    for (let i = 0; i < BORDER; i++) {
        array = array.concat(content.slice(i * WIDTH, i * WIDTH + BORDER))
    }
    return array
}


