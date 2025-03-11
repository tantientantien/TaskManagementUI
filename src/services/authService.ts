import Cookies from "js-cookie";

export const logout = async (navigate: (path: string) => void) => {
  try {
    const response = await fetch("https://localhost:7186/api/users/logout", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      console.error("Logout API failed", response.statusText);
      return;
    }
    Cookies.remove(".AspNetCore.Identity.Application");
    Cookies.remove("refreshToken");
    localStorage.removeItem("user");
    navigate("/login");
  } catch (error) {
    console.error("Network error while logging out", error);
  }
};
