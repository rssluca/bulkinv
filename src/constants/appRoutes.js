// @material-ui/icons
import DashboardIcon from "@material-ui/icons/Dashboard";
import AddIcon from "@material-ui/icons/Add";
// import ListIcon from "@material-ui/icons/List";
import PersonIcon from "@material-ui/icons/Person";
import PeopleIcon from "@material-ui/icons/People";
import SettingsIcon from "@material-ui/icons/Settings";
import DescriptionIcon from "@material-ui/icons/Description";
// import NoteAddIcon from "@material-ui/icons/NoteAdd";
// import PersonAddIcon from "@material-ui/icons/PersonAdd";

// core components/views for Admin layout
import DashboardPage from "../views/user/Dashboard";
import ProductsPage from "../views/user/Products";
import SettingsPage from "../views/user/Settings";
import AccountPage from "../views/user/Account";
import AdminDashboardPage from "../views/admin/Dashboard";
import AdminUsersPage from "../views/admin/Users";
import AdminCategoriesPage from "../views/admin/Categories";

const appRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: DashboardIcon,
    component: DashboardPage,
    parent: "/app"
  },
  {
    path: "/products",
    name: "Products",
    icon: AddIcon,
    component: ProductsPage,
    parent: "/app"
  },
  {
    path: "/settings",
    name: "Settings",
    icon: SettingsIcon,
    component: SettingsPage,
    parent: "/app"
  },
  {
    path: "/account",
    name: "Account",
    icon: PersonIcon,
    component: AccountPage,
    parent: "/app"
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: DashboardIcon,
    component: AdminDashboardPage,
    parent: "/admin"
  },
  {
    path: "/users",
    name: "Users",
    icon: PeopleIcon,
    component: AdminUsersPage,
    parent: "/admin"
  },
  {
    path: "/categories",
    name: "Categories",
    icon: DescriptionIcon,
    component: AdminCategoriesPage,
    parent: "/admin"
  }
];

export default appRoutes;
