import { constants } from "../../constants";

export const getCurrentUser = async () => {
  if (!sessionStorage.getItem(constants.sessionStorage.TOKEN)) {
    return false;
  }
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

export const formatText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};
