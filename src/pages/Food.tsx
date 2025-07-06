/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "../../config/Firebase";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import type { Food } from "./Foods";

const Food = () => {
  const { id } = useParams();

  const [Loading, setLoading] = useState(false);
  const [foodData, setFoodData] = useState<Food>();

  useEffect(() => {
    const getFoodData = async () => {
      if (!id) {
        toast.error("Error" + "No food item specified.");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const docRef = doc(db, "food", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const item: Food = {
            id: docSnap.id,
            name: data.name || "No name available",
            category: data.category || "No category available.",
            image: data.image || "No image available.",
            price: data.price || "No price available.",
            like: data.like || [],
            description: data.description || "No description available.",
            halal: data.halal || 'yes',
            ingredients: data.ingredients || "No ingredients available.",
            nutrient: data.nutrient || "No nutrient available.",
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

  return <div>Food {id}</div>;
};

export default Food;
