import SimpleHeader from "~/component/common/SimpleHeader";
import {LoaderFunction, redirect} from "@remix-run/node";
import {LoggedInUserData} from "~/data/dto";
import {getUserSession} from "~/routes/session.server";
import {useLoaderData} from "react-router";
import {sanitizeValue} from "~/utils/sanitize";
import React from "react";
import {Form} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node"
import styles from "~/styles/make-room.css?url"

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: styles },
];

//세션에서 로그인한 사용자 정보 가져오기
export const loader: LoaderFunction = async ({ request }) => {
    const data:LoggedInUserData = await getUserSession(request);
    if (!data.isLoggedIn) {
        // 로그인하지 않았으면 로그인 페이지로 리다이렉트
        return redirect("/login");
    }
    return data;
};

const MakeRoom = () => {
    const data = useLoaderData() as LoggedInUserData;
    const { user, isLoggedIn } = data;
    const email = user?.email || "";
    const userNickname = user?.nickname || "";

    const makeRoom = async (event:React.FormEvent<HTMLFormElement>) => {

    const formData = new FormData(event.currentTarget);
    const title = formData.get("title");
    const description = formData.get("description");

    if(title !== null && description!==null){
        const sanitizedTitle = await sanitizeValue(title.toString());
        const sanitizedDescription = await sanitizeValue(description.toString());

        //방만들기 API
        fetch("http://localhost:3000/api/room",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: "makeRoom",
                    email: email,
                    title: title,
                    description: description
                }),
            })
            .then(async (res)=>{
                const data = await res.json()
                const response = data.state;
                if (response === 'Success'){
                    //방 목록 페이지로 이동
                    location.reload();
                }else{
                    console.log('response :', response)
                }
            })
            .catch((err)=>{
                console.log(err)
            })
         }
    }


    return (
        <div>
            <SimpleHeader title="새로운 장바구니 만들기"></SimpleHeader>
            <div className="wrap content-container">
                <Form onSubmit={makeRoom} className="form-make-room">
                    <div>
                        <p>장바구니 제목</p>
                        <textarea name="title" className="textarea-short inactive" placeholder='장바구니 제목을 적어주세요.'></textarea>
                    </div>
                    <div>
                        <p>장바구니 설명</p>
                        <textarea name="description" className="textarea-long inactive" placeholder='장바구니 설명을 적어주세요.'></textarea>
                    </div>
                    <div className="buttons-wrap">
                        <button type="submit">확인</button>
                    </div>
                </Form>
            </div>
        </div>
    )
}
export default MakeRoom;