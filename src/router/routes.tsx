import { lazy } from 'react';
const Index = lazy(() => import('../pages/Index'));
const Login = lazy(()=>import("../pages/Login"));
const Signup = lazy(()=>import("../pages/Signup"))

const routes = [
    // dashboard
    {
        path: '/',
        element: <Index />,
        layout: 'default',
    }
    

];

export { routes };
