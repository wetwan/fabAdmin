/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "../../config/Firebase";
import { collection, getDocs, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const Categories = () => {
  const [category, setCategory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const getFood = async () => {
    setIsLoading(true);
    setCategory([]);

    try {
      const q = query(collection(db, "category"));
      const querySnapshot = await getDocs(q);

      const category = querySnapshot.docs.map((doc) => ({
        $id: doc.id,
        ...doc.data(),
      }));
      console.log(category);
      setCategory(category);
    } catch (error) {
      console.error("Failed to fetch category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getFood();
  }, []);
  return (
    <div>
       {category.map((item) => (
        <div
          className=""
          key={item.id}
          onClick={() => navigate(`/category/${item?.$id}`)}
        >
          {item?.name}
        </div>
      ))} 
    </div>
  );
};

export default Categories;
