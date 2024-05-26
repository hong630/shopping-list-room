import {LoggedInUserData, RoomDetailDto} from "~/data/dto";
import React, {useEffect, useState} from 'react';
import ShoppingList from "~/component/shoppingRoom/ShoppingList";
import {useLoaderData, useParams} from "react-router";
import HeaderLayout from "~/component/common/header";
import {Form} from "@remix-run/react";
import {LoaderFunction, redirect} from "@remix-run/node";
import {getUserSession} from "~/routes/session.server";
import ChangeRoomInfo from "~/component/shoppingRoom/ChangeRoomInfo";

//세션에서 로그인한 사용자 정보 가져오기
export const loader: LoaderFunction = async ({ request }) => {
    const data:LoggedInUserData = await getUserSession(request);
    if (!data.isLoggedIn) {
        // 로그인하지 않았으면 로그인 페이지로 리다이렉트
        return redirect("/room");
    }
    return data;
};

const DetailRoom = () => {
    const params = useParams<string>()
    const roomId:string = params.id || "";
    const data = useLoaderData() as LoggedInUserData;
    const { user } = data;
    const userEmail = user?.email || null;

    const copyInvitationLink = (event:React.MouseEvent<HTMLButtonElement>) => {
        const text = event.currentTarget.value;
        if (typeof navigator !== "undefined") {
            navigator.clipboard.writeText(text).then(() => {
                //복사 성공하면 성공했다는 토스트 팝업 만들어야 함
            }).catch(err => {
                console.error('복사 실패:', err);
                //복사 실패하면 실패했다는 토스트 팝업 만들어야 함
            });
        }
    }

    //방 멤버 여부 판별
    const [notMember, setNotMember] = useState(false);
    //방정보 담기
    const [roomDetailInfo, setRoomDetailInfo] = useState<RoomDetailDto | null>(null)

    useEffect(()=>{
        const url = new URL('http://localhost:5173/api/room');
        url.searchParams.append('roomId', roomId);
        url.searchParams.append('type', 'detail');
        //로그인 API
        fetch(url,
            {
                method: "GET",
            })
            .then(async (res)=>{
                const data:RoomDetailDto = await res.json();
                console.log(data);
                const roomMember = data.members.filter(member => member.email === userEmail);
                setRoomDetailInfo(data);
                if(roomMember.length > 0){
                    //회원의 방의 멤버일 때
                    setNotMember(false);
                }else{
                    //회원의 방의 멤버가 아닐 때
                    setNotMember(true);
                }
            })
            .catch((err)=>{
                console.log(err)
            })
            .finally(()=>{
                    console.log("끝")
                }
            )
    },[])


    const enterRoom = (event:React.FormEvent<HTMLFormElement>) => {
        const formData = new FormData(event.currentTarget);
        const code = formData.get("code");
        //방 들어가기 API
        fetch("http://localhost:5173/api/room",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: "enter",
                    email : userEmail,
                    roomId : roomId,
                    code : code
                }),
            })
            .then(async (res)=>{
                console.log(res)
                const data = await res.json()
                const response = data.state;
                if (response === 'Success'){
                    //방 목록 페이지로 이동
                    location.reload();
                    console.log('성공!')
                }else{
                    console.log('response :', response)
                }
            })
            .catch((err)=>{
                console.log(err)
            })
            .finally(()=>{
                    console.log("끝")
                }
            )

    }

    return (
        <div>
            <HeaderLayout status={true}></HeaderLayout>
            {
                notMember?
                    <div>
                        <p>이 방의 회원이 아닙니다. 입장하고 싶으시면 입장 코드를 입력해주세요.</p>
                        <Form onSubmit={enterRoom}>
                            <label htmlFor="">
                                입장 코드 : <input type="text" name="code" placeholder="입장 코드를 입력해주세요."/>
                            </label>
                            <button type="submit">제출</button>
                        </Form>
                    </div>
                    :
                    <div></div>
            }
            {
                roomDetailInfo && !notMember?
                    <div>
                        <h1>{roomDetailInfo.title}</h1>
                        <p>{roomDetailInfo.description}</p>
                        <ChangeRoomInfo email={userEmail || ""} roomId={Number(roomId)}></ChangeRoomInfo>
                        <button onClick={copyInvitationLink} value={roomDetailInfo.code}>초대링크복사하기</button>
                        <ul>
                            {
                                roomDetailInfo.members.map((member,index)=>(
                                    <React.Fragment key={index}>
                                        <li key={index}>
                                            {member.nickname}
                                        </li>
                                    </React.Fragment>
                                ))
                            }
                        </ul>
                        <ShoppingList managerName={roomDetailInfo?.master[0]} />
                    </div>:
                    <div></div>
            }

        </div>
    )
}
export default DetailRoom;