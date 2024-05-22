import {ActionFunction, json} from "@remix-run/node";
import {UserDao} from "~/data/dao";
import {PrismaClient} from "@prisma/client";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import {commitSession, getSession} from "~/routes/session.server";

dotenv.config();

const prisma = new PrismaClient();


//INFO 비밀번호 변경하기
//비밀번호 암호화
const saltRoundsEnv = process.env.SALT_ROUNDS;
if (!saltRoundsEnv) {
    throw new Error("SALT_ROUNDS 환경 변수가 정의되지 않았습니다.");
}
const saltRounds = parseInt(saltRoundsEnv, 10);
// 비밀번호 해싱 함수
async function hashPassword(password:string) {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
}

//비밀번호 변경 (prisma)
async function updatePassword(email:string, newPassword:string) {
    const hashedNewPassword = await hashPassword(newPassword);
    try {
        const updatedUser = await prisma.user.update({
            where: {
                email: email,
            },
            data: {
                password: hashedNewPassword,
            },
        });
        console.log('Password updated:', updatedUser);
    } catch (error) {
        console.error('Error updating password:', error);
    }
}

//비밀번호 변경
async function changePassword(body:UserDao){
    try {
        await updatePassword(body.email,body.password)
        return  {state:"Success"}
    } catch (err){
        return  {state:err}
    }
}


//INFO 닉네임 변경

//닉네임 변경 (prisma)
async function updateNickname(email:string, nickname:string) {
    try {
        const updatedUser = await prisma.user.update({
            where: {
                email: email,
            },
            data: {
                nickname: nickname,
            },
        });
        console.log('Nickname updated:', updatedUser);
    } catch (error) {
        console.error('Error updating nickname:', error);
    }
}
//닉네임 변경
async function changeNickname(body:UserDao, cookie:string | null){
    try {
        await updateNickname(body.email,body.nickname);
        //세션 갱신
        const userData = await prisma.user.findUnique({where:{email:body.email}})
        if(userData !== null){
            const session = await getSession(cookie);
            session.set('user', {
                id: userData.id,
                email: userData.email,
                nickname: body.nickname,
            });
            return json(
                { state: 'Success' },
                {
                    headers: {
                        "Set-Cookie": await commitSession(session),
                    },
                });
        }
    } catch (err){
        return  {state:err}
    }
}

//INFO 비밀번호 초기화

// 랜덤 비밀번호 생성 함수
function generateRandomPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let password = '';
    for (let i = 0; i < 5; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// 이메일 전송 설정
const transporter = nodemailer.createTransport({
    service: 'Gmail', // 원하는 이메일 서비스 사용
    auth: {
        user: 'hongihongi60@gmail.com',
        pass: process.env.EMAIL_PASSWORD,
    },
});



export const action:ActionFunction = async ({ request }) => {
    const body = await request.json();
    const cookie = request.headers.get("Cookie");
    switch (body.type) {
        case "password":
            return await changePassword(body);
        case "nickname":
            return await changeNickname(body, cookie);
        default :
            return {state: "Err"}
    }
}