import {Link} from "@remix-run/react";

const HeaderLayout = (props:{status:boolean}) =>{
    return  (props.status
        ?
        <div>
            <h1>장바구니공유방</h1>
            <span>사용자이름</span>
            <Link to="/mypage">마이페이지</Link>
            <button>로그아웃하기</button>
        </div>
            :
            <div>
                <h1>장바구니공유방</h1>
            </div>);
}

export default HeaderLayout;