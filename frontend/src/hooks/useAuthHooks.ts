import { useMutation } from "@apollo/client";
import { LOGIN } from "../apollo/queries";

export const useLogin = () => {
  const [loginMutation, { loading, error }] = useMutation(LOGIN);

  const login = async (email: string, password: string) => {
    const { data } = await loginMutation({
      variables: {
        input: { email, password },
      },
    });

    if (data?.login) {
      localStorage.setItem("authToken", data.login.token);
      return data.login.user;
    }
    throw new Error("Login failed");
  };

  return { login, loading, error };
};
