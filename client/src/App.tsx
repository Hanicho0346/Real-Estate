import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FeatureList from "./routes/homepage/FeatureList";
import { LayoutPage, RequireAuth } from "./routes/layout/LayoutPage";
import Login from "./routes/Login/Login";
import HomeLayout from "./routes/homepage/HomeLayout";
import ListPage from "./routes/ListPage/ListPage";
import SinglePage from "./routes/singlepage/SinglePage";
import ProfilePage from "./routes/Profile/ProfilePage";
import SignUp from "./routes/signup/SignUp";
import { Children } from "react";
import UpdateProfile from "./routes/UpdateProfile/UpdateProfile";
import AddPost from "./routes/post/AddPost";

const routes = [
  {
    path: "/",
    element: <HomeLayout />,
  },
  {
    element: <LayoutPage />,
    children: [
      {
        path: "features",
        element: <FeatureList />,
      },
      {
        path: "list",
        element: <ListPage />,
      },
      {
        path: "singlepage",
        element: <SinglePage />,
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
            element: <ProfilePage />,
          },
          {
            path: "profile/update",
            element: <UpdateProfile />,
          },
          {
            path:"profile/addpost",
            element:<AddPost/>
          }
        ],

      },
    ],
  },
];

function renderRoutes(routes) {
  return routes.map((route, index) => {
    if (route.children) {
      return (
        <Route key={index} path={route.path} element={route.element}>
          {renderRoutes(route.children)}
        </Route>
      );
    }
    return <Route key={index} path={route.path} element={route.element} />;
  });
}

function App() {
  return (
    <Router>
      <Routes>{renderRoutes(routes)}</Routes>
    </Router>
  );
}

export default App;
