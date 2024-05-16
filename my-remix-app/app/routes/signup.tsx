import { Form } from '@remix-run/react';

const SignupLayout = () => {
    return (
        <div>
            <h1>회원가입 정보를 입력해주세요.</h1>
            <Form>
                <label>
                    email : <input type="text" name="email" placeholder="이메일을 입력해주세요." />
                </label>
                <label>
                    password : <input type="text" name="password" placeholder="비밀번호를 입력해주세요." />
                </label>
            </Form>
        </div>
    )
}
export default SignupLayout;
