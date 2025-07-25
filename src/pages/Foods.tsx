
import { Button } from "@/components/ui/button";
import { db } from "../../config/Firebase";
import { collection, getDocs, query } from "firebase/firestore";
import  { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Heart, Loader2Icon } from "lucide-react";

export interface Food {
  like: [];
  price: number;
  id: string;
  name: string;
  image: string;
  description: string;
  halal: string;
  category: string;
  ingredients: string;
  nutrient: string;
  reviews: [
    {
      message: string;
      userName: string;
      userImage: string;
      time: string;
    }
  ];
}

const Foods = () => {
  const navigate = useNavigate();
  const [food, setFood] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const getFood = async () => {
    setIsLoading(true);
    setFood([]);

    try {
      const q = query(collection(db, "food"));
      const querySnapshot = await getDocs(q);

      const foods = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Food, "id">),
      }));

      setFood(foods);
    } catch (error) {
      console.error("Failed to fetch food:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getFood();
  }, []);

    if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2Icon className="animate-spin text-2xl" />
      </div>
    );
  }


  return (
    <div className="text-black">
      <div className="flex justify-between items-center my-5">
        <h1 className="capitalize font-bold text-xl">foods</h1>
        <Button variant="outline" asChild>
          <Link to="/addfood">Add Food</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {food.map((food) => (
          <div
            key={food.id}
            className="border border-red-500 rounded-md p-3 flex flex-col"
            onClick={() => navigate(`/food/${food.id}`)}
          >
            <img
              src={food.image}
              alt={food.name}
              className="h-[150px] object-cover rounded-md"
            />
            <div className="flex p-2 items-center justify-between gap-5 mt-2">
              <p className=" text-center font-semibold capitalize">
                {food.name}
              </p>
              {food.like?.length > 0 && (
                <div className="flex items-center  justify-between gap-5">
                  <Heart className="text-red-500" /> {food.like?.length}
                </div>
              )}
            </div>
            <div className="flex p-2 items-center justify-between gap-5 mt-2">
              <p className=" text-center font-semibold capitalize">
                {food.price}
              </p>

              <p className="border border-green-300 px-1.5 capitalize rounded">
                {food.category}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Foods;
