import {Prisma, PrismaClient} from '@prisma/client';
import {LoaderFunction} from "@remix-run/node";
import {catchErrCode} from "~/utils/prismaErr";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();


// 회원가입
// 비밀번호 암호화
const saltRoundsEnv = process.env.SALT_ROUNDS;
if (!saltRoundsEnv) {
        throw new Error("SALT_ROUNDS 환경 변수가 정의되지 않았습니다.");
}
const saltRounds = parseInt(saltRoundsEnv, 10);

// 비밀번호 해싱 함수
async function hashPassword(password:string) {
        const salt = await bcrypt.genSalt(saltRounds); // 솔트 생성
        const hash = await bcrypt.hash(password, salt); // 비밀번호와 솔트를 결합하여 해싱
        return hash;
}
//회원가입
export async function createUser(email: string, nickname:string, password: string) {
        const hashedPassword = await hashPassword(password);
        return prisma.user.create({
                data: { email, nickname, password: hashedPassword },
        });
}

export const action:LoaderFunction = async (param) => {
        const body = await param.request.json();
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