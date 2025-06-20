import { Input, Button, Alert, Spinner } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { useUserContext } from "../../context/UserContextProvider";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../axiosClient";

const SignIn = () => {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const { setUser, setToken } = useUserContext();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // console.log(`key pressed: ${event.key}`);
      if (event.key === "Enter") {
        // console.log("Enter key pressed");
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const handleSubmit = () => {
    // e.preventDefault();
    setError(null);
    setIsLoading(true);
    // console.log(emailRef.current?.value);
    // console.log(passwordRef.current?.value);
    if (emailRef.current && passwordRef.current) {
      const payload = {
        uEmail: emailRef.current.value,
        uPassword: passwordRef.current.value,
      };
      // console.log(payload);
      axiosClient
        .post("/api/auth/signin/", payload)
        .then(({ data }) => {
          console.log(data);
          setUser(data.data.user);
          localStorage.setItem("USER_DATA", JSON.stringify(data.data.user));
          // console.log(user);
          setToken(data.data.token);
          if (data.data.user.uRole.trim() === "Администратор") {
            navigate("/admin");
          } else if (
            data.data.user.uRole.trim() === "Инженер по охране труда"
          ) {
            navigate("/engineer");
          }
        })
        .catch((err) => {
          // console.log(err);
          const response = err.response;
          console.log(response.data.data);
          if (
            (response && response.data.status === 422) ||
            response.status === 401
          ) {
            console.log(response.data.message);
            if (response.data.message === "Unauthorized") {
              setError("Ошибка авторизации пользователя");
            }
          }
          if (response.data.message === "Invalid request") {
            setError(response.data.data);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    setIsLoading(false);
  };
  return (
    <div>
      {isLoading ? (
        <div className="flex w-full h-screen justify-center items-center bg-slate-50">
          <p className="text-2xl font-bold">Вход в систему...</p>
          <Spinner size="lg" color="success" />
        </div>
      ) : (
        <>
          {error && (
            <div>
              {typeof error === "object" && !Array.isArray(error) ? (
                Object.keys(error).map((key) => (
                  <Alert key={key} color="warning">
                    {error[key]}
                  </Alert>
                ))
              ) : (
                <Alert color="warning">{error}</Alert>
              )}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <h1 className="font-medium text-center mb-5 text-3xl">
              Вход в систему
            </h1>
            <div className="mb-10">
              <Input
                isRequired
                errorMessage="Введите действительный адрес электронной почты."
                label="Почта"
                labelPlacement="outside"
                name="email"
                placeholder="example@gmail.com"
                type="email"
                ref={emailRef}
              />
            </div>

            <div>
              <Input
                isRequired
                label="Пароль"
                labelPlacement="outside"
                name="password"
                placeholder="********"
                type="password"
                ref={passwordRef}
                className="mb-6"
                validate={(value) => {
                  if (value.length < 3) {
                    return "Пароль должен быть не менее 3 символов";
                  }
                }}
              />
              <div className="w-full mt-6">
                <Button
                  color="success"
                  className="w-full"
                  onPress={handleSubmit}
                >
                  Войти
                </Button>
              </div>
            </div>
            <div className="mt-5">
              <h2 className="text-right text-gray-500">
                Нет аккаунта?{" "}
                <Link onPress={() => navigate("/signup")}>
                  <span className="text-blue-500 text-sm font-light mr-1">
                    {" "}
                    Зарегистрироваться
                  </span>
                </Link>
              </h2>
            </div>
            <div>{isLoading && <Spinner size="lg" color="success" />}</div>
          </form>
        </>
      )}
    </div>
  );
};

export default SignIn;
