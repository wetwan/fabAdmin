
import { db } from "../../config/Firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import type { Food } from "./Foods";
import { ChevronLeft, Loader2Icon } from "lucide-react";

interface Category {
  $id: string;
  id: string;
  imageUrl: string;
  name: string;
}

const Category = () => {
  const { id } = useParams();

  const [food, setFood] = useState<Food[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  useEffect(() => {
    const getFood = async () => {
      setLoading(true);
      setFood([]);

      try {
        if (!id) {
          setLoading(false);
          return;
        }
        const q = query(collection(db, "food"), where("category", "==", id));
        const querySnapshot = await getDocs(q);

        // If you want to check for a single result
        if (querySnapshot.size === 1) {
          const doc = querySnapshot.docs[0];
          setFood([
            {
              id: doc.id,
              ...(doc.data() as Omit<Food, "id">),
            },
          ]);
        } else {
          const foods = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Food, "id">),
          }));
          setFood(foods);
        }
      } catch (error) {
        toast.error("Failed to fetch food:" + error);
      } finally {
        setLoading(false);
      }
    };
    getFood();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2Icon className="animate-spin text-2xl" />
      </div>
    );
  }

  return (
    <div>
      <div
        className="flex items-center py-4 cursor-pointer hover:text-red-500"
        onClick={() => window.history.back()}
      >
        <ChevronLeft className="" />
        <p className="">Back</p>
      </div>
      <div>
        <h1 className="capitalize font-bold text-xl">{id}</h1>
      </div>
      <div className="flex flex-wrap gap-4">
        {food.map((item, i) => (
          <div
            className=" cursor-pointer border p-2 rounded-lg flex flex-col items-center justify-center gap-2"
            key={i}
            onClick={() => navigate(`/food/${item?.id}`)}
          >
            <img
              src={item.image}
              height={100}
              width={100}
              className="w-[100px] h-[100px] object-cover rounded-[60px]"
            />
            <p className="capitalize font-bold"> {item?.name} </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
