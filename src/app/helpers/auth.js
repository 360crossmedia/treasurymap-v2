export const redirectIfNotAuthenticated = (userId, pathname, router) => {
  const allowedRoutes = [
    "/",
    "/signup",
    "/login",
    "/contactUs",
    "/article",
    "/insights",
    (path) => path.startsWith("/linkupdate"),
    (path) => path.startsWith("/companyPage"),
    (path) => path.startsWith("/restorePassword"),
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
