export const redirectIfNotAuthenticated = (userId, pathname, router) => {
  const allowedRoutes = [
    "/login",
    "/signup",
    "/contactUs",
    "/",
    (path) => path.startsWith("/companyPage"),
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
