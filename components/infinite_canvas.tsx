'use client';

import {
    useEffect,
    useCallback,
    useLayoutEffect,
    useRef,
    useState
} from "react";
import * as React from "react";
import { Cell, HEIGHT, PIXEL_SIZE, WIDTH } from "./consts";

const useIsomorphicEffect = () => {
    return typeof window !== 'undefined' ? useLayoutEffect : useEffect
}

type CanvasProps = {
    canvasWidth: number;
    canvasHeight: number;
    cells: Cell[]
};

type Point = {
    x: number;
    y: number;
};

const ORIGIN = Object.freeze({ x: 0, y: 0 });


const ratio = () => typeof window !== 'undefined' ? window?.devicePixelRatio : 1;

function diffPoints(p1: Point, p2: Point) {
    return { x: p1.x - p2.x, y: p1.y - p2.y };
}

function addPoints(p1: Point, p2: Point) {
    return { x: p1.x + p2.x, y: p1.y + p2.y };
}

function scalePoint(p1: Point, scale: number) {
    return { x: p1.x / scale, y: p1.y / scale };
}

const ZOOM_SENSITIVITY = 500; // bigger for lower zoom per scroll

export function Canvas(props: CanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const myContext = useRef<CanvasRenderingContext2D | null>(null);
    const [scale, setScale] = useState<number>(1);
    const [offset, setOffset] = useState<Point>(ORIGIN);
    const [mousePos, setMousePos] = useState<Point>(ORIGIN);
    const [viewportTopLeft, setViewportTopLeft] = useState<Point>(ORIGIN);
    const isResetRef = useRef<boolean>(false);
    const lastMousePosRef = useRef<Point>(ORIGIN);
    const lastOffsetRef = useRef<Point>(ORIGIN);

    let offsety = props.canvasHeight / 2
    let offsetx = props.canvasWidth / 2
    // update last offset
    useEffect(() => {
        lastOffsetRef.current = offset;
    }, [offset]);

    // reset
    const reset = useCallback(
        (context: CanvasRenderingContext2D) => {
            if (context && !isResetRef.current) {
                context.imageSmoothingEnabled = false;

                // adjust for device pixel density
                context.canvas.width = props.canvasWidth * ratio();
                context.canvas.height = props.canvasHeight * ratio();
                context.scale(ratio(), ratio());
                setScale(ratio());

                // reset state and refs
                myContext.current = context;
                setOffset(ORIGIN);
                setMousePos(ORIGIN);
                setViewportTopLeft(ORIGIN);
                lastOffsetRef.current = ORIGIN;
                lastMousePosRef.current = ORIGIN;

                // this thing is so multiple resets in a row don't clear canvas
                isResetRef.current = true;
            }
        },
        [props.canvasWidth, props.canvasHeight]
    );

    // functions for panning
    const mouseMove = useCallback(
        (event: MouseEvent) => {
            if (myContext.current) {
                const lastMousePos = lastMousePosRef.current;
                const currentMousePos = { x: event.pageX, y: event.pageY }; // use document so can pan off element
                lastMousePosRef.current = currentMousePos;

                const mouseDiff = diffPoints(currentMousePos, lastMousePos);
                setOffset((prevOffset) => addPoints(prevOffset, mouseDiff));
            }
        },
        [myContext]
    );

    const mouseUp = useCallback(() => {
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);
    }, [mouseMove]);

    const startPan = useCallback(
        (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
            document.addEventListener("mousemove", mouseMove);
            document.addEventListener("mouseup", mouseUp);
            lastMousePosRef.current = { x: event.pageX, y: event.pageY };
        },
        [mouseMove, mouseUp]
    );

    // setup canvas and set context
    useIsomorphicEffect()(() => {
        if (canvasRef.current) {
            // get new drawing context
            const renderCtx = canvasRef.current.getContext("2d", { willReadFrequently: true });

            if (renderCtx) {
                reset(renderCtx);
            }
        }
    }, [reset, props.canvasHeight, props.canvasWidth, props.cells]);

    // pan when offset or scale changes
    useIsomorphicEffect()(() => {
        if (myContext.current && lastOffsetRef.current) {
            const offsetDiff = scalePoint(
                diffPoints(offset, lastOffsetRef.current),
                scale
            );
            myContext.current.translate(offsetDiff.x, offsetDiff.y);
            setViewportTopLeft((prevVal) => diffPoints(prevVal, offsetDiff));
            isResetRef.current = false;
        }
    }, [myContext, offset, scale]);

    // draw
    useIsomorphicEffect()(() => {
        if (myContext.current) {

            // clear canvas but maintain transform
            const storedTransform = myContext.current.getTransform();
            myContext.current.canvas.width = myContext.current.canvas.width;
            myContext.current.setTransform(storedTransform);


            props.cells.forEach((cell) => {
                for (var i = 0; i < HEIGHT * WIDTH; i++) {
                    myContext.current!.fillStyle = cell.content[i] == 1 ? 'black' : 'lightgray'
                    myContext.current!.fillRect(
                        offsetx + PIXEL_SIZE * (WIDTH * cell.x + (i % WIDTH)),
                        offsety + PIXEL_SIZE * (HEIGHT * cell.y + Math.floor(i / HEIGHT)),
                        PIXEL_SIZE,
                        PIXEL_SIZE
                    );

                }

            })

            // context.arc(viewportTopLeft.x, viewportTopLeft.y, 5, 0, 2 * Math.PI);
            // context.fillStyle = "red";
            // context.fill();
        }
    }, [
        props.canvasWidth,
        props.canvasHeight,
        myContext,
        scale,
        props.cells,
        offset,
        viewportTopLeft
    ]);

    // add event listener on canvas for mouse position
    useEffect(() => {
        const canvasElem = canvasRef.current;
        if (canvasElem === null) {
            return;
        }

        function handleUpdateMouse(event: MouseEvent) {
            event.preventDefault();
            if (canvasRef.current) {
                const viewportMousePos = { x: event.clientX, y: event.clientY };
                const topLeftCanvasPos = {
                    x: canvasRef.current.offsetLeft,
                    y: canvasRef.current.offsetTop
                };
                setMousePos(diffPoints(viewportMousePos, topLeftCanvasPos));
            }
        }

        canvasElem.addEventListener("mousemove", handleUpdateMouse);
        canvasElem.addEventListener("wheel", handleUpdateMouse);
        return () => {
            canvasElem.removeEventListener("mousemove", handleUpdateMouse);
            canvasElem.removeEventListener("wheel", handleUpdateMouse);
        };
    }, []);

    // add event listener on canvas for zoom
    useEffect(() => {
        const canvasElem = canvasRef.current;
        if (canvasElem === null) {
            return;
        }

        // this is tricky. Update the viewport's "origin" such that
        // the mouse doesn't move during scale - the 'zoom point' of the mouse
        // before and after zoom is relatively the same position on the viewport
        function handleWheel(event: WheelEvent) {
            event.preventDefault();
            if (myContext.current) {

                if (scale > 20 && event.deltaY < 0) {
                    return
                }
                if (scale < 0.7 && event.deltaY > 0) {
                    return
                }
                const zoom = Math.floor((1 - event.deltaY / ZOOM_SENSITIVITY) * 10) / 10;

                const viewportTopLeftDelta = {
                    x: (mousePos.x / scale) * (1 - 1 / zoom),
                    y: (mousePos.y / scale) * (1 - 1 / zoom)
                };
                const newViewportTopLeft = addPoints(
                    viewportTopLeft,
                    viewportTopLeftDelta
                );

                myContext.current.translate(viewportTopLeft.x, viewportTopLeft.y);

                myContext.current.scale(zoom, zoom);

                myContext.current.translate(-newViewportTopLeft.x, -newViewportTopLeft.y);
                setViewportTopLeft(newViewportTopLeft);

                setScale(scale * zoom);

                isResetRef.current = false;

            }
        }

        canvasElem.addEventListener("wheel", handleWheel);
        return () => canvasElem.removeEventListener("wheel", handleWheel);
    }, [myContext, mousePos.x, mousePos.y, viewportTopLeft, scale]);

    return (
        <div>
            <canvas className="bg-gray-200"
                onMouseDown={startPan}
                ref={canvasRef}
                width={props.canvasWidth * ratio()}
                height={props.canvasHeight * ratio()}
                style={{
                    border: "2px solid #000",
                    width: `${props.canvasWidth}px`,
                    height: `${props.canvasHeight}px`
                }}
            ></canvas>
        </div>
    );
}
