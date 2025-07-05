import { useSignIn } from "@clerk/clerk-react";
import { images } from "../assets";
import { useState } from "react";
// import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { Loader2Icon } from "lucide-react";

const Login = () => {
  const { signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("wetwan080@gmail.com");
  const [password, setPassword] = useState("@PtMa5gwe7QgGCm");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!signIn) {
        setError("Sign-in service is not available.");
        return;
      }
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("Login successful");
        navigate(`/food`);
      } else {
        console.log("Sign-in response", result);
      }
    } catch (err: unknown) {
      type ClerkError = { errors: { message: string }[] };
      if (
        typeof err === "object" &&
        err !== null &&
        "errors" in err &&
        Array.isArray((err as ClerkError).errors)
      ) {
        setError((err as ClerkError).errors?.[0]?.message || "Sign up failed");
      } else {
        setError("Sign up failed");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="lg:p-5">
      <div>
        <img src={images.Logo} width={60} height={60} />
      </div>
      <form
        className=" sm:w-[500px] h-auto p-2 px-5  sm:mx-auto mx-5 border-green-400 borde shadow shadow-green-200 mt-20 sm:mt-40 rounded-xl bg-white"
        onSubmit={handleLogin}
      >
        <h2 className="my-10 font-extrabold"> Employee Login</h2>

        <div className="flex flex-col gap-2 my-6 capitalize">
          <label htmlFor="email">email address</label>
          <input
            type="email"
            id="email"
            placeholder="email address"
            value={email}
            onChange={(t) => setEmail(t.target.value)}
            className="md:py-5  py-3 border px-3 border-green-400 outline-0 rounded-md"
          />
        </div>
        <div className="flex flex-col gap-2 my-6 capitalize">
          <label htmlFor="password">password </label>
          <input
            type="password"
            id="password"
            placeholder="password "
            value={password}
            onChange={(t) => setPassword(t.target.value)}
            className="md:py-5  py-3 border px-3  border-green-400 outline-0 rounded-md"
          />
        </div>

        {error && <p className="border border-red-300 p-3 w-fit">{error}</p>}
        {loading ? (
          <button
            disabled
            className=" w-[60%] mx-auto my-10 bg-green-200 py-6 text-lg font-bold leading-8 capitalize  text-white rounded-2xl flex items-center justify-center"
          >
            <Loader2Icon className="animate-spin text-green-800" />
          </button>
        ) : (
          <button className="block w-[60%] mx-auto my-10 bg-green-400 py-6 text-lg font-bold leading-8 capitalize  text-white rounded-2xl">
            login
          </button>
        )}
      </form>
    </div>
  );
};

export default Login;
