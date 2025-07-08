/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { db } from "../../config/Firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

const Categories = () => {
  const [category, setCategory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const getcategory = async () => {
    setIsLoading(true);
    setCategory([]);

    try {
      const qOrdered = query(
        collection(db, "category"),
        orderBy("name", "asc")
      );
      const querySnapshot = await getDocs(qOrdered);

      const category = querySnapshot.docs.map((doc) => ({
        $id: doc.id,
        ...doc.data(),
      }));
      setCategory(category);
    } catch (error) {
      console.error("Failed to fetch category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getcategory();
  }, []);
  return (
    <div>
      <div className="flex justify-between items-center my-5">
        <h1 className="capitalize font-bold text-xl">Category</h1>
        <Button variant="outline" asChild>
          <Link to="/addcategory">Add Category</Link>
        </Button>
      </div>
      <div className="flex flex-wrap gap-4">
        {category.map((item) => (
          <div
            className=" cursor-pointer border p-2 rounded-lg flex flex-col items-center justify-center gap-2"
            key={item.id}
            onClick={() => navigate(`/category/${item?.name}`)}
          >
            <img
              src={item.imageUrl}
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

export default Categories;
