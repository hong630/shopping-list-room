import React, {useEffect, useRef, useState} from "react";
import {SHOPPINGLIST} from "~/data/dto";

const ShoppingList = (props:{managerName:string, roomId:number}) => {
    const originShoppingList:Array<SHOPPINGLIST> = [{name:'아직 장바구니 목록이 없습니다.',shopped:false, id:null}];
    const [shoppingList, setShoppingList] = useState<Array<SHOPPINGLIST>>(originShoppingList)

    useEffect(()=>{
        //쇼핑리스트 불러오기 API
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
            .finally(()=>{
                    console.log("끝")
                }
            )


        const ws = new WebSocket('ws://localhost:24678');

        ws.onopen = () => {
            console.log('WebSocket connection opened');
            // 주기적으로 pong 메시지 보내기
            setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ type: 'pong' }));
                }
            }, 2000); // 30초마다 pong 메시지 전송
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.status === 'connected') {
                console.log('WebSocket status:', message.status);
            } else if (message.type === 'ping') {
                console.log('Received ping from server');
            } else {
                // 다른 메시지 처리 로직 추가
                console.log('Received message:', message);
            }
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        ws.onerror = (error) => {
            console.log('WebSocket error:', error);
        };

    },[])


    const inputElement = useRef<HTMLInputElement>(null)

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
                console.log(response.length)
                if (response){
                    if (shopValue !== undefined && shopValue !== null ){
                        const addedListObject:SHOPPINGLIST = {name:shopValue, shopped:false, id:response.id}
                        shoppingList.findIndex((value)=>{return value["name"] === shopValue}) < 0
                            ? setShoppingList([... shoppingList, addedListObject])
                            : alert("이미 있잖? 장난?")
                    }
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
                    console.log(response.length)
                    if (response === 'Success'){
                        if(previousSibling !== null){
                            const previousSiblingText = previousSibling.textContent
                            const newShoppingList = shoppingList.filter((value)=>{
                                return value["name"] !== previousSiblingText
                            })
                            setShoppingList([... newShoppingList])
                        }
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