import type { InitAppState } from "../components/appState";
import { getRooms } from "../components/network";

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ fetch }) {

    const allRooms = (await getRooms(fetch)).content ?? []
    const appState: InitAppState = {
        allRooms

    }
    return appState;
}