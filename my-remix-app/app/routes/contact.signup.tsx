import {useState} from "react";

const Test = () => {
    const [count, setCount] = useState<number>(0)

    const countUp = () => {
        let a = count
        a++

        setCount(a)
    }

    return (
        <>
            <button onClick={countUp}> Button</button>
            <h1> count : {count}</h1>
        </>
    )
}

export default Test