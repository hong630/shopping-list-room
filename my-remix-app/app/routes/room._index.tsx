import LoginLayout from "~/component/loginLayout/LoginLayout";
import {LoaderFunction, redirect} from "@remix-run/node";
import {getUserSession} from "~/routes/session.server";
import {useLoaderData} from "react-router";
import {LoggedInUserData} from "~/data/dto";

//세션에서 로그인한 사용자 정보 가져오기
export const loader: LoaderFunction = async ({ request }) => {
    const data:LoggedInUserData = await getUserSession(request);
    return data;
};

const RoomIndex = () => {
    const data = useLoaderData() as LoggedInUserData;
    const { user, isLoggedIn } = data;
    console.log(user);
    return (
        <div>
            <LoginLayout status={isLoggedIn}/>
        </div>
    )
}

export default RoomIndex;
