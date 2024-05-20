import { Form } from '@remix-run/react';
import React from "react";

const SignupLayout = () => {
    //회원가입
    const DoSignup = (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email");
        const nickname = formData.get("nickname");
        const password = formData.get("password");

        //TODO 유효성 검사 필요

        // 회원가입 API
        fetch("http://localhost:5173/register",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    nickname : nickname,
                    password: password
                }),
            })
            .then(async (res)=>{
                const data = await res.json()
                console.log(data)
                if (data.state == true){
                    alert('회원가입에 성공했습니다. 로그인 해주세요.')
                    location.href = '/room';
                } else {
                    alert(data.state)
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
    return (
        <div>
            <h1>회원가입 정보를 입력해주세요.</h1>
            <Form onSubmit={DoSignup}>
                <label>
                    아이디 : <input type="text" name="email" placeholder="이메일을 입력하세요." required/>
                </label>
                <label>
                    닉네임 : <input type="text" name="nickname" placeholder="서비스에서 사용할 닉네임을 적어주세요." required/>
                </label>
                <label>
                    비밀번호 : <input type="text" name="password" placeholder="비밀번호를 입력하세요." required/>
                </label>
                <button type="submit">submit</button>
            </Form>
        </div>
    )
}
export default SignupLayout;
