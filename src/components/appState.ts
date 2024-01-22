import { derived, get, writable, type Writable } from "svelte/store";
import type { AddRoom, Dessin, Room, RoomWithPass } from "./types";

import { addRoom, completeDessin, getDessins, requestDessin } from "./network";
import { localStorageStore } from "@skeletonlabs/skeleton";

export interface InitAppState {
    allRooms: Room[]
}


export const allRooms = writable<Room[]>([]);
export const usersRooms: Writable<RoomWithPass[]> = localStorageStore("usersRooms",[]);
export const selectedRoom: Writable<Room | null> = localStorageStore("selectedRoom",null);
export const savedDessins = writable(new Map<number, Dessin>());
export const currentDessin: Writable<Dessin | null> = localStorageStore("currentDessin",null);

export const currentCells = derived(selectedRoom, async (room) => {
    if (!room) {
        return null
    }

    const dessins = await getDessins({ id: room.id, password: room.hashed_password }, fetch)
    dessins.content
    if (!dessins.content) {
        console.log("Erreur pas de dessins")
        return null
    }

    return dessins.content
}
)

export const worker = writable<Worker | null>();


export const joinRoom = async (room: Room) => {
    usersRooms.update((value) => {
        if (!value.find((elem) => elem.id === room.id)) {
            value.push(room)
        }
        return value
    })
    setSelectedRoom(room)
}

export const quitRoom = async (room: Room) => {
    usersRooms.update((value) => {
        return value.filter((elem) => elem.id !== room.id)
    })
    setSelectedRoom(null)
}

export const setSelectedRoom = (new_room: Room | null) => {
    const room = get(selectedRoom)
    const dessin = get(currentDessin)
    const saved = get(savedDessins)

    if (room && dessin) {
        const a: Room = room
        const b: Dessin = dessin
        savedDessins.update((elem) => {
            elem.set(a.id, b)
            return elem
        })
    }

    if (new_room) {
        currentDessin.set(saved.get(new_room.id) ?? null)
    }
    selectedRoom.set(new_room)
}

export const request = async () => {
    const room = get(selectedRoom)
    if (room) {
        const response = await requestDessin({ id: room.id, password: room.hashed_password }, fetch)

        if (!response.content) {
            return
        }

        currentDessin.set(response.content)
    }
}

export const cancelDessin = async () => {
    

        currentDessin.set(null)
    
}

export const complete = async () => {
    const room = get(selectedRoom)
    const cell = get(currentDessin)

    if (room && cell) {
        const content = cell.selected_cell.content

        if (!content) {
            return
        }

        const dessin = await completeDessin({ id_room: room.id, dessin: content, key: cell.selected_cell.id, password: room.hashed_password }, fetch)

        if (dessin.error) {
            console.log("complete err :", dessin)
            return
        }

        savedDessins.update((elem) => {
            elem.delete(cell.selected_cell.id)
            return elem
        })
        currentDessin.set(null)
    }
}

export const createRoom = async (new_room: AddRoom) => {

    const result = await addRoom(new_room, fetch)

    if (!result.content) {
        return
    }

    const r: RoomWithPass = result.content
    r.admin = new_room.admin_password
    r.password = new_room.password

    await joinRoom(r)
}

// export const destructRoom = async (room: Room) => {

//     const result = await deleteRoom(
//         { id: room.id, password: room.admin_pass }, fetch)
    
//     if(result.error) {
//         return
//     }

//     quitRoom(room)
// }