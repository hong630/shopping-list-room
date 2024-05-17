import ShoppingRoomListComponent from "~/component/shoppingRoom/shoppingRoomList";
import {useState} from "react";

const Mypage = () => {

    //탈퇴하기
    const [withdrawModal, setWithdrawModal] = useState(false);
    const [toastModal, setToastModal] = useState({state:false, message:""})
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
    return (
        <div>
            <h1>마이페이지입니다.</h1>
            <h2>내가 초대된 방 리스트</h2>
            <ShoppingRoomListComponent />
            <button onClick={showWithdrawModal}>탈퇴하기</button>
            {
                withdrawModal ?
                    <div style={{backgroundColor:"tomato"}}>
                        <h1>정말 탈퇴하시겠습니까?</h1>
                        <button onClick={widthdrawService}>네</button>
                        <button onClick={closeWithdrawModal}>아니요..</button>
                    </div>
                    :<div></div>
            }
            {
                toastModal.state?
                    <div>
                        <p style={{backgroundColor:"yellowgreen", position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)"}}>{toastModal.message}</p>
                    </div>
                    :<div></div>
            }
        </div>
    )
}

export default Mypage;