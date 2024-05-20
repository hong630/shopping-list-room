import ShoppingRoomListComponent from "~/component/shoppingRoom/shoppingRoomList";
import {useState} from "react";
import {Form} from "@remix-run/react";

const Mypage = () => {

    //탈퇴하기
    const [withdrawModal, setWithdrawModal] = useState(false);
    const [toastModal, setToastModal] = useState({state:false, message:""})
    //비밀번호 변경하기
    const [changingPassword, setChangingPassword] = useState(false);
    //닉네임 변경하기
    const [changingNickname, setChangingNickname] = useState(false);

    const widthdrawService = () => {
        //TODO 탈퇴  API
        setToastModal({state:true, message:"탈퇴가 완료되었습니다."});
        setTimeout(()=>{location.href="/room"},2000)
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
    // const closeChangingPasswordModal = () => {
    //     setChangingPassword(false);
    // }
    //닉네임 변경하기 모달 열기
    const openChangingNicknameModal = () => {
        setChangingNickname(true);
    }
    //닉네임 변경하기 모달 닫기
    // const closeChangingNicknameModal = () => {
    //     setChangingNickname(false);
    // }

    return (
        <div>
            <h1>마이페이지입니다.</h1>
            <h2>내가 초대된 방 리스트</h2>
            <ShoppingRoomListComponent/>
            <button onClick={showWithdrawModal}>탈퇴하기</button>
            <button onClick={openChangingPasswordModal}>비밀번호 변경하기</button>
            <button onClick={openChangingNicknameModal}>닉네임 변경하기</button>
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
                        <Form>
                            <label htmlFor="">
                                기존 비밀번호를 입력해주세요. <input type="text" name="originalPassword"/>
                            </label>
                            <label htmlFor="">
                                변경하실 비밀번호를 입력해주세요. <input type="text" name="password"/>
                            </label>
                            {/*TODO 비밀번호 변경 api*/}
                            <button>변경</button>
                        </Form>
                        {/*TODO 비밀번호 찾기 구현*/}
                        <button>기존 비밀번호가 기억나지 않으세요?</button>
                    </div>
                    : <div></div>
            }
            {
                changingNickname ?
                    <div style={{backgroundColor: "tomato"}}>
                        <h1>닉네임 변경</h1>
                        <label htmlFor="">
                            변경하실 닉네임을 입력해주세요. <input type="text" name="nickname"/>
                            {/*TODO 닉네임 변경 api*/}
                            <button>변경</button>
                        </label>
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