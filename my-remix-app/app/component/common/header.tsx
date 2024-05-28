import {Link} from "@remix-run/react";

const HeaderLayout = (props:{status:boolean}) =>{

    //로그아웃 API
    const logout = () => {
        fetch("http://localhost:3000/api/logout",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(async (res)=>{
                console.log(res)
                const data = await res.json()
                // console.log(data)
                const response = data.state;
                if (response === 'Success'){
                    //로그인 페이지로 이동
                    location.reload();
                }else{
                    alert('로그아웃에 실패했습니다. 다시 시도해주세요.')
                    location.reload();
                }
            })
            .catch((err)=>{
                console.log(err)
                alert('로그아웃에 실패했습니다. 다시 시도해주세요.')
                location.reload();
            })
            .finally(()=>{
                }
            )
    }

    return  (props.status
        ?
        <div>
            <h1>장바구니공유방</h1>
            <span>사용자이름</span>
            <Link to="/mypage">마이페이지</Link>
            <button onClick={logout}>로그아웃하기</button>
        </div>
            :
            <div>
                <h1>장바구니공유방</h1>
            </div>);
}

export default HeaderLayout;