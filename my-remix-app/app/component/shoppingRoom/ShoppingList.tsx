import {useParams} from "react-router";
import React, {useEffect, useRef, useState} from "react";
import {emptyRoomDetailData, roomDetailData} from "~/data/default";
import {ROOMDETAILDATA, SHOPPINGLIST} from "~/data/interface";

const ShoppingList = () => {
    const params = useParams();
    const shoppingData:ROOMDETAILDATA = roomDetailData.find(data=>data.id === params.id)||emptyRoomDetailData; //TODO API로 대체
    // const roomId = params.id?.trim();
    let originShoppingList:Array<SHOPPINGLIST> = [{name:'아직 장바구니 목록이 없습니다.',shopped:false}];
    if (!(shoppingData === undefined || shoppingData.shoppingList.length === 0)) {
        originShoppingList = shoppingData.shoppingList
    }

    const [shoppingList, setShoppingList] = useState<Array<SHOPPINGLIST>>(originShoppingList)
    const inputElement = useRef<HTMLInputElement>(null)

    //쇼핑리스트 추가하기
    const addShoppingList = () => {
        const shopValue = inputElement.current?.value || ""
        const addedListObject:SHOPPINGLIST = {name:shopValue, shopped:false}
        if (shopValue !== undefined && shopValue !== null ){
            shoppingList.findIndex((value)=>{return value["name"] === shopValue}) < 0
                ? setShoppingList([... shoppingList, addedListObject])
                : alert("이미 있잖? 장난?")
        }
    }

    const listUp = async (event:React.KeyboardEvent<HTMLInputElement>) => {
        console.log(event.key)
        if(event.key === "Enter") {
            await addShoppingList()
            if(inputElement.current !== null){
                inputElement.current.value = ""
            }
        }
    }

    //쇼핑리스트 삭제하기
    const removeShoppingList = (event:React.MouseEvent<HTMLButtonElement>) => {
        const previousSibling = event.currentTarget.previousSibling
        if(previousSibling !== null){
            const previousSiblingText = previousSibling.textContent
            const newShoppingList = shoppingList.filter((value)=>{
                return value["name"] !== previousSiblingText
            })
            setShoppingList([... newShoppingList])
        }
    }

    //쇼핑리스트 완료하기
    const checkShoppedList = (event:React.MouseEvent<HTMLButtonElement>) => {
        const nextSibling = event.currentTarget.nextSibling
        if(nextSibling !== null){
            const nextSiblingText = nextSibling.textContent
            shoppingList.map((value)=>{
                if(value["name"] == nextSiblingText) value["shopped"] ? value["shopped"] = false : value["shopped"] = true;
            })
            setShoppingList([...shoppingList]);
        }
    }

    //권한 위임 기능
    const [delegationModal, setDelegationModal] = useState(true);
    const closeDelegationModal = () => {
        setDelegationModal(false);
    }

    const userEmail = 'hong@gmail.com'.trim(); //TODO API login된 user email 가져오기
    const originMangerName = '홍인'; //TODO API email로 nickname 가져오기

    //매니저 정보
    const [managerName, setManagerName] = useState(originMangerName);
    const [managerEmail, setManagerEmail] = useState(shoppingData?.authority.trim());
    const checkAuthorityFirst = (event:React.MouseEvent<HTMLButtonElement>) => {
        switch(true){
            case(userEmail === managerEmail && event.currentTarget.id !== 'btn_delete'):
                //사용자와 매니저메일이 동일하고, 삭제 버튼이 아니면 권한 위임 버튼
                setDelegationModal(true);
                break;
            case(userEmail === managerEmail && event.currentTarget.id === 'btn_delete'):
                //사용자가 매니저이고 삭제 버튼이면 삭제 모달 보여줌
                setDeleteModal(true);
                break;
            case(userEmail !== managerEmail && event.currentTarget.id === 'btn_out'):
                //사용자가 매니저가 아니고 나가기 버튼이면 나가기 모달 보여줌
                setOutModal(true);
                break;
            default:
                break;
        }

    }

    //일반회원
    const normalMember = shoppingData?.members.filter((data)=>{return data.email.trim() !== managerEmail});
    const [normalMembers, setNormalMembers] = useState(normalMember);

    //방 삭제 버튼 보이는 유무
    const initialDeleteButtonState:boolean = (managerEmail === userEmail) //매니저 이메일과 유저 이메일이 동일하면 true
    const [showDeleteButton, setShowDeleteButton]=useState(initialDeleteButtonState);

    const delegateThisRoom = (event:React.MouseEvent<HTMLButtonElement>) => {
        const newManagerEmail = event.currentTarget.value.trim();
        const newManagerName = event.currentTarget.innerText;
        // const authorityOfNewManager:UserDataAuthority[] = userData?.filter((data)=>{return data.email.trim() === newManagerEmail})[0].authority || emptyUserData.authority;
        // let newAuthorityOfNewManager = authorityOfNewManager?.map((data)=>{
        //     if(data['id'] === roomId) data['role'] = '방장';
        //     return data;
        // });
        // const authorityOfOriginalManager:UserDataAuthority[] = userData?.filter((data)=>{return data.email.trim() === managerEmail})[0].authority || emptyUserData.authority;
        // let newAuthorityOfOriginalManager = authorityOfOriginalManager.map((data)=>{
        //     if(data['id'] === roomId) data['role'] = '일반';
        //     return data;
        // });
        //TODO roomDetailData의 roodId에 해당하는 데이터에 newManagerEmail을 저장
        //TODO newMangerEmail의 authority 변경 (userData의 email:newManagerEmail, authority: newAuthorityOfNewManager
        //TODO 현재 관리자의 authority 변경 (userData의 email:originManagerEmail, authority :newAuthorityOfOriginalManager
        setManagerName(newManagerName);
        setManagerEmail(newManagerEmail);
    }

    useEffect(() => {
        //권한변경이 됐을 때
        setDelegationModal(false); //권한 변경 모달 닫기
        const changedDeleteButtonState = (managerEmail === userEmail); //매니저와 사용자가 동일한 지 검사
        setShowDeleteButton(changedDeleteButtonState); //사용자가 매니저일 때만 방 삭제 버튼 표시
        //일반 사용자 리스트 갱신
        const newNormalMember = shoppingData?.members.filter((data)=>{return data.email.trim() !== managerEmail});
        setNormalMembers(newNormalMember);
    }, [managerEmail]); // managerEmail이 변경될 때마다 이 effect가 실행됨

    //공유방 나가기 기능
    //나가기 모달
    const [outModal, setOutModal] = useState(false);
    const closeOutModal = () => {
        setOutModal(false)
    }
    //상태 토스트 모달
    const [toastModal, setToastModal] = useState({state:false, message:""})
    const outOfThisRoom = () => {
        //TODO API 방을 나가는 기능
        location.href="/room";
    }

    //공유방 삭제 기능
    //삭제 모달
    const [deleteModal, setDeleteModal] = useState(false);
    const closeDeleteModal = () => {
        setDeleteModal(false);
    }
    const deleteThisRoom = () => {
        //TODO API 방을 삭제하는 기능
        setToastModal({state:true, message:"방 삭제가 완료되었습니다."});
        setTimeout(()=>{location.href="/room"},2000)
    }
    return (
        <>
            <h1>방 관리자 : {managerName}({managerEmail})</h1>
            <ul>
                {shoppingList.map((item,index) => {
                    return (
                        <li key={index} style={item.shopped ? { backgroundColor: 'red', color: 'white' } : undefined}>
                            <button onClick={checkShoppedList}>O</button>
                            <span>{item.name}</span>
                            <button onClick={removeShoppingList}>X</button> {/* item.id를 인자로 넘겨주는 방식 */}
                        </li>
                    );
                })}
            </ul>
            <label>
                새로운 리스트를 추가하세요 : <input type="text" id="new_item" ref={inputElement} onKeyDown={listUp}/>
            </label>
            <button onClick={checkAuthorityFirst} id="btn_out">방 나가기</button>
            {
                showDeleteButton ?
                    <button onClick={checkAuthorityFirst} id="btn_delete">방 삭제하기</button>
                    : <div></div>
            }

            <button onClick={addShoppingList}>새로운 리스트 추가하기</button>
                {
                    delegationModal ?
                        <ul style={{backgroundColor:'pink'}}>
                            <p>운영자는 권한을 먼저 위임해야 합니다. 누구에게 권한을 위임하시겠습니까?</p>
                            {normalMembers?.map((data)=>(
                                <li key={data.email}>
                                    <button value={data.email} onClick={delegateThisRoom}>{data.nickname}</button>
                                </li>
                            ))}
                            <li><button onClick={closeDelegationModal}>위임 취소하기</button></li>
                        </ul>
                        :<div></div>
                }
                {
                    outModal ?
                        <div style={{backgroundColor:"aliceblue"}}>
                            <h1>정말 이 방을 나가시겠습니까?</h1>
                            <button onClick={outOfThisRoom}>네</button>
                            <button onClick={closeOutModal}>아니요..</button>
                        </div>
                        :<div></div>
                }
                {
                    deleteModal ?
                        <div style={{backgroundColor:"tomato"}}>
                            <h1>정말 이 방을 삭제하시겠습니까?</h1>
                            <button onClick={deleteThisRoom}>네</button>
                            <button onClick={closeDeleteModal}>아니요..</button>
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
        </>
    )
}

export default ShoppingList;