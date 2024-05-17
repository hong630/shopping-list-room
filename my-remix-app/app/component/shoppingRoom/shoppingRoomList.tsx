import {Link} from "@remix-run/react";
import {emptyRoomDetailData, roomDetailData} from "~/data/default";
import {ROOMDETAILDATA} from "~/data/interface";

const ShoppingRoomListComponent = () => {
    //로그인 된 이메일이 hong@gmail.com a, b, c TODO API
    const myRoomList = ['a','b','c'];

    const data:ROOMDETAILDATA[] = roomDetailData.filter((value)=>{
        return (
            myRoomList.findIndex((myRoom)=>{
                return myRoom === value.id
            }) >= 0
        )
    }) || [emptyRoomDetailData]

    return (
        <ul>
            {
                data.map((data,index)=> (
                    <li key={index}>
                        <Link to={`/room/${data.id}`}>{data.myShoppingRoom}</Link>
                    </li>
                ))
            }
        </ul>
    )
}

export default ShoppingRoomListComponent