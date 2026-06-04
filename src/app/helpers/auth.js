export const redirectIfNotAuthenticated = (userId, pathname, router) => {
  const allowedRoutes = [
    "/",
    "/signup",
    "/login",
    "/contactUs",
    "/article",
    (path) => path.startsWith("/procedural-map"),
    (path) => path.startsWith("/insights"),
    (path) => path.startsWith("/linkupdate"),
    (path) => path.startsWith("/companyPage"),
    (path) => path.startsWith("/providers"),
    (path) => path.startsWith("/get-my-list"),
    (path) => path.startsWith("/restorePassword"),
    (path) => path.startsWith("/publication/article"),
    (path) => path.startsWith("/publication/video"),
  ];

  if (
    !userId &&
    !allowedRoutes.some((route) =>
      typeof route === "string" ? route === pathname : route(pathname)
    )
  ) {
    router.push("/login");
  }
};
