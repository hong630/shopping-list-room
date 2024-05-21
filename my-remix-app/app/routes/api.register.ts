import {Prisma, PrismaClient} from '@prisma/client';
import {ActionFunction, json} from "@remix-run/node";
import {catchErrCode} from "~/utils/prismaErr";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import {UserDao} from "~/data/dao";
import {commitSession, getSession} from "~/routes/session.server";

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
        console.log("bpdu")
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
export async function login(body: UserDao, cookie:string|null){
        const loginEmail = body.email as string
        const loginPassword = body.password as string
        const userData = await prisma.user.findUnique({where:{email:loginEmail}})

        if (userData !== null){
                const compareBool =  await bcrypt.compare(loginPassword, userData.password)
                if(compareBool){
                        // 세션에 user 전달
                        const session = await getSession(cookie);
                        session.set("user", { id: userData.id, email: userData.email, nickname: userData.nickname });
                        return json(
                            { state: 'Success' },
                            {
                                    headers: {
                                        "Set-Cookie": await commitSession(session),
                                },
                        });
                } else {
                        return {state:'Invalid Password'}
                }
        } else {
                return {state:'Invalid Email'}
        }

}



export const action:ActionFunction = async ({ request }) => {
        const method = request.method;
        const body = await request.json();
        const cookie = request.headers.get("Cookie")
        switch (method) {
                case "POST":
                        return await login(body, cookie);
                case "PUT":
                        return await signUp(body)
                default :
                        return {state: "Err"}
        }
}

// read user
//로그인하기
//비밀번호 찾기 (get)


// update user
//비밀번호 변경하기 (put)
//비밀번호 리셋하기 (put)
//닉네임 변경하기 (put)

// delete user
// 탈퇴하기 (delete)





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