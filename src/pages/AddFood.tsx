/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { db } from "../../config/Firebase";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectGroup } from "@radix-ui/react-select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2Icon } from "lucide-react";

const AddFood = () => {
  const [category, setCategory] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [ingredients, setIngredients] = useState<string>("");
  const [Nutrient, setNutrient] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [categoryy, setCategoryy] = useState<string>("");
  const [halal, sethalal] = useState<string>("yes");

  const getFood = async () => {
    setCategory([]);

    try {
      const q = query(collection(db, "category"));
      const querySnapshot = await getDocs(q);

      const category = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // as Omit<Food, "id">
      setCategory(category);
    } catch (error) {
      toast.error("Failed to fetch category:" + error);
    }
  };

  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "martin");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dlu80k3sn/image/upload",
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      toast.error("Cloudinary upload failed");
      throw new Error("Image upload failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a banner image first.");
      return;
    }

    try {
      setUploading(true);
      const imageUrl = await uploadImageToCloudinary(file);

      await addDoc(collection(db, "food"), {
        name: name,
        image: imageUrl,
        ingredients: ingredients,
        description: description,
        halal: halal,
        nutrient: Nutrient,
        category: categoryy,
        price: price,
      });
      navigate("/food");
      toast.success("Food uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    getFood();
  }, []);

  return (
    <div className="md:w-3/4 mx-auto sm:shadow md:shadow-green-400 md:p-5 p-2 md:rounded-md mt-1">
      <h2 className="my-5 sm:ml-7 font-extrabold">Add food </h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 justify-center items-center"
      >
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="baner">Food Name</Label>
          <Input
            type="text"
            id="baner"
            placeholder="food name"
            className="focus-visible:border-2 focus-visible:border-green-400 focus-visible:ring-[0px] capitalize "
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="image">Food Image</Label>
          <Input
            type="file"
            id="image"
            required
            className="focus-visible:border-2 focus-visible:border-green-400 focus-visible:ring-[0px] capitalize "
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="ingredients">Food ingredients</Label>

          <Textarea
            id="ingredients"
            placeholder="Type food ingredients here."
            value={ingredients}
            required
            onChange={(e) => setIngredients(e.target.value)}
            className="focus-visible:border-2 focus-visible:border-green-400 focus-visible:ring-[0px] capitalize "
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="Nutrient">Food Nutrient </Label>
          <Textarea
            id="Nutrient"
            placeholder="Type food Nutrient here."
            value={Nutrient}
            required
            onChange={(e) => setNutrient(e.target.value)}
            className="focus-visible:border-2 focus-visible:border-green-400 focus-visible:ring-[0px] capitalize "
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="description">Food Description </Label>
          <Textarea
            id="description"
            placeholder="Type food Description here."
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
            className="focus-visible:border-2 focus-visible:border-green-400 focus-visible:ring-[0px] capitalize "
          />
        </div>
        <div className="sm:flex-row flex-col gap-y-4 items-center sm:justify-between">
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="category">Category</Label>
            <Select
              required
              value={categoryy}
              onValueChange={(value) => setCategoryy(value)}
            >
              <SelectTrigger className="w-[180px] focus-visible:border-2 focus-visible:border-green-400 focus-visible:ring-[0px] capitalize ">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Roles</SelectLabel>
                  {category.map((item) => (
                    <SelectItem key={item.id} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid w-full max-w-sm items-center gap-3 mt-4 sm:mt-0">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              required
              value={price}
              onChange={(value) => setPrice(value.target.value)}
              placeholder="Price"
              className="focus-visible:border-2 focus-visible:border-green-400 focus-visible:ring-[0px] capitalize "
            />
          </div>
        </div>

        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="category">Halal</Label>

          <RadioGroup
            defaultValue="Yes"
            className="flex items-center gap-5"
            onValueChange={(value) => sethalal(value)}
            required
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Yes" id="yes" />
              <Label htmlFor="yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="No" id="no" />
              <Label htmlFor="no">No</Label>
            </div>
          </RadioGroup>
        </div>
        {uploading ? (
          <Button
            variant="secondary"
            disabled={uploading}
            className="bg-green-200 py-7 mt-5 text-white font-bold text-xl"
          >
            <Loader2Icon className="animate-spin" /> uploading
          </Button>
        ) : (
          <Button
            variant="secondary"
            className="bg-green-500 py-7 mt-5 text-white font-bold text-xl hover:bg-green-400"
          >
            Create Food
          </Button>
        )}
      </form>
    </div>
  );
};

export default AddFood;
