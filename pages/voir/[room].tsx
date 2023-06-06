import { Cell, DEFAULT_ROOM, MYURL, lovelo, requestOptions, useWindowSize } from "@/components/consts";
import { Canvas } from "@/components/new_infinite_canvas";
import { useRouter } from "next/router";
import { ChangeEventHandler, useCallback, useEffect, useState } from "react";

export default function Dessiner() {

    let [cells, setCells] = useState<Cell[]>([]);
    let [load, setLoad] = useState(false);

    const router = useRouter();

    let id_room = Number(router.query.room)
    if (isNaN(id_room)) {
        id_room = DEFAULT_ROOM
    }

    const requestCells = useCallback(async (i: number) => {
        setLoad(true);
        try {
            let response = await fetch(MYURL + `/show/${i}`, requestOptions);
            let data = await response.json();
            //console.log("requestCells/", i, " : ", data)

            if (data.error) {
                console.log("api err: " + data.error)
            } else {
                setCells(data)
            }
            setLoad(false);

        } catch (e) {
            console.log("err:", e)
            setLoad(false);
        }

    }, [])

    const size = useWindowSize();

    var h = 600
    var w = 600

    if (size.height && size.width) {
        if (size.height < 650 || size.width < 650) {
            h = 500
            w = 500
        }
        if (size.height < 550 || size.width < 550) {
            h = 400
            w = 400
        }
        if (size.height < 450 || size.width < 450) {
            h = 300
            w = 300
        }
    } else {
    
    }   

    return <main className='flex flex-col w-full items-center p-4'>
        <Canvas 
            canvasHeight={h} 
            canvasWidth={w} 
            cells={cells}/>

        {load ? 
            "loading..." : 
            <button    
                className={`${lovelo.className} text-white text-small md:text-xl 
                hover:bg-secondary bg-primary py-2.5 px-5 rounded-lg mt-8`} 
                onClick={() => requestCells(id_room)}>
                    charger les dessins
            </button>}
    </main>

}

// className={`${lovelo.className} text-white bg-orange-fonce hover:bg-orange-foncee 
// font-medium rounded-lg px-5 py-2.5 mr-2 mb-2 
// focus:outline-none text-xl`}>

