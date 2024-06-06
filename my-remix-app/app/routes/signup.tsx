import { Form } from '@remix-run/react';
import React, {useState} from "react";
import type { LinksFunction } from "@remix-run/node"
import styles from "../styles/signup.css?url"
import {checkOver, sanitizeValue, validateEmail, validatePassword} from "~/utils/sanitize";
import {togglePasswordVisibility} from "~/utils/buttonsFunction";
import VisibilityIcon from "~/component/common/VisibilityIcon";
import AuthHeader from "~/component/common/AuthHeader";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: styles },
];
const SignupLayout = () => {

    //이메일 유효성 검사 에러 메시지
    const [noEmail, setNoEmail] = useState(false);
    const [incorrectEmail, setIncorrectEmail] = useState(false);
    const [existEmail, setExistEmail] = useState(false);

    //비밀번호 유효성 검사 에러 메시지
    const [incorrectPassword, setIncorrectPassword] = useState(false);
    const [noPassword, setNoPassword] = useState(false);

    //닉네임 유효성 검사 에러 메시지
    const [overNickname, setOverNickname] = useState(false);

    //회원가입 API
    const signupApi = (email:string, nickname:string, password:string) => {
        fetch("http://localhost:3000/api/register",
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
                if (data.state == true){
                    location.href = '/room';
                } else {
                    if (data.state === 'An error occurred while creating the user.'){
                        //이미 존재하는 이메일
                        setExistEmail(true);
                    }else{
                        setExistEmail(false);
                        alert(data.state);
                    }
                }
            })
            .catch((err)=>{
                console.log(err)
            })
    }

    //이메일 유효성 검사
    const checkEmail = async (email:string) => {
        if(email === ''){
            return 'noEmail'
        }else{
            const validatedEmail = await validateEmail(email.toString());
            switch (validatedEmail) {
                case true :
                    return 'correctEmail';
                    break;
                case false:
                    return 'incorrectEmail';
                    break;
                default:
                    return validatedEmail;
                    break;
            }
        }
    }

    //비밀번호 유효성 검사
    const checkPassword = async (password:string)=>{
        if(password === null){
            return 'noPassword'
        }else{
            const validatedPassword = await validatePassword(password);
            switch (validatedPassword) {
                case true :
                    return 'correctPassword';
                    break;
                case false:
                    return 'incorrectPassword';
                    break;
                default:
                    return validatedPassword;
                    break;
            }
        }
    }


    //회원가입
    const DoSignup = async (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email");
        const nickname = formData.get("nickname");
        const password = formData.get("password");

        //유효성 검사
        if(email !== null && nickname !== null && password !== null){
            //스크립트 태그, HTML 태그 제거
            const sanitizedEmail = await sanitizeValue(email.toString());
            let sanitizedNickname = await sanitizeValue(nickname.toString());
            const sanitizedPassword = await sanitizeValue(password.toString());

            //이메일 유효성 검사
            const checkedEmail = await checkEmail(sanitizedEmail);
            switch (checkedEmail){
                case 'noEmail':
                    //이메일이 없음
                    setNoEmail(true);
                    break;
                case 'correctEmail':
                    //올바른 이메일
                    setNoEmail(false);
                    setIncorrectEmail(false);
                    break;
                case 'incorrectEmail':
                    //올바르지 않은 이메일
                    setIncorrectEmail(true);
                    break;
                default :
                    alert('에러가 발생했습니다. 다시 시도해주세요.');
                    break;
            }

            //비밀번호 유효성 검사
            const checkedPassword = await checkPassword(sanitizedPassword);
            switch (checkedPassword){
                case 'noPassword' :
                    //비밀번호가 없을 때
                    setNoPassword(true);
                    break;
                case 'correctPassword' :
                    //옳은 비밀번호일 때
                    setNoPassword(false);
                    setIncorrectPassword(false);
                    break;
                case 'incorrectPassword' :
                    //옳지 않은 비밀번호일 때
                    setIncorrectPassword(true);
                    break;
                default:
                    alert('에러가 발생했습니다. 다시 시도해주세요.');
                    break;
            }

            let checkedNickname;
            if(sanitizedNickname.length === 0){
                sanitizedNickname = '햄스터';
                checkedNickname = true;
            }else{
                //닉네임이 10자를 넘는 지 체크
                switch (await checkOver(sanitizedNickname, 10)){
                    case true :
                        setOverNickname(false);
                        checkedNickname = true;
                        break;
                    case false :
                        setOverNickname(true);
                        checkedNickname = false;
                        break;
                    default:
                        break;
                }
            }

            //모든 조건을 충족 시 회원가입 API
            if(checkedEmail === 'correctEmail'
                && checkedPassword === 'correctPassword'
                && checkedNickname === true){
                signupApi(sanitizedEmail, sanitizedNickname, sanitizedPassword)
            }

        }
    }
    //비밀번호 노출/비노출 관련 기능
    const [visibility, setVisibility] = useState(true);

    const toggleVisibilityIcon = () => {
        setVisibility(!visibility);
    }

    const handleVisibility = (event: React.MouseEvent<HTMLButtonElement>) => {
        togglePasswordVisibility(event);
        toggleVisibilityIcon();
    }
    //유효성 검사 경고 시 스타일 변화
    const emailInputStyle = {
        color: (noEmail || incorrectEmail || existEmail) ? '#d64d46' : 'inherit'
    };

    const passwordInputStyle = {
        color: (incorrectPassword || noPassword) ? '#d64d46' : 'inherit'
    };

    const nicknameInputStyle = {
        color: (overNickname) ? '#d64d46' : 'inherit'
    };

    //input에 포커스 시 스타일 변화 해제
    const emailErrorHandleFocus = () => {
        setNoEmail(false);
        setIncorrectEmail(false);
        setExistEmail(false);
    };

    const passwordErrorHandleFocus = () => {
        setIncorrectPassword(false);
        setNoPassword(false);
    }

    const nicknameErrorHandleFocus = () => {
        setOverNickname(false);
    }

    return (
        <div>
            <AuthHeader/>
            <div className="wrap">
                <div className="img-container img-shopping">
                    <img src="/shopping.png" alt="shopping image"/>
                </div>
                <h1>회원가입</h1>
                <Form onSubmit={DoSignup} className="form-container">
                    <div className="input-container">
                        <label htmlFor="email">아이디</label>
                        <input type="text" name="email" style={emailInputStyle}
                               onFocus={emailErrorHandleFocus} placeholder="example@gmail.com" required/>
                        {existEmail ?
                            <p className="warning-message">이미 존재하는 아이디입니다.</p>
                            :
                            <div></div>
                        }
                        {incorrectEmail ?
                            <p className="warning-message">올바른 아이디 형식이 아닙니다.</p>
                            :
                            <div></div>
                        }
                        {noEmail ?
                            <p className="warning-message">아이디를 입력하지 않았습니다.</p>
                            :
                            <div></div>
                        }
                    </div>
                    <div className="input-container">
                        <label htmlFor="password">비밀번호</label>
                        <div className="password-input-container">
                            <input type="password" name="password" style={passwordInputStyle}
                                   onFocus={passwordErrorHandleFocus} placeholder="특수문자 포함 8자 이상" required/>
                            <button className="btn-visibility" onClick={handleVisibility}>
                                <VisibilityIcon visibility={visibility}></VisibilityIcon>
                            </button>
                        </div>
                        {incorrectPassword ?
                            <p className="warning-message">올바른 비밀번호 형식이 아닙니다.</p>
                            :
                            <div></div>
                        }
                        {noPassword ?
                            <p className="warning-message">비밀번호를 입력하지 않았습니다.</p>
                            :
                            <div></div>
                        }
                    </div>
                    <div className="input-container">
                        <label htmlFor="nickname">닉네임</label>
                        <input type="text" name="nickname" style={nicknameInputStyle}
                               onFocus={nicknameErrorHandleFocus} placeholder="10자 이하로 입력해주세요." required/>
                        {overNickname ?
                            <p className="warning-message">닉네임을 10자 이하로 작성해주세요.</p>
                            :
                            <div></div>
                        }
                    </div>
                    <div className="buttons-wrap">
                        <button type="submit">회원가입</button>
                    </div>
                </Form>
            </div>
        </div>
    )
}
export default SignupLayout;
