import { useEffect, useRef } from "react";
import { Cell } from "./consts";
import InfiniteCanvas from "ef-infinite-canvas"


type CanvasProps = {
    canvasWidth: number;
    canvasHeight: number;
    cells: Cell[]
};

export type ER = {
    imageData?: ImageData,
    x: number,
    y: number,
    message?: string

}

const CANV_SIZE = 400
// const CANV_SIZE = 2000

export function Canvas(props: CanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const workerRef = useRef<Worker>()
    const cellsRef = useRef<{x:number,y:number}[]>([]);

    useEffect(() => {
        if (canvasRef.current) {
            console.log("start worker");
            var infinite_canvas = new InfiniteCanvas(canvasRef.current,);
            infinite_canvas.greedyGestureHandling = true
            var ctx = infinite_canvas.getContext("2d");
            ctx.shadowBlur = 0;
            ctx.imageSmoothingEnabled = false;
            // ctx.fillStyle = "blue";
            // ctx.fillRect(0, 0, CANV_SIZE, CANV_SIZE);
            // ctx.imageSmoothingEnabled = false;
            workerRef.current = new Worker(new URL('./calculate_image.ts', import.meta.url))
            cellsRef.current = [];

            workerRef.current.onmessage = (e: MessageEvent<ER>) => {
                if (e.data.message) {
                    console.log("worker: ", e.data.message)
                }
                if (e.data.imageData &&  cellsRef.current && !cellsRef.current.find((elem) => elem.x === e.data.x && elem.y === e.data.y)) {
                    ctx.putImageData(e.data.imageData, e.data.x + props.canvasWidth, e.data.y + props.canvasHeight)
                    cellsRef.current.push({x:e.data.x,y:e.data.y})
                    // setChange(!change)
                }
            };
            //
            return () => {
                workerRef.current?.terminate()
            }
        }
    }, [props.canvasHeight, props.canvasWidth])

    useEffect(() => {
        if (workerRef.current && props.cells.length != 0) {
            workerRef.current.postMessage(props.cells)
        }
    },[props.cells])

    console.log("re")

    return <canvas
        className="bg-gray-200"
        ref={canvasRef}
        width={props.canvasWidth*2}
        height={props.canvasHeight*2}
        style={{
            border: "2px solid #000",
            width: `${props.canvasWidth}px`,
            height: `${props.canvasHeight}px`,
            // imageRendering: "crisp-edges"
        }}
    />

}