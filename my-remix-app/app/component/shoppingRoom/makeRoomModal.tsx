import { Form } from '@remix-run/react';
const MakeRoomModal = () => {
    return (
        <div style={{
            backgroundColor: 'pink',
            position : 'fixed',
            top : '50%',
            left : '50%',
            transform : 'translate(-50%,-50%)'
        }}>
            <Form>
                <label htmlFor="">
                     이름 : <input type="text" name='shoppingListRoomName' placeholder='장바구니공유방 이름을 적어주세요.'/>
                </label>
                <label htmlFor="">
                    설명 : <input type="text" name='detail' placeholder='장바구니공유방 설명을 적어주세요.'/>
                </label>
            </Form>
        </div>
    )
}

export default MakeRoomModal;