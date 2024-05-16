import {Form} from "@remix-run/react";

const LoginComponent = () => {
    return (
        <Form>
            <label>
                아이디 : <input type="text" name="email" placeholder="이메일을 입력하세요."/>
            </label>
            <label>
                비밀번호 : <input type="text" name="password" placeholder="비밀번호를 입력하세요."/>
            </label>
        </Form>
    )
}

export default LoginComponent;