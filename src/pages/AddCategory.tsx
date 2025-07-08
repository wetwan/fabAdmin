
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { db } from "../../config/Firebase";
import { addDoc, collection } from "firebase/firestore";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);

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
      toast.error("Cloudinary upload failed" + error);
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

      await addDoc(collection(db, "category"), {
        name: name,
        imageUrl: imageUrl,
        id: Math.floor(Math.random() * 2000)
      });
      navigate("/category");
      toast.success("Category uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="sm:w-3/4 mx-auto sm:shadow shadow-green-400 p-5 sm:rounded-md mt-1">
      <h2 className="my-5 sm:ml-7 font-extrabold">Add category </h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 justify-center items-center"
      >
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="baner">Category Name</Label>
          <Input
            type="text"
            id="baner"
            placeholder="category name"
            className="focus-visible:border-2 focus-visible:border-green-400 focus-visible:ring-[0px] capitalize "
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="image">Category Image</Label>
          <Input
            type="file"
            id="image"
            required
            className="focus-visible:border-2 focus-visible:border-green-400 focus-visible:ring-[0px] capitalize "
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
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
            Create Category
          </Button>
        )}
      </form>
    </div>
  );
};

export default AddCategory;
