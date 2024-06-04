import {useEffect, useState} from "react";
import ShoppingRoomListComponent from "~/component/shoppingRoom/shoppingRoomList";
import MakeRoomModal from "~/component/shoppingRoom/makeRoomModal";
import LoginComponent from "~/component/auth/login";
import HeaderLayout from "~/component/common/header";

const LoginLayout = (props:{status:boolean, email:string}) => {

    //장바구니 방 만들기
    const [shareRoomToggle, setShareRoomToggle] = useState(false);
    //초대코드 모달 열기
    const [invitationModal, setInvitationModal] = useState(false);
    //방정보 모달
    const [roomInfoModal, setRoomInfoModal] = useState(false);

    const openShareRoom = () => {
        setShareRoomToggle(true);
    }

    //초대 모달 열기
    const openInvitationModal = () => {
        setInvitationModal(true);
    }

    //초대 모달 닫기
    const closeInvitationModal = () => {
        setInvitationModal(false);
    }

    //방 정보 모달 닫기
    const closeRoomInfoModal = () => {
        setRoomInfoModal(false);
    }

    return (
        <div>
            <div>
                <HeaderLayout status={true}></HeaderLayout>
                <h1>로그인 되었습니다.</h1>
                <ShoppingRoomListComponent email={props.email}/>
                <button onClick={openShareRoom}>공유방 만들기</button>
                <button onClick={openInvitationModal}>초대코드로 방찾기</button>
            </div>
            {shareRoomToggle ? <MakeRoomModal email={props.email} />:<div></div>}
            {
                invitationModal?
                    <div style={{backgroundColor:"aliceblue"}}>
                        <h1>장바구니 목록 공유방 찾기</h1>
                        <label htmlFor="">
                            장바구니 코드를 입력해주세요 : <input type="text"/>
                        </label>
                        <button>방 찾기</button>
                        <button onClick={closeInvitationModal}>닫기</button>
                    </div>
                    :<div></div>
            }
            {
                roomInfoModal?
                    <div style={{backgroundColor:"aliceblue"}}>
                        <h1>방정보</h1>
                        <p></p>
                        {/*<Link to={}>이 방으로 이동하기</Link>*/}
                        <button onClick={closeRoomInfoModal}>닫기</button>
                    </div>
                    :<div></div>
            }
        </div>
    )
}

export default LoginLayout