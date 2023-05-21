import localFont from "next/font/local";
import { useEffect, useState } from "react";


export type Cell = {
    content: number[],
    x: number,
    y: number,
    done: boolean
    last_request?: {
        secs_since_epoch: number
    }
}

export const secondary_light = "#ba5da5"
export const secondary_medium = "#550060"

export const HEIGHT = 21
export const WIDTH = HEIGHT


export const PIXEL_SIZE = 1;
export const BORDER = 3


// export const ROOM = 211
export const MYURL = "http://127.0.0.1:8000"//"https://delicieuxsquelette.xyz"
export const requestOptions = {
    method: 'GET',
    headers: {
        'Access-Control-Allow-Origin': "*",
        'Access-Control-Allow-Headers': "Origin, X-Requested-With, Content-Type, Accept"
    },
};
export const lovelo = localFont({ src: '../public/fonts/Lovelo-Black.otf' });

export const DEFAULT_ROOM = 405;

export // Hook
function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState<{
        width: undefined | number,
        height: undefined | number,
    }>({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        // only execute all the code below in client side
        // Handler to call on window resize
        function handleResize() {
            // Set window width/height to state
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
}