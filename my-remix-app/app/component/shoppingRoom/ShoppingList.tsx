import React, {useEffect, useRef, useState} from "react";
import {SHOPPINGLIST} from "~/data/dto";

const ShoppingList = (props:{email:string, managerName:string, roomId:number}) => {
    const originShoppingList:Array<SHOPPINGLIST> = [{name:'아직 장바구니 목록이 없습니다.',shopped:false, id:null}];
    const [shoppingList, setShoppingList] = useState<Array<SHOPPINGLIST>>(originShoppingList)

    const [websocket, setWebsocket] = useState<WebSocket|null>(null)

    const getShoppingList = () => {
        const url = new URL('http://localhost:3000/api/shoppingList');
        url.searchParams.append('roomId', props.roomId.toString());
        url.searchParams.append('type', 'getShoppingList');
        fetch(url,
            {
                method: "GET",
            })
            .then(async (res)=>{
                const data = await res.json();
                setShoppingList(data.state)
            })
            .catch((err)=>{
                console.log(err)
            })
    }

    useEffect(()=>{
        //쇼핑리스트 불러오기 API
        getShoppingList()

        const ws = new WebSocket('ws://localhost:3001');

        ws.onmessage = (event) => {
            console.log("event check")
            const message = JSON.parse(event.data);
            //TODO 다른 메시지 처리 로직 추가
            if (message.type === "createGroup"){
                console.log('Received createGroup message:', message);
                ws.send(JSON.stringify({ type:"joinGroup",groupId:props.roomId, userId:props.email}))
            } else {
                console.log('Received message:', message);
                getShoppingList()
            }
        };
        ws.onopen = () => {
            ws.send(JSON.stringify({ type:"createGroup",groupId:props.roomId, userId:props.email}))
        }
        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };
        ws.onerror = (error) => {
            console.log('WebSocket error:', error);
        };

        setWebsocket(ws)

        return ()=>{
            ws.close()
        }

    },[])


    const inputElement = useRef<HTMLInputElement>(null)

    const sendMessage = () => {
        console.log("Send!!!")
        websocket?.send(JSON.stringify({ type:"message",groupId:props.roomId, message:"modify Shopping list"}))
    }

    //쇼핑리스트 추가하기
    const addShoppingList = () => {
        const shopValue = inputElement.current?.value || ""

        //쇼핑리스트 추가하기 API
        fetch("http://localhost:3000/api/shoppingList",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: "addShoppingList",
                    name : shopValue,
                    roomId : props.roomId,
                }),
            })
            .then(async (res)=>{
                const data = await res.json()
                const response = data.state;
                if (response){
                    if (shopValue !== undefined && shopValue !== null ){
                        const addedListObject:SHOPPINGLIST = {name:shopValue, shopped:false, id:response.id}
                        if(shoppingList.findIndex((value)=>{return value["name"] === shopValue}) < 0){
                            setShoppingList([... shoppingList, addedListObject])
                            sendMessage()
                        }else{
                            alert("이미 있어부렀어")
                        }
                    }
                }else{
                    console.log('response :', response)
                }
            })
            .catch((err)=>{
                console.log(err)
            })
    }

    const listUp = async (event:React.KeyboardEvent<HTMLInputElement>) => {
        if(event.key === "Enter") {
            await addShoppingList()
            if(inputElement.current !== null){
                inputElement.current.value = ""
            }
        }
    }

    //쇼핑리스트 삭제하기
    const removeShoppingList = (event:React.MouseEvent<HTMLButtonElement>) => {
        const previousSibling = event.currentTarget.previousSibling;
        const parentElement = event.currentTarget.closest('li');
        if(parentElement){
            const shoppingItemId = parentElement.getAttribute('data-key');
            //쇼핑리스트 삭제하기 API
            fetch("http://localhost:3000/api/shoppingList",
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        type: "deleteShoppingList",
                        id : shoppingItemId,
                    }),
                })
                .then(async (res)=>{
                    const data = await res.json()
                    const response = data.state;
                    if (response === 'Success'){
                        if(previousSibling !== null){
                            const previousSiblingText = previousSibling.textContent
                            const newShoppingList = shoppingList.filter((value)=>{
                                return value["name"] !== previousSiblingText
                            })
                            setShoppingList([... newShoppingList])
                            sendMessage()
                        }
                    }else{
                        console.log('response :', response)
                    }
                })
                .catch((err)=>{
                    console.log(err)
                })
        }
    }

    //쇼핑리스트 완료하기
    const checkShoppedList = (event:React.MouseEvent<HTMLButtonElement>) => {
        const parentElement = event.currentTarget.closest('li');
        if(parentElement){
            const shoppingItemId = parentElement.getAttribute('data-key');
            const shoppingItemShopped = parentElement.getAttribute('data-shoppped');
            const isShopped = shoppingItemShopped === 'true';
            //쇼핑리스트 상태 변경하기 API
            fetch("http://localhost:3000/api/shoppingList",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        type: "changeShopped",
                        id : shoppingItemId,
                        shopped : !isShopped
                    }),
                })
                .then(async (res)=>{
                    const data = await res.json()
                    const response = data.state;
                    if (response === 'Success'){
                        shoppingList.map((value)=>{
                            if(value["id"] == shoppingItemId) value["shopped"] = !isShopped
                        })
                        setShoppingList([...shoppingList]);
                        sendMessage()
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
        <>
            <h1>방 관리자 : {props.managerName}</h1>
            <ul>
                {shoppingList.map((item) => {
                    return (
                        <li key={item.id} data-key={item.id} data-shoppped={item.shopped} style={item.shopped ? { backgroundColor: 'red', color: 'white' } : undefined}>
                            <button onClick={checkShoppedList}>O</button>
                            <span>{item.name}</span>
                            <button onClick={removeShoppingList}>X</button>
                        </li>
                    );
                })}
            </ul>
            <label>
                새로운 리스트를 추가하세요 : <input type="text" id="new_item" ref={inputElement} onKeyDown={listUp}/>
            </label>

            <button onClick={addShoppingList}>새로운 리스트 추가하기</button>
        </>
    )
}

export default ShoppingList;