import {useEffect, useState} from "react";
import {Link} from "@remix-run/react";
import {RoomDto} from "~/data/dto";

const ShoppingRoomListComponent = (props:{email:string}) => {
    //로그인 된 이메일이 hong@gmail.com a, b, c
    // const myRoomList = ['a','b','c'];
    //
    // const data:ROOMDETAILDATA[] = roomDetailData.filter((value)=>{
    //     return (
    //         myRoomList.findIndex((myRoom)=>{
    //             return myRoom === value.id
    //         }) >= 0
    //     )
    // }) || [emptyRoomDetailData]

    const [shoppingRoomList, setShoppingRoomList] = useState<RoomDto[] | null>(null);


    useEffect(()=>{
        const url = new URL('http://localhost:3000/api/room');
        url.searchParams.append('email', props.email);
        url.searchParams.append('type', 'all');
        //로그인 API
        fetch(url,
            {
                method: "GET",
            })
            .then(async (res)=>{
                const data:RoomDto[] = await res.json();
                setShoppingRoomList(data);
            })
            .catch((err)=>{
                console.log(err)
            })
    },[])

    return (
        <ul>
            {
                shoppingRoomList?.map((room)=> (
                    <li key={room.roomId}>
                        <Link to={`/room/${room.roomId}`}>{room.title}</Link>
                        <p>{room.description}</p>
                    </li>
                ))
            }
        </ul>
    )
}

export default ShoppingRoomListComponent