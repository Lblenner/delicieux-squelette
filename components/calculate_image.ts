
 type Cell = {
    content: number[],
    x: number,
    y: number,
    done: boolean
    last_request?: {
        secs_since_epoch: number
    }
} 

const HEIGHT = 21
const WIDTH = HEIGHT

addEventListener('message', (event: MessageEvent<Cell[]>) => {
    const cells: Cell[] = event.data;

    postMessage({
            message: "message processing..."
        })

        cells.forEach((cell) => {

            var ftab: number[] = []
            for (var y = 0; y < HEIGHT; y++) {
                for (var i = 0; i < WIDTH; i++) {
                    ftab.push(cell.content[i + y * WIDTH])

                }
            }

            var tab: number[] = []
            ftab.forEach((data) => {
                tab.push(data == 0 ? 0 : 0)
                tab.push(data == 0 ? 0 : 0)
                tab.push(data == 0 ? 0 : 0)
                tab.push(data == 0 ? 0 : 255)
            })

            const x = new Uint8ClampedArray(tab);
            let imageData = new ImageData(WIDTH, HEIGHT);
            imageData.data.set(x);

            postMessage({
                // message: "new image",
                imageData: imageData,
                x: WIDTH * cell.x,
                y: HEIGHT * cell.y,
            });

        })

        postMessage({
            message: "message process terminated"
        })

  })

  
