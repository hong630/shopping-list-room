import {Outlet} from "@remix-run/react";
// import {json, LoaderFunction} from "@remix-run/node";
// import {ROOMDETAILDATA, roomDetailData} from "~/data/interface";


// export const loader:LoaderFunction = async ({params}) => {
//     const room = roomDetailData.find(data => data.id === params.id)
//     if (room === undefined) return {myShoppingRoom: "내용이 없습니다." , detail: "", members :[]}
//     return json(room)
// }

const RoomLayout = () => {

    return (
        <div>
            <Outlet/>
        </div>
    )
}

export default RoomLayout;
