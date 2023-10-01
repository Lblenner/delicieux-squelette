/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AddRoom, Cell, Dessin, Room } from "./types";

interface NetworkResponse<T> {
    error?: {
        message: string,
        body ?: any
    },
    content?: T
}

// export const MYURL = "https://delicieuxsquelette.xyz"
export const MYURL = "http://127.0.0.1:1420"

export const getRooms = async (fetch: any) => {
    return await sendPost("/get_rooms", {}, fetch) as NetworkResponse<Room[]>
}

export const addRoom = async (args: AddRoom, fetch: any) => {
    return await sendPost("/add_room", args, fetch) as NetworkResponse<Room>
}

export const deleteRoom = async (args: { id: number, password?: string }, fetch: any) => {
    return await sendPost("/delete_room", args, fetch) as NetworkResponse<null>
}


export const getDessins = async (args: { id: number, password?: string }, fetch: any) => {
    return await sendPost("/get_dessins", args, fetch) as NetworkResponse<Cell[]>
}


export const completeDessin = async (args: { key: number, id_room: number, dessin: number[], password?: string }, fetch: any) => {
    return sendPost("/complete_dessin", args, fetch) as NetworkResponse<null>
}

export const requestDessin = async (args: { id: number, password?: string }, fetch: any) => {
    return sendPost("/request_dessin", args, fetch) as NetworkResponse<Dessin>
}


const sendPost = async <T>(route: string, obj: any, fetch: any) => {
    console.log("send post : ", route, " ", obj)
    const result: NetworkResponse<T> = {}
    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append('Access-Control-Allow-Origin', "*")
        myHeaders.append('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept")

        const raw = JSON.stringify(obj);

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
        };

        const response = await fetch(MYURL + route, requestOptions)
        if (response.status !== 200) {
            result.error = {
                message: "server erreur",
                body: await response.json()
            }
        } else {
            result.content = await response.json()
        }

    } catch (e: any) {
        result.error = {
            message: "network erreur",
            //body: e.body
        }
    }

    return result
}
