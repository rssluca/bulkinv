// @material-ui/icons
import DashboardIcon from "@material-ui/icons/Dashboard";
import AddIcon from "@material-ui/icons/Add";
import ListIcon from "@material-ui/icons/List";
import PersonIcon from "@material-ui/icons/Person";
import SettingsIcon from "@material-ui/icons/Settings";
// core components/views for Admin layout
import DashboardPage from "../views/Dashboard";
import AddProductsPage from "../views/AddProducts";
import ListProductsPage from "../views/ListProducts";
import AccountPage from "../views/Account";
import AdminPage from "../views/Admin";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: DashboardIcon,
    component: DashboardPage,
    layout: "/app"
  },
  {
    path: "/add",
    name: "Add Products",
    icon: AddIcon,
    component: AddProductsPage,
    layout: "/app"
  },
  {
    path: "/list",
    name: "List Products",
    icon: ListIcon,
    component: ListProductsPage,
    layout: "/app"
  },
  {
    path: "/account",
    name: "Account",
    icon: PersonIcon,
    component: AccountPage,
    layout: "/app"
  },
  {
    path: "/admin",
    name: "Admin",
    icon: SettingsIcon,
    component: AdminPage,
    layout: "/app"
  }
];

export default dashboardRoutes;
