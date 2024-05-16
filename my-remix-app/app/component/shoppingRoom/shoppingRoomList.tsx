import {Link} from "@remix-run/react";
import {ROOMDETAILDATA, roomDetailData} from "~/data/test";

const ShoppingRoomListComponent = () => {
    //로그인 된 이메일이 hong@gmail.com a, b, c TODO API
    const myRoomList = ['a','b','c'];

    const data = roomDetailData.filter((value, index, array)=>{
        return myRoomList.findIndex((myRoom)=>{
            return myRoom === value.id
        }) >= 0
    })

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