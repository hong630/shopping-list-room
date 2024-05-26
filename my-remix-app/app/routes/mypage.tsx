import ShoppingRoomListComponent from "~/component/shoppingRoom/shoppingRoomList";
import React, {useState} from "react";
import {Form} from "@remix-run/react";
import {LoaderFunction, redirect} from "@remix-run/node";
import {LoggedInUserData} from "~/data/dto";
import {getUserSession} from "~/routes/session.server";
import {useLoaderData} from "react-router";

//세션에서 로그인한 사용자 정보 가져오기
export const loader: LoaderFunction = async ({ request }) => {
    const data:LoggedInUserData = await getUserSession(request);
    if (!data.isLoggedIn) {
        // 로그인하지 않았으면 로그인 페이지로 리다이렉트
        return redirect("/room");
    }
    return data;
};

const Mypage = () => {
    const data = useLoaderData() as LoggedInUserData;
    const { user, isLoggedIn } = data;
    console.log(user);

    //탈퇴하기
    const [withdrawModal, setWithdrawModal] = useState(false);
    const [toastModal, setToastModal] = useState({state:false, message:""})
    //비밀번호 변경하기
    const [changingPassword, setChangingPassword] = useState(false);
    //닉네임 변경하기
    const [changingNickname, setChangingNickname] = useState(false);

    const widthdrawService = () => {
        const email = user?.email;
        //TODO 탈퇴  API
        fetch("http://localhost:5173/api/register",
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                }),
            })
            .then(async (res)=>{
                console.log(res)
                const data = await res.json()
                // console.log(data)
                const response = data.state;
                if (response === 'Success'){
                    setToastModal({state:true, message:"탈퇴가 완료되었습니다."});
                    setTimeout(()=>{location.href="/room"},2000)
                }else{
                    console.log('response :', response)
                    setToastModal({state:true, message:"탈퇴를 실패하였습니다."});
                    setTimeout(()=>{location.href="/room"},2000)
                }
            })
            .catch((err)=>{
                console.log(err)
                setToastModal({state:true, message:"탈퇴를 실패하였습니다."});
                setTimeout(()=>{location.href="/room"},2000)
            })
            .finally(()=>{
                    console.log("끝")
                }
            )


    }
    const showWithdrawModal = () => {
        setWithdrawModal(true);
    }
    const closeWithdrawModal = () => {
        setWithdrawModal(false);
    }

    //비밀번호 변경하기 모달 열기
    const openChangingPasswordModal = () => {
        setChangingPassword(true);
    }
    //비밀번호 변경하기 모달 닫기
    const closeChangingPasswordModal = () => {
        setChangingPassword(false);
    }
    //닉네임 변경하기 모달 열기
    const openChangingNicknameModal = () => {
        setChangingNickname(true);
    }
    //닉네임 변경하기 모달 닫기
    const closeChangingNicknameModal = () => {
        setChangingNickname(false);
    }

    //비밀번호 변경
    const changePassword = (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = user?.email;
        const password = formData.get("password");

        //비밀번호 변경 API
        fetch("http://localhost:5173/api/changeUser",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type : 'password',
                    email: email,
                    password: password
                }),
            })
            .then(async (res)=>{
                console.log(res)
                const data = await res.json()
                // console.log(data)
                const response = data.state;
                if (response === 'Success'){
                    closeChangingPasswordModal();
                    setToastModal({state:true, message:"비밀번호 변경을 성공하였습니다."});
                    setTimeout(function(){
                        location.reload();
                    },2000)
                }else{
                    console.log('response :', response)
                    closeChangingPasswordModal();
                    setToastModal({state:true, message:"비밀번호 변경을 실패하였습니다. 다시 시도해주세요."});
                    setTimeout(function(){
                        location.reload();
                    },2000)
                }
            })
            .catch((err)=>{
                console.log(err)
                closeChangingPasswordModal();
                setToastModal({state:true, message:"비밀번호 변경을 실패하였습니다. 다시 시도해주세요."});
                setTimeout(function(){
                    location.reload();
                },2000)
            })
            .finally(()=>{
                    console.log("끝")
                }
            )
    }

    //닉네임 변경
    const changeNickname = (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = user?.email;
        const nickname = formData.get("nickname");

        //닉네임 변경 API
        fetch("http://localhost:5173/api/changeUser",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type : 'nickname',
                    email: email,
                    nickname: nickname
                }),
            })
            .then(async (res)=>{
                console.log(res)
                const data = await res.json()
                // console.log(data)
                const response = data.state;
                if (response === 'Success'){
                    closeChangingNicknameModal();
                    setToastModal({state:true, message:"닉네임 변경을 성공하였습니다."});
                    setTimeout(function(){
                        location.reload();
                    },2000)
                }else{
                    console.log('response :', response)
                    closeChangingNicknameModal();
                    setToastModal({state:true, message:"닉네임 변경을 실패하였습니다. 다시 시도해주세요."});
                    setTimeout(function(){
                        location.reload();
                    },2000)
                }
            })
            .catch((err)=>{
                console.log(err)
                closeChangingNicknameModal();
                setToastModal({state:true, message:"닉네임 변경을 실패하였습니다. 다시 시도해주세요."});
                setTimeout(function(){
                    location.reload();
                },2000)
            })
            .finally(()=>{
                    console.log("끝")
                }
            )
    }

    return (
        <div>
            {
                isLoggedIn && user!== null?
                    <div>
                        <h1>{user.nickname}의 마이페이지입니다.</h1>
                        <h2>내가 초대된 방 리스트</h2>
                        <ShoppingRoomListComponent email={user.email}/>
                        <button onClick={showWithdrawModal}>탈퇴하기</button>
                        <button onClick={openChangingPasswordModal}>비밀번호 변경하기</button>
                        <button onClick={openChangingNicknameModal}>닉네임 변경하기</button>
                    </div>
                    : <div></div>

            }
            {
                withdrawModal ?
                    <div style={{backgroundColor: "tomato"}}>
                        <h1>정말 탈퇴하시겠습니까?</h1>
                        <button onClick={widthdrawService}>네</button>
                        <button onClick={closeWithdrawModal}>아니요..</button>
                    </div>
                    : <div></div>
            }
            {
                changingPassword ?
                    <div style={{backgroundColor: "tomato"}}>
                        <h1>비밀번호 변경</h1>
                        <Form onSubmit={changePassword}>
                            <label htmlFor="">
                                변경하실 비밀번호를 입력해주세요. <input type="text" name="password"/>
                            </label>
                            <button type="submit">변경</button>
                        </Form>
                    </div>
                    : <div></div>
            }
            {
                changingNickname ?
                    <div style={{backgroundColor: "tomato"}}>
                        <h1>닉네임 변경</h1>
                        <Form onSubmit={changeNickname}>
                            <label htmlFor="">
                                변경하실 닉네임을 입력해주세요. <input type="text" name="nickname"/>
                                {/*TODO 닉네임 변경 api*/}
                                <button type="submit">변경</button>
                            </label>
                        </Form>
                    </div>
                    : <div></div>
            }
            {
                toastModal.state ?
                    <div>
                        <p style={{
                            backgroundColor: "yellowgreen",
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%,-50%)"
                        }}>{toastModal.message}</p>
                    </div>
                    : <div></div>
            }
        </div>
    );

}

export default Mypage;