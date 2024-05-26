import {Form} from "@remix-run/react";
import {useState} from "react";

const ChangeRoomInfo = (props : {email : string, roomId : number}) => {
    //방정보변경 모달 노출
    const [openingChangeModal, setOpeningChangeModal] = useState(false);

    const openChangeModal = () => {
        setOpeningChangeModal(true);
    }
    const closeChangeModal = () => {
        setOpeningChangeModal(false);
    }
    //권한 체크
    const checkAuthority = () => {

        const url = new URL('http://localhost:5173/api/room');
        url.searchParams.append('type', 'authority');
        url.searchParams.append('email', props.email);
        url.searchParams.append('roomId', props.roomId.toString());

        fetch(url)
            .then(async(res)=>{
            const data = await res.json();
            const response = data.state;
            if(response === 'Success'){
                location.reload();
            }else{
                console.log('response : ', response)
            }
        }).catch((err)=>{
            console.log(err)
        })
    }
    const submitChangedRoomInfo = (event:React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const title = formData.get("title");
      const description = formData.get("description");

      fetch("http://localhost:5173/api/room",
          {
              method : "PUT",
              headers : {
                  "Content-Type" : "application/json",
              },
              body : JSON.stringify({
                  type: "update",
                  email : props.email,
                  title : title,
                  description : description
              }),
      }).then(async(res)=>{
        const data = await res.json();
        const response = data.state;
        if(response === 'Success'){
            location.reload();
        }else{
            console.log('response : ', response)
        }
      }).catch((err)=>{
          console.log(err)
      })
    }
    return (
        <div>
            <button onClick={openChangeModal}>방 정보를 변경하시겠습니까?</button>
            {
                openingChangeModal ?
                    <div>
                        <Form onSubmit={submitChangedRoomInfo}>
                            <label htmlFor="">
                                방 이름 : <input type="text" name="title"/>
                            </label>
                            <label htmlFor="">
                                방 설명 : <input type="text" name="description"/>
                            </label>
                            <button type="submit">제출</button>
                        </Form>
                        <button onClick={checkAuthority}>권한 체크</button>
                        <button onClick={closeChangeModal}>변경을 취소할래요</button>
                    </div>
                    : <div></div>
            }
        </div>
    )
}

export default ChangeRoomInfo;
