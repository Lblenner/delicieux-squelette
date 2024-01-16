import type { Cell } from "./components/types";

export type WorkerMessage = {
    imageData?: ImageData,
    x: number,
    y: number,
    message?: string

}

addEventListener('message', async (event: MessageEvent<{ cells: Cell[], res: number }>) => {
    const cells: Cell[] = event.data.cells;
    const res = event.data.res

    postMessage({
        message: "message processing..."
    })

    for (let cell of cells) {
        if (!cell.content) continue;
        if (cell.content.length != res * res * 4) {
            console.log(
                "Erreur : Cell(",
                cell.x,
                ",",
                cell.y,
                "), status: ",
                cell.done,
                ", len : ",
                cell.content.length
            );
            continue;
        }
        let imageData = new ImageData(res, res);
        imageData.data.set(cell.content);

        postMessage({
            imageData: imageData,
            x: res * cell.x,
            y: res * cell.y,
        });

        await new Promise(r => setTimeout(r, 10));
    }

    postMessage({
        message: "message process terminated"
    })

})