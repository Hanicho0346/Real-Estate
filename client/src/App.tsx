import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import FeatureList from "./routes/homepage/FeatureList";
import { LayoutPage, RequireAuth } from "./routes/layout/LayoutPage";
import Login from "./routes/Login/Login";
import HomeLayout from "./routes/homepage/HomeLayout";
import SinglePage from "./routes/singlepage/SinglePage";
import ProfilePage from "./routes/Profile/ProfilePage";
import SignUp from "./routes/signup/SignUp";
import UpdateProfile from "./routes/UpdateProfile/UpdateProfile";
import AddPost from "./routes/post/AddPost";
import { singleloader, listPageLoader, profilepageLoader } from "./lib/loader";
import ErrorPage from "./routes/ErrorPage";
import { lazy } from "react";
import ListPageWrapper from "./LazyLoadSkeleton/ListPageWrapper";
import ProfilePageWrapper from "./LazyLoadSkeleton/profilePageWrapper";
import NotFound from "./routes/NotFound/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <ErrorPage />,
  },
  {
    path:"*",
    element:<NotFound/>,
    errorElement:<ErrorPage/>
  },
  {
    path: "/",
    element: <LayoutPage />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "features",
        element: <FeatureList />,
      },
      {
        path: "list",
        element: <ListPageWrapper />,
        loader: listPageLoader,
      },
      {
        path: "singlepage/:id",
        element: <SinglePage />,
        loader: singleloader,
        errorElement: <ErrorPage />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        element: <RequireAuth />,
        children: [
          {
            path: "profile",
            element: <ProfilePageWrapper />,
            loader: profilepageLoader,
          },
          {
            path: "profile/update",
            element: <UpdateProfile />,
          },
          {
            path: "profile/addpost",
            element: <AddPost />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
