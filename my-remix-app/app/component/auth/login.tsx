import {Form} from "@remix-run/react";
import React, {useState} from "react";

const LoginComponent = () => {
    //로그인 화면 토글
    const [login, setLogin] = useState<boolean>(true);

    //비밀번호 찾기 모달 토글
    const [findingPasswordPage, setFindingPasswordPage] = useState<boolean>(false);

    //비밀번호 찾기 결과 메시지
    const [findingPasswordResult, setFindingPasswordResult] = useState<string>('');

    //로그인 실패 메시지
    const [failedLogin, setFailedLogin] = useState<string>('');

    //로그인 페이지 닫기
    const closeLogin = () => {
        setLogin(false)
    }

    //로그인 페이지 열기
    const openLogin = () => {
        setLogin(true)
    }

    //로그인 실패 모달 닫기 누르면 reload
    const reloadLogin = () => {
        location.reload();
    }

    //로그인 성공 체크
    const tryLogin = (event:React.FormEvent<HTMLFormElement>) => {
        console.log('tryLogin working');
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

        //로그인 API
        fetch("http://localhost:5173/api/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
            })
            .then(async (res)=>{
                console.log(res)
                const data = await res.json()
                // console.log(data)
                const response = data.state;
                if (response === 'Success'){
                    //방 목록 페이지로 이동
                    location.reload();
                }else if(response === 'Invalid Email'){
                    //로그인 실패 모달 열기
                    setFailedLogin('Invalid Email');
                }else if(response === 'Invalid Password'){
                    //로그인 실패 모달 열기
                    setFailedLogin('Invalid Password');
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

    //비밀번호 찾기 모달 열기
    const openPasswordPage = () => {
        //로그인 페이지 닫기
        closeLogin();
        setFindingPasswordPage(true);
    }

    //비밀번호 찾기 모달 닫기
    const closePasswordPage = () => {
        setFindingPasswordPage(false);
    }

    //없는 이메일일 때 다시 입력해달라는 메시지 열기
    const openModalAskingRetry = () => {
        setFindingPasswordResult('none');
    }

    //있는 이메일일 때 리셋 이메일 보냈다는 안내 메시지 열기
    const openModalResetCompleted = () => {
        setFindingPasswordResult('email');
    }

    //비밀번호 찾기 결과 보여주기
    const showFindingPasswordResult = (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        //비밀번호 찾기 모달 닫기
        closePasswordPage();
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email");

        //비밀번호 찾기 결과 모달 열기
        //TODO 이메일 유무 체크 API
        //비밀번호 변경 API
        fetch("http://localhost:5173/api/changeUser",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type : 'resetPassword',
                    email: email
                }),
            })
            .then(async (res)=>{
                const data = await res.json()
                const response = data.state;
                console.log(response)
                if (response === 'Success'){
                    //있는 이메일일 때 리셋 이메일 보냈다는 안내 메시지 열기
                    openModalResetCompleted();
                }else{
                    //없는 이메일일 때 다시 입력해달라는 메시지 열기
                    openModalAskingRetry();
                    console.log(response)
                }
            })
            .catch((err)=>{
                console.log(err)
                //없는 이메일일 때 다시 입력해달라는 메시지 열기
                openModalAskingRetry();
            })
            .finally(()=>{
                    console.log("끝")
                }
            )
    }

    //비밀번호 찾기 결과 확인 누르면, 비밀번호 찾기 결과 모달 닫고 다시 비밀번호 찾기 모달 열기 (이메일 없는 경우)
    const openPasswordPageAgain = () => {
        setFindingPasswordResult('');
        //비밀번호 찾기 모달 열기
        openPasswordPage();
    }

    //비밀번호 찾기 결과 확인 누르면, 비밀번호 찾기 결과 모달 닫고 다시 로그인하기 모달 열기 (이메일 있는 경우)
    const openLoginAgain = () => {
        setFindingPasswordResult('');
        openLogin();
    }


    return (
        <div>
            {
                login?
                    <div>
                        <Form onSubmit={tryLogin}>
                            <label>
                                아이디 : <input type="text" name="email" placeholder="이메일을 입력하세요." required/>
                            </label>
                            <label>
                                비밀번호 : <input type="password" name="password" placeholder="비밀번호를 입력하세요." required/>
                            </label>
                            <button type="submit">submit</button>
                        </Form>
                        <button onClick={openPasswordPage}>비밀번호가 기억이 안나세요?</button>
                    </div>
                    :
                    <div></div>
            }
            {
                failedLogin === 'Invalid Email'?(
                    <div>
                        <p>존재하지 않는 아이디입니다. 다시 시도해주세요.</p>
                        <button onClick={reloadLogin}>확인</button>
                    </div>
                ):failedLogin === 'Invalid Password'?(
                        <div>
                            <p>아이디와 비밀번호가 일치하지 않습니다. 다시 시도해주세요.</p>
                            <button onClick={reloadLogin}>확인</button>
                        </div>
                ):(<div></div>)
            }
            {
                findingPasswordPage ?
                    <div>
                        <Form onSubmit={showFindingPasswordResult}>
                            <label htmlFor="">
                                아이디를 입력하세요 : <input type="text" name="email" placeholder="이메일을 입력하세요"/>
                            </label>
                            <button type="submit">제출</button>
                        </Form>
                    </div>
                    :
                    <div></div>
            }
            {
                findingPasswordResult === 'none' ? (
                    <div>
                        <p>존재하지 않는 아이디입니다. 다시 시도해주세요.</p>
                        <button onClick={openPasswordPageAgain}>확인</button>
                    </div>
                ) : findingPasswordResult === 'email' ? (
                    <div>
                        <p>임시 비밀번호를 이메일로 전송했습니다. 이메일을 확인해주세요.</p>
                        <button onClick={openLoginAgain}>확인</button>
                    </div>
                ) : (<div></div>)
            }
        </div>
    )
}

export default LoginComponent;