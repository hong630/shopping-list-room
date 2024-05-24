import {ROOMDETAILDATA, MEMBER, RoomDto} from "~/data/dto";
import React, {useEffect} from 'react';
import ShoppingList from "~/component/shoppingRoom/ShoppingList";
import {useParams} from "react-router";
import HeaderLayout from "~/component/common/header";
import {emptyRoomDetailData, roomDetailData} from "~/data/default";


const DetailRoom = () => {
    const params = useParams<string>()
    const roomId:string = params.id || "";
    const loaderData:ROOMDETAILDATA = roomDetailData.find((value)=>{
        return value.id === params.id
    }) || emptyRoomDetailData //TODO API로 대체

    const members:Array<MEMBER> = loaderData.members;

    const copyInvitationLink = () => {
        const text = loaderData.invitationLink;
        if (typeof navigator !== "undefined") {
            navigator.clipboard.writeText(text).then(() => {
                //복사 성공하면 성공했다는 토스트 팝업 만들어야 함
            }).catch(err => {
                console.error('복사 실패:', err);
                //복사 실패하면 실패했다는 토스트 팝업 만들어야 함
            });
        }
    }

    useEffect(()=>{
        // TODO password 안오게
        const url = new URL('http://localhost:5173/api/room');
        url.searchParams.append('roomId', roomId);
        url.searchParams.append('type', 'detail');
        //로그인 API
        fetch(url,
            {
                method: "GET",
            })
            .then(async (res)=>{
                const data:RoomDto[] = await res.json();
                console.log(data);
            })
            .catch((err)=>{
                console.log(err)
            })
            .finally(()=>{
                    console.log("끝")
                }
            )
    },[])


    return (
        <div>
            <HeaderLayout status={true}></HeaderLayout>
            <h1>{loaderData.myShoppingRoom}</h1>
            <p>{loaderData.detail}</p>
            <button onClick={copyInvitationLink}>초대링크복사하기</button>
            <ul>
                {
                    members.map((member,index)=>(
                        <React.Fragment key={index}>
                            <li key={index}>
                                {member.nickname}
                            </li>
                        </React.Fragment>
                    ))
                }
            </ul>
            <ShoppingList />
        </div>
    )
}
export default DetailRoom;