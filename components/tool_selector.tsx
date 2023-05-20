import { BsFillPencilFill, BsFillEraserFill } from 'react-icons/bs';


export enum STROKE_TYPE {
    PEN, ERASER
};

export function ToolSelector(props: { strokeValue: STROKE_TYPE, setStrokeValue: any, strokeSize: number, setStrokeSize: any }) {

    const onClick = (toPen: boolean) => {
        if (props.strokeValue === STROKE_TYPE.ERASER && toPen) {
            props.setStrokeValue(STROKE_TYPE.PEN)
        } else if (props.strokeValue === STROKE_TYPE.PEN && !toPen) {
            props.setStrokeValue(STROKE_TYPE.ERASER)
        }
    }

    let isPen = props.strokeValue === STROKE_TYPE.PEN

    return <div
        className="border-solid border-2 rounded-lg"
    >

        <button
            className={`h-10 w-10 flex justify-center items-center rounded  ${isPen ? "bg-black" : "hover:bg-secondary bg-primary"}`}
            onClick={() => onClick(true)}
        >

            <BsFillPencilFill />
        </button>
        <button
            className={`border-inset h-10 w-10 flex justify-center items-center  rounded-lg  ${isPen ? "hover:bg-secondary bg-primary" : "bg-black"}`}
            onClick={() => onClick(false)}
        >
            <BsFillEraserFill />
        </button>

    </div>
}
