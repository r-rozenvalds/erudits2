import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { IUser } from "./interfaces/IUser";
import { useApi } from "../components/universal/RequestBuilder";
import { constants } from "../constants";
import { IUserLoginRequestModel } from "./interfaces/request/IUserLoginRequestModel copy";
import { IUserLoginResponseModel } from "./interfaces/response/IUserLoginResponseModel";
import { useToast } from "../components/universal/Toast";
import { localizeError, localizeSuccess } from "../localization";
import { useNavigate } from "react-router-dom";

type UserStoreType = {
  user?: IUser;
  getToken?: () => string | null;
  setUser: (user: IUser) => void;
  logout: () => Promise<boolean>;
  login: (request: IUserLoginRequestModel) => Promise<void>;
  getUser: () => Promise<boolean>;
};

const UserStore = createContext<UserStoreType | undefined>(undefined);

export const userStore = () => {
  const context = useContext(UserStore);
  if (!context) {
    throw new Error("Context must be used within a provider!");
  }

  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser>();
  const showToast = useToast();
  const navigate = useNavigate();

  const { get, post } = useApi();

  const logout = async () => {
    const response = await post<boolean>("/auth/logout");
    if (response) {
      setUser(undefined);
      localStorage.removeItem(constants.localStorage.TOKEN);
    }

    return response;
  };

  const login = async (request: IUserLoginRequestModel) => {
    await fetch(`${constants.baseApiUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }).then(async (response) => {
      if (response.ok) {
        const data: IUserLoginResponseModel = await response.json();
        showToast!(true, localizeSuccess(data.message));
        setUser(data.user);
        localStorage.setItem(constants.localStorage.TOKEN, data.token);
        navigate("/admin/games");
      } else {
        const data = await response.json();
        Object.keys(data).map((key) =>
          showToast!(false, localizeError(data[key]))
        );
      }
    });
  };

  const getUser = async () => {
    const response = await get<IUser>("/user");
    setUser(response?.items[0]);
    return response?.total_items > 0;
  };

  useEffect(() => {
    getUser();
  }, []);

  const getToken = () => {
    return localStorage.getItem(constants.localStorage.TOKEN);
  };

  return (
    <UserStore.Provider
      value={{ user, getToken, setUser, logout, login, getUser }}
    >
      {children}
    </UserStore.Provider>
  );
};
