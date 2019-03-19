// @material-ui/icons
import DashboardIcon from "@material-ui/icons/Dashboard";
import AddIcon from "@material-ui/icons/Add";
import ListIcon from "@material-ui/icons/List";
import PersonIcon from "@material-ui/icons/Person";

// core components/views for Admin layout
import DashboardPage from "../views/Dashboard";
import AddProductsPage from "../views/AddProducts";
import ListProductsPage from "../views/ListProducts";
import AccountPage from "../views/Account";

const userRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: DashboardIcon,
    component: DashboardPage,
    parent: "/app"
  },
  {
    path: "/add",
    name: "Add Products",
    icon: AddIcon,
    component: AddProductsPage,
    parent: "/app"
  },
  {
    path: "/list",
    name: "List Products",
    icon: ListIcon,
    component: ListProductsPage,
    parent: "/app"
  },
  {
    path: "/account",
    name: "Account",
    icon: PersonIcon,
    component: AccountPage,
    parent: "/app"
  }
];

export default UsersRoutes;
