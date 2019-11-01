/*!

=========================================================
* Argon Dashboard React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Bookings from "screens/Bookings.jsx";
import SignUpRequests from "screens/SignUpRequests.jsx";
import GenerateBill from "screens/GenerateBill.jsx";
import Notifications from "screens/Notifications.jsx";
import Analytics from "screens/Analytics.jsx";
import Profile from "screens/Profile.jsx";
import Register from "views/examples/Register.jsx";
import Login from "views/examples/Login.jsx";

var routes = [
  {
    path: "/bookings",
    name: "Bookings",
    icon: "ni ni-send text-pink",
    component: Bookings,
    layout: "/admin"
  },
  {
    path: "/sign-up-requests",
    name: "Sign Up Requests",
    icon: "ni ni-badge text-blue",
    component: SignUpRequests,
    layout: "/admin"
  },
  {
    path: "/generate-bill",
    name: "Generate Bill",
    icon: "ni ni-money-coins text-orange",
    component: GenerateBill,
    layout: "/admin"
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: "ni ni-bell-55 text-yellow",
    component: Notifications,
    layout: "/admin"
  },
  {
    path: "/analytics",
    name: "Analytics",
    icon: "ni ni-chart-bar-32 text-red",
    component: Analytics,
    layout: "/admin"
  },
  {
    path: "/profile",
    name: "Profile",
    icon: "ni ni-single-02 text-info",
    component: Profile,
    layout: "/admin"
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth"
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: Register,
    layout: "/auth"
  }
];
export default routes;
