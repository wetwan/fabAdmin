/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../config/Firebase";
import { useNavigate } from "react-router";

const Addbanner = () => {
  const [banner, setBanner] = useState<File | null>(null);
  const [name, setName] = useState<string>("");
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

    if (!banner) {
      toast.error("Please select a banner image first.");
      return;
    }

    try {
      setUploading(true);
      const imageUrl = await uploadImageToCloudinary(banner);

      await addDoc(collection(db, "slider"), {
        name: name,
        imageUrl: imageUrl,
      });
      navigate("/banner");
      toast.success("Banner uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-3/4 mx-auto shadow shadow-green-400 p-5 rounded-md mt-10">
      <h2 className="my-5 ml-7 font-extrabold">Add banner </h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 justify-center items-center"
      >
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="baner">Banner Name</Label>
          <Input
            type="text"
            id="baner"
            placeholder="banner name"
            className="focus-visible:border-2 focus-visible:border-green-400 focus-visible:ring-[0px] capitalize "
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="firstname">Banner</Label>
          <Input
            type="file"
            className="focus-visible:border-2 focus-visible:border-green-400 focus-visible:ring-[0px] capitalize "
            onChange={(e) => setBanner(e.target.files?.[0] || null)}
          />
        </div>

        <Button disabled={uploading}> submit</Button>
      </form>
    </div>
  );
};

export default Addbanner;
