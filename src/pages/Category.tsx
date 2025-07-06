/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "../../config/Firebase";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";

interface Category {
  $id: string;
  id: string;
  imageUrl: string;
  name: string;
}

const Category = () => {
  const { id } = useParams();

  const [Loading, setLoading] = useState(false);
  const [foodData, setFoodData] = useState<Category>();

  useEffect(() => {
    const getFoodData = async () => {
      if (!id) {
        toast.error("Error" + "No caterogy item specified.");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const docRef = doc(db, "category", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const item: Category = {
            $id: docSnap.id,
            id: data.id,
            imageUrl: data.imageUrl,
            name: data.name,
          };
          setFoodData(item);
          console.log(item);
        } else {
          toast.error("Error" + "Food item not found.");
        }
      } catch (error) {
        console.error("Error fetching food data:", error);
        toast.error("Error" + "Could not fetch food details.");
      } finally {
        setLoading(false);
      }
    };

    getFoodData();
  }, [id]);

  return <div>Category{foodData?.name}</div>;
};

export default Category;
