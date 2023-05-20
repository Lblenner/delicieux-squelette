import { Cell, DEFAULT_ROOM, MYURL, lovelo, requestOptions, useWindowSize } from "@/components/consts";
import { Canvas } from "@/components/infinite_canvas";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export default function Dessiner() {

    let [cells, setCells] = useState<Cell[]>([]);
    const router = useRouter();

    let id_room = Number(router.query.room)
    if (isNaN(id_room)) {
        id_room = DEFAULT_ROOM
    }

    const requestCells = useCallback(async (i: number) => {
        try {
            let response = await fetch(MYURL + `/show/${i}`, requestOptions);
            let data = await response.json();
            console.log("requestCells/", i, " : ", data)

            if (data.error) {

            } else {

                setCells(data)

            }
        } catch (e) {
            console.log("err:", e)
        }

    }, [])

    const size = useWindowSize();

    return <main className='flex flex-col w-full items-center max-md:items-start p-4'>
        <Canvas canvasHeight={Math.min(Math.max((size.height??700),400)- 230, 500)} canvasWidth={Math.min((size.width ?? 700) - 100, 500)} cells={cells}></Canvas>
        <button className={`${lovelo.className} text-white text-small md:text-xl hover:bg-secondary bg-primary py-2.5 px-5 rounded-lg mt-8`} onClick={() => requestCells(id_room)}>charger les dessins</button>
    </main>

}

// className={`${lovelo.className} text-white bg-orange-fonce hover:bg-orange-foncee 
// font-medium rounded-lg px-5 py-2.5 mr-2 mb-2 
// focus:outline-none text-xl`}>

