import { constants } from "../../constants";

export const getCurrentUser = async () => {
  try {
    const response = await fetch(`${constants.baseApiUrl}/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem(
          constants.sessionStorage.TOKEN
        )}`,
      },
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return false;
  }
};
