import { constants } from "../../constants";
import { localizeError, localizeSuccess } from "../../localization";
import { Empty, IPagedResult } from "../../stores/interfaces/IPagedResult";
import { useToast } from "./Toast";

export const useApi = () => {
  const showToast = useToast();

  const post = async <T, D = null>(
    endpoint: string,
    data?: D,
    hideSuccessToast?: boolean
  ): Promise<T> => {
    try {
      const response = await fetch(`${constants.baseApiUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(
            constants.localStorage.TOKEN
          )}`,
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData?.message || "An error occurred");
      }

      if (!hideSuccessToast && responseData?.message) {
        showToast(true, localizeSuccess(responseData.message));
      }
      return responseData as T;
    } catch (error: any) {
      console.error("POST request failed:", error);
      showToast(false, localizeError(error?.message) ?? "Unknown error");
      return false as T;
    }
  };

  const get = async <T, Q = null>(
    endpoint: string,
    query?: Q
  ): Promise<IPagedResult<T>> => {
    try {
      const queryString = new URLSearchParams(
        query as Record<string, string>
      ).toString();
      const url = `${constants.baseApiUrl}${endpoint}${
        query ? `?${queryString}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(
            constants.localStorage.TOKEN
          )}`,
        },
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || "An error occurred");
      }

      return await response.json();
    } catch (error: any) {
      console.error("GET request failed:", error);
      showToast(false, "Kļūda iegūstot datus");
      return Empty<T>();
    }
  };

  const put = async <T, D>(
    endpoint: string,
    data: D,
    hideSuccessToast?: boolean
  ): Promise<T> => {
    try {
      const response = await fetch(`${constants.baseApiUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(
            constants.localStorage.TOKEN
          )}`,
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData?.message || "An error occurred");
      }

      if (!hideSuccessToast && responseData?.message) {
        showToast(true, localizeSuccess(responseData.message));
      }
      return responseData as T;
    } catch (error: any) {
      console.error("POST request failed:", error);
      showToast(false, localizeError(error?.message) ?? "Unknown error");
      return false as T;
    }
  };

  return { post, get };
};
