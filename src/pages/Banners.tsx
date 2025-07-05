/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "../../config/Firebase";
import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";

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

  console.log(slider);
  useEffect(() => {
    getSlider();
  }, []);

  return (
    <div className="flex ">
      {slider.map((item) => (
        <div key={item.id}>
          <img src={item.imageUrl} width={100} height={100} />
        </div>
      ))}
    </div>
  );
};

export default Banners;
