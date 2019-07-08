import Vue from 'vue'
import Router from 'vue-router'
import { md5, secretOrKey } from './common/util';
// import Index from './views/Index.vue'
// import Register from './views/register/Register'
// import Login from "./views/logo/Login";
// import Nofind from './views/404'
// import Home from './views/Home'
// import InfoShow from "./views/information/InfoShow";
// import Editor from "./views/information/Editor";
// import Markdown from "./views/information/Markdown";
// import ShowFundArticle from "./views/information/article/ShowFundArticle";
// import FundList from "./views/fundmanagement/FundList";
// import PayList from "./views/fundmanagement/PayList";
// import Staff from "./views/Staff";
// import ListUser from "./views/ListUser";
// import MapList from "./views/MapList";
// import ChinaTabsList from "./views/Investment/ChinaTabsList";
// import ChinaTouziList from "./views/Investment/ChinaTouziList";
// import FundPosition from "./views/capitalData/FundPosition";
// import Lock from './views/Lock.vue'


Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: "/",
      redirect: "index"
    },
    {
      path: "/index",
      name: "Index",
      component: () => import("./views/Index.vue"),
      meta: { title: "首页" },
      redirect: "/home",
      children: [
        {
          path: "/home",
          name: "home",
          component: () => import("./views/Home/Home"),
          meta: { title: "首页" }
        },
        {
          path: "/staff",
          name: "staff",
          component: () => import("./views/Staff"),
          meta: { title: "学员信息" }
        },
        {
          path: "/listuser",
          name: "listuser",
          component: () => import("./views/ListUser"),
          meta: { title: "代理信息" }
        },
        {
          path: "/listcustom",
          name: "listcustom",
          component: () => import("./views/ListCustom"),
          meta: { title: "客服信息" }
        },
        {
          path: "/usermanage",
          name: "usermanage",
          component: () => import("./views/UserManage"),
          meta: { title: "客服管理" }
        },
        {
          path: "/kcmanage",
          name: "kcmanage",
          component: () => import("./views/ListCourse"),
          meta: { title: "课程管理" }
        },
        {
          path: "/payList",
          name: "payList",
          component: () => import("./views/fundmanagement/PayList"),
          meta: { title: "支付单据" }
        },
        {
          path: "/Infoshow",
          name: "Infoshow",
          component: () => import("./views/information/InfoShow"),
          meta: { title: "个人信息" }
        },
        {
          path: "/editor",
          name: "editor",
          component: () => import("./views/information/Editor"),
          meta: { title: "富文本编辑器" }
        },
        {
          path: "/markdown",
          name: "markdown",
          component: () => import("./views/information/Markdown"),
          meta: { title: "Markdown编辑器" }
        },
        {
          path: "/showFundArticle",
          name: "showFundArticle",
          component: () =>
            import("./views/information/article/ShowFundArticle"),
          meta: { title: "文章列表" }
        },
        {
          path: "/chinaTouziList",
          name: "chinaTouziList",
          component: () => import("./views/Investment/ChinaTouziList"),
          meta: { title: "省份投资" }
        },
        {
          path: "/chinaTabsList",
          name: "ChinaTabsList",
          component: () => import("./views/Investment/ChinaTabsList"),
          meta: { title: "区域投资" }
        },
        {
          path: "/fundPosition",
          name: "fundPosition",
          component: () => import("./views/capitalData/FundPosition"),
          meta: { title: "投资分布" }
        },
        {
          path: "/maplist",
          name: "maplist",
          component: () => import("./views/MapList"),
          meta: { title: "地图展示" }
        }
      ]
    },
    {
      path: "/register",
      name: "register",
      component: () => import("./views/register/Register")
    },
    {
      path: "/login",
      name: "login",
      component: () => import("./views/logo/Login")
    },
    {
      path: "/lock",
      name: "lock",
      component: () => import("./views/Lock.vue")
    },
    {
      path: "*",
      name: "Nofind",
      component: () => import("./views/404")
    }
  ]
  // mode: "history"
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const eleToken = localStorage.eleToken;
  const avatar = localStorage.avatar;
  let avatarObj = avatar || 'zs';
  let av = avatarObj == 'zs' ? 0 : JSON.parse(avatarObj);
  const callmd5 = md5(av.call + secretOrKey);
  const isLogin = callmd5 == eleToken ? true : false
  if (to.path === '/login' || to.path === '/register') {
    next()
  } else {
    isLogin ? next() : next('/login')
  }

});

export default router