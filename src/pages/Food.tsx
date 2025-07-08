/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "../../config/Firebase";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import type { Food } from "./Foods";
import { ChevronLeft, Heart, Soup } from "lucide-react";
import { images } from "@/assets";
import { TbCurrencyNaira } from "react-icons/tb";

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
            halal: data.halal || "yes",
            ingredients: data.ingredients || "No ingredients available.",
            nutrient: data.nutrient || "No nutrient available.",
            reviews: data.reviews || [],
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
        <h1 className="capitalize font-bold text-xl">{foodData?.name}</h1>
      </div>
      <div className="w-full mt-3">
        <img
          src={foodData?.image}
          width={1000}
          height={1000}
          className="w-full h-[400px] z-20  rounded-b-[100px] object-cover object-center"
        />
      </div>
      <div className="bg-green-500  -mt-32 pt-32 px-5 pb-3">
        <div className="flex items-center justify-between py-4">
          <h3 className="text-2xl text-white font-bold capitalize">
            {foodData?.name}
          </h3>
          <div className="flex items-center gap-2 px-4 py-2 rounded-3xl text-red-600 capitalize bg-red-200">
            <Soup className="text-red-600" />
            <p className="">{foodData?.category}</p>
          </div>
        </div>
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-3xl text-red-600 capitalize bg-red-200">
            <Heart className="text-red-600" />
            <p className="">{foodData?.like.length}</p>
          </div>
        </div>
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center  px-4 py-2 rounded-3xl text-red-600 capitalize bg-red-200">
            <TbCurrencyNaira />
            <p className="">{foodData?.price}</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-3xl text-red-600 capitalize bg-red-200">
            <img
              src={images.Halal}
              alt="halal"
              className="w-6 h-6 object-cover object-center"
            />
            <p className="">{foodData?.halal}</p>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="text-white">Description</h4>
          <p className="border border-red-500 p-2 rounded-md mt-2">
            {foodData?.description}
          </p>
        </div>
        <div className="mt-4">
          <h4 className="text-white">Ingredients</h4>
          <p className="border border-red-500 p-2 rounded-md mt-2">
            {foodData?.ingredients}
          </p>
        </div>
        <div className="mt-4">
          <h4 className="text-white">Nutrient</h4>
          <p className="border border-red-500 p-2 rounded-md mt-2">
            {foodData?.nutrient}
          </p>
        </div>
        <div className="mt-5 text-white">
          <h4 className=""> Review</h4>

          <div className="">
            {(foodData?.reviews?.length ?? 0) > 0 ? (
              (foodData?.reviews ?? []).map((review, index) => (
                <div
                  key={index}
                  className="border border-red-500 p-2 rounded-md mt-2"
                >
                  <div className="flex items-center gap-3 mb-2 capitalize">
                    <img
                      src={review.userImage}
                      alt=""
                      className="rounded-md"
                      width={50}
                      height={50}
                    />
                    <div className="">
                      <p className="font-bold">{review?.userName}</p>
                      <p className="text-sm text-gray-300">
                        {new Date(review?.time).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <p className="border p-2 rounded-2xl border-red-400">
                    {review?.message}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-red-200">No reviews yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Food;
