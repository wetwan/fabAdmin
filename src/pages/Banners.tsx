/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import { db } from "../../config/Firebase";
import { collection, deleteDoc, doc, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArchiveX,  } from "lucide-react";
import { toast } from "react-toastify";

interface banner {
  id: string;
  imageUrl: string;
  name: string;
}

const Banners = () => {
  const [slider, setSlider] = useState<banner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const getSlider = async () => {
    setIsLoading(true);
    setSlider([]);
    const q = query(collection(db, "slider"));
    const quarySnapshot = await getDocs(q);
    const banners: banner[] = quarySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<banner, "id">),
    }));

    setSlider(banners);
    setIsLoading(false);
  };

  const Delete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this banner?"
    );
    if (!confirmed) return;

    try {
      const productDoc = doc(db, "slider", id);
      await deleteDoc(productDoc);
      toast.success("Banner deleted successfully");
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error("Failed to delete banner");
    }
  };
  useEffect(() => {
    getSlider();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center my-5">
        <h1 className="capitalize font-bold text-xl">banners</h1>
        <Button variant="outline" asChild>
          <Link to="/addbanner">Add Banner</Link>
        </Button>
      </div>
      <div className="flex items-center gap-2 ">
        {slider.map((item) => (
          <div
            key={item.id}
            className="w-[200px] h-[200px] rounded-2xl relative overflow-hidden"
          >
            <img
              src={item.imageUrl}
              width={100}
              height={100}
              className="w-full h-full overflow-hidden object-center"
            />
            <Button
              variant="secondary"
              size="icon"
              className="size-8 absolute bottom-2 right-2 bg-red-600"
              onClick={() => Delete(item.id)}
            >
              <ArchiveX className="text-white" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Banners;
