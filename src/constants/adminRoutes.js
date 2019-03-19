// @material-ui/icons
import DashboardIcon from "@material-ui/icons/Dashboard";
import PeopleIcon from "@material-ui/icons/People";

// core components/views for Admin layout
import AdminDashboardPage from "../views/AdminDashboard";
import AdminUsersPage from "../views/AdminUsers";

const adminRoutes = [
  {
    path: "/dashboard",
    name: "Admin - Dashboard",
    icon: DashboardIcon,
    component: AdminDashboardPage,
    parent: "/admin"
  },
  {
    path: "/users",
    name: "Admin - Users",
    icon: PeopleIcon,
    component: AdminUsersPage,
    parent: "/admin"
  }
];

export default adminRoutes;
