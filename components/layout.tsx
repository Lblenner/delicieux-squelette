import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { useState } from 'react'
import { DEFAULT_ROOM, lovelo } from "./consts";


const tabs = [
    {
        name: "index",
        route: "/"
    },
    {
        name: "voir",
        route: "/voir/"
    },
    {
        name: "dessiner",
        route: "/dessiner/"
    },
]


type LayoutProps = { children: ReactNode }

export default function Layout(props: LayoutProps) {
    return <Navbar>
        {props.children}
    </Navbar>
}

function Navbar(props: LayoutProps) {

    const [open, setOpen] = useState(false)
    const router = useRouter()
    let id_room = Number(router.query.room)
    if (isNaN(id_room)) {
        id_room = DEFAULT_ROOM
    }

    return <div className="min-h-screen overflow-hiddenrelative bg-primary-light">

        <Head>
            <title>Skeleton</title>
        </Head>
        <nav className={`w-full h-20 bg-primary text-white flex items-center ${open ? "justify-start" : " md:justify-center"}`}>

            <MobileNav open={open} setOpen={setOpen} />
            <Hamburger open={open} setOpen={setOpen} />

            <ul className={`${lovelo.className} text-2xl w-full items-center justify-center hidden w-full ${open ? "" : "md:flex md:w-auto gap-40"}`}>
                {tabs.map((value) =>
                    <li key={value.route} className={`${router.pathname.replace("[room]", "") === value.route ? "text-secondary" : "hover:text-black"}`}>
                        <Link
                            href={value.route + id_room}>
                            {value.name}
                        </Link>
                    </li>
                )}
            </ul>

        </nav >
        {open ? <div></div> : props.children}

    </div>

}

type HamburgerProps = { open: boolean, setOpen: any }

function Hamburger(props: HamburgerProps) {
    return <div className="p-4">
        <button className={`${props.open ? "" : "md:hidden"} z-50 flex relative w-8 h-8 flex-col justify-between items-center`}
            onClick={() => {
                props.setOpen(!props.open)
            }}>
            <span className="sr-only">Open main menu</span>
            {/* hamburger button */}
            <span className={`h-1 w-full bg-white rounded-lg transform transition duration-300 ease-in-out ${props.open ? "rotate-45 translate-y-3.5" : ""}`} />
            <span className={`h-1 w-full bg-white rounded-lg transition-all duration-300 ease-in-out ${props.open ? "scale-0" : "w-full"}`} />
            <span className={`h-1 w-full bg-white rounded-lg transform transition duration-300 ease-in-out ${props.open ? "-rotate-45 -translate-y-3.5" : ""}`} />
        </button>
    </div>
}

type MobileNavProps = { open: boolean, setOpen: any }

const MobileNav = ({ open, setOpen }: MobileNavProps) => {
    let router = useRouter();
    let id_room = Number(router.query.room)
    if (isNaN(id_room)) {
        id_room = 400
    }

    const goTo = async (path: string) => {
        await router.push(path + id_room)
        setOpen(!open);
    }

    return (
        <div
            className={`bg-primary z-10 absolute top-0 left-0 h-screen w-screen transform 
            ${open ? "-translate-x-0" : "-translate-x-full"} transition-transform 
            duration-300 ease-in-out filter drop-shadow-md`}
        >
            <div className="flex h-16 items-center justify-center filter drop-shadow-md bg-primary-light h-20">
                {/* potential name */}
            </div>
            <div className={`${lovelo.className} flex flex-col`}>
                {tabs.map((value) =>
                    <button
                        key={value.route}
                        className={`text-2xl my-4 block py-2 pl-3 pr-4 text-gray-700 rounded mx-16 
                        ${router.pathname == value.route ? "text-secondary" : "text-white hover:text-black hover:bg-primary-light "}`}
                        onClick={() => goTo(value.route)}>
                        {value.name}
                    </button>)
                }
            </div>
        </div>
    )
}


