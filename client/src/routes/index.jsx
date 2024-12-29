import { createBrowserRouter } from "react-router-dom";
import RegisterPage from "../pages/register.jsx";
import CheckEmail from "../pages/checkEmail.jsx"; 
import CheckPassword from "../pages/checkPassword.jsx";
import Home from "../pages/home.jsx";
import ForgetPassword from "../pages/forgetPassword.jsx";
import MessagePage from "../components/messagePage.jsx"; 
import App from "../App.jsx";
import AuthLayout from "../layouts/authLayout.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "register",
                element: <AuthLayout><RegisterPage /></AuthLayout>,
            },
            {
                path: "email",
                element: <AuthLayout><CheckEmail /></AuthLayout>,
            },
            {
                path: "password",
                element: <AuthLayout><CheckPassword /></AuthLayout>,
            },
            {
                path: "forget-password",
                element: <AuthLayout><ForgetPassword /></AuthLayout>,
            },
            {
                path: "/",
                element: <Home />,
                children: [
                    {
                        path: ":userId",
                        element: <MessagePage />,
                    },
                ],
            },
        ],
    },
]);

export default router;
