import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { Loader2Icon } from "lucide-react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../config/Firebase";

const AddUser = () => {
  const navigate = useNavigate();
  const { signUp, setActive } = useSignUp();

  // const userId = user?.id;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!signUp) {
        setError("Sign up service is not available.");
        return;
      }
      const result = await signUp.create({
        emailAddress: email,
        password,
        firstName: firstname,
        lastName: lastname,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("Account created successful");
        navigate(`/food`);

        await setDoc(doc(db, "shop-Employee", result.id as string), {
          lastname: lastname,
          firstname: firstname,
          email: email,
          role: role,
        });
        setLoading(false);
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
    <div className="w-[400px] mx-auto mt-10 shadow-xl rounded-md shadow-stone-300 p-4">
      <h2 className="my-10 font-extrabold">Add employee </h2>
      <form onSubmit={handleSignUp} className="flex flex-col gap-4">
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="firstname">First Name</Label>
          <Input
            type="text"
            id="firstname"
            placeholder="first name"
            className="focus-visible:border-2 focus-visible:border-green-400 focus-visible:ring-[0px] capitalize "
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="lastname">Last Name</Label>
          <Input
            type="text"
            id="lastname"
            placeholder="last name"
            className="focus-visible:border-2 focus-visible:border-green-400 focus-visible:ring-[0px] capitalize "
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            placeholder="Email"
            className="focus-visible:border-2 focus-visible:border-green-400 focus-visible:ring-[0px]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            placeholder="password"
            className="focus-visible:border-2 focus-visible:border-green-400 focus-visible:ring-[0px] capitalize "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Select value={role} onValueChange={(value) => setRole(value)}>
          <Label htmlFor="password">Role</Label>
          <SelectTrigger className="w-[180px] focus-visible:border-2 focus-visible:border-green-400 focus-visible:ring-[0px] capitalize ">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Roles</SelectLabel>
              <SelectItem value="apple">Admin</SelectItem>
              <SelectItem value="banana">Attendant</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {error && <p className="border border-red-300 p-3 w-fit">{error}</p>}
        {loading ? (
          <Button
            variant="secondary"
            disabled
            className="bg-green-200 py-7 mt-5 text-white font-bold text-xl"
          >
            <Loader2Icon className="animate-spin" />
          </Button>
        ) : (
          <Button
            variant="secondary"
            className="bg-green-500 py-7 mt-5 text-white font-bold text-xl hover:bg-green-400"
          >
            Create
          </Button>
        )}
      </form>
    </div>
  );
};

export default AddUser;
