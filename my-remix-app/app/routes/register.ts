import {Prisma, PrismaClient} from '@prisma/client';
import {LoaderFunction} from "@remix-run/node";
import {catchErrCode} from "~/utils/prismaErr";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import {UserDao} from "~/data/dao";

dotenv.config();

const prisma = new PrismaClient();


// 회원가입
// 비밀번호 암호화
const saltRoundsEnv = process.env.SALT_ROUNDS;
if (!saltRoundsEnv) {
        throw new Error("SALT_ROUNDS 환경 변수가 정의되지 않았습니다.");
}
const saltRounds = parseInt(saltRoundsEnv, 10);

//INFO 회원가입

// 비밀번호 해싱 함수
async function hashPassword(password:string) {
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(password, salt);
}
// 회원 정보 DB 입력
async function createUser(email: string, nickname:string, password: string) {
        const hashedPassword = await hashPassword(password);
        return prisma.user.create({
                data: { email, nickname, password: hashedPassword },
        });
}
// 회원 가입
async function signUp(body:UserDao){
        try {
                await createUser(body.email,body.nickname, body.password)
                return  {state:true}
        } catch (err){
                if(err instanceof Prisma.PrismaClientKnownRequestError){
                        return catchErrCode(err.code)
                }
                return  {state:'An error occurred while creating the user.'}
        }
}

//INFO LOGIN

// 로그인
async function login(body:UserDao){
        const loginEmail = body.email as string
        const loginPassword = body.password as string
        const userData = await prisma.user.findUnique({where:{email:loginEmail}})

        if (userData !== null){
                const compareBool =  await bcrypt.compare(loginPassword, userData.password)
                if(compareBool){
                        // TODO 여기서 Session에 회원 data 전달!
                        return {state: 'Success'}
                } else {
                        return {state:'Invalid Password'}
                }
        } else {
                return {state:'Invalid Email'}
        }

}



export const action:LoaderFunction = async (param) => {
        const body = await param.request.json();
        const method = param.request.method;
        switch (method) {
                case "POST":
                        return await login(body);
                case "PUT":
                        return await signUp(body)
                default :
                        return {status: "Err"}
        }
}

// read user
//로그인하기
//비밀번호 찾기


// update user
//비밀번호 변경하기
//비밀번호 리셋하기
//닉네임 변경하기

// delete user
// 탈퇴하기





// export const getUsers = async () => {
//         return prisma.user.findMany()
// }

// export const getTest = async () => {
//         const allUser = await getUsers()
//         console.log(allUser)
//         return json(allUser);
// }
//
// export const loader:LoaderFunction = () => {
//         return getTest()
// }