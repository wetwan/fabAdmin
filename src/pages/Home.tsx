import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { images } from "../assets";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/clerk-react";

const Home = () => {
  const navigate = useNavigate();
  
  const { signOut } = useClerk();
  return (
    <div className="min-h-screen p-2 lg:w-5/6 mx-auto">
      <div className="w-full flex justify-between items-center mb-5">
        <div onClick={() => navigate("/food")}>
          <img src={images.Logo} height={60} width={60} />
        </div>
        <div className="flex items-center gap-1">
          <img
            src={images.User}
            height={40}
            width={40}
            onClick={() => navigate("/profile")}
          />
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <img src={images.Down} height={20} width={20} />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profie</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      // Add your sign-out logic here, e.g., Clerk's signOut()
                      signOut();
                    }}
                  >
                    Log out
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        </div>
      </div>
      <div className="flex items-start h-full gap-5">
        <div className=" w-[20%] rounded-lg inline-block py-10">
          <ul className="p-2 flex flex-col gap-5">
            <NavLink
              to={"/food"}
              className={({ isActive }) =>
                ` cursor-pointer border flex py-2 rounded-lg items-center justify-start max-md:justify-center md:px-5  gap-4 capitalize font-bold transition-colors ease-in duration-300 ${
                  isActive
                    ? "text-green-400  "
                    : " text-blue-500 border-blue-500"
                }`
              }
            >
              {/* <BsPenFill className="p-1 w-8 h-8" /> */}
              <span className="max-md:hidden">foods</span>
            </NavLink>
            <NavLink
              to={"/category"}
              className={({ isActive }) =>
                ` cursor-pointer border flex py-2 rounded-lg items-center justify-start max-md:justify-center md:px-5  gap-4 capitalize font-bold transition-colors ease-in duration-300 ${
                  isActive
                    ? "text-green-400  "
                    : " text-blue-500 border-blue-500"
                }`
              }
            >
              {/* <BsPenFill className="p-1 w-8 h-8" /> */}
              <span className="max-md:hidden">categories</span>
            </NavLink>
            <NavLink
              to={"/pending"}
              className={({ isActive }) =>
                ` cursor-pointer border flex py-2 rounded-lg items-center justify-start max-md:justify-center md:px-5  gap-4 capitalize font-bold transition-colors ease-in duration-300 ${
                  isActive
                    ? "text-green-400  "
                    : " text-blue-500 border-blue-500"
                }`
              }
            >
              {/* <BsPenFill className="p-1 w-8 h-8" /> */}
              <span className="max-md:hidden">pending</span>
            </NavLink>
            <NavLink
              to={"/complete"}
              className={({ isActive }) =>
                ` cursor-pointer border flex py-2 rounded-lg items-center justify-start max-md:justify-center md:px-5  gap-4 capitalize font-bold transition-colors ease-in duration-300 ${
                  isActive
                    ? "text-green-400  "
                    : " text-blue-500 border-blue-500"
                }`
              }
            >
              {/* <BsPenFill className="p-1 w-8 h-8" /> */}
              <span className="max-md:hidden">completed</span>
            </NavLink>
            <NavLink
              to={"/banner"}
              className={({ isActive }) =>
                ` cursor-pointer border flex py-2 rounded-lg items-center justify-start max-md:justify-center md:px-5  gap-4 capitalize font-bold transition-colors ease-in duration-300 ${
                  isActive
                    ? "text-green-400  "
                    : " text-blue-500 border-blue-500"
                }`
              }
            >
              {/* <BsPenFill className="p-1 w-8 h-8" /> */}
              <span className="max-md:hidden">banner</span>
            </NavLink>
            <NavLink
              to={"/adduser"}
              className={({ isActive }) =>
                ` cursor-pointer border flex py-2 rounded-lg items-center justify-start max-md:justify-center md:px-5  gap-4 capitalize font-bold transition-colors ease-in duration-300 ${
                  isActive
                    ? "text-green-400  "
                    : " text-blue-500 border-blue-500"
                }`
              }
            >
              {/* <BsPenFill className="p-1 w-8 h-8" /> */}
              <span className="max-md:hidden">add user</span>
            </NavLink>
          </ul>
        </div>
        <div className="w-[80%] mb-24 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Home;
