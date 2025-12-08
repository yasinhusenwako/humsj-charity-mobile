import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import educationImage from "@/assets/education-hope.jpg";
import unityImage from "@/assets/unity-hands.jpg";
import successImage from "@/assets/success-student.jpg";
import heroImage from "@/assets/hero-students.jpg";
import communityPrayer from "@/assets/community-prayer.jpg";
import groupStudy from "@/assets/group-study.jpg";
import charityGiving from "@/assets/charity-giving.jpg";
import quranStudy from "@/assets/quran-study.jpg";

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  description: string;
  createdAt: any;
}

const Gallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const imagesSnapshot = await getDocs(collection(db, "gallery"));
      const imagesData = imagesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as GalleryImage[];

      // Sort by creation date (newest first)
      imagesData.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
        return dateB.getTime() - dateA.getTime();
      });

      // If no images from database, use fallback static images
      if (imagesData.length === 0) {
        const fallbackImages = [
          {
            id: "fallback-1",
            url: heroImage,
            title: "Islamic Education & Unity",
            description:
              "Muslim students studying together - combining Islamic knowledge with academic excellence at HUMSJ",
            createdAt: new Date(),
          },
          {
            id: "fallback-2",
            url: educationImage,
            title: "Seeking Knowledge",
            description:
              "Muslim students engaged in Islamic studies and Quranic learning - fulfilling the Islamic duty of seeking knowledge",
            createdAt: new Date(),
          },
          {
            id: "fallback-3",
            url: unityImage,
            title: "Islamic Brotherhood",
            description:
              "Muslim brothers and sisters united in faith - building strong bonds through Islamic principles of Takaful",
            createdAt: new Date(),
          },
          {
            id: "fallback-4",
            url: successImage,
            title: "Empowered Muslim Graduates",
            description:
              "Celebrating Muslim student success - empowering the Ummah through education and faith",
            createdAt: new Date(),
          },
          {
            id: "fallback-5",
            url: communityPrayer,
            title: "Community Prayer & Worship",
            description:
              "Muslim students gathering for congregational prayer - strengthening faith and unity through worship",
            createdAt: new Date(),
          },
          {
            id: "fallback-6",
            url: groupStudy,
            title: "Collaborative Learning",
            description:
              "Students working together on projects - fostering teamwork and academic excellence in the Muslim community",
            createdAt: new Date(),
          },
          {
            id: "fallback-7",
            url: charityGiving,
            title: "Charity & Giving Back",
            description:
              "HUMSJ members distributing aid and support - practicing Sadaqah and helping those in need",
            createdAt: new Date(),
          },
          {
            id: "fallback-8",
            url: quranStudy,
            title: "Quranic Studies",
            description:
              "Students deepening their understanding of the Quran - combining spiritual growth with academic pursuits",
            createdAt: new Date(),
          },
        ];
        setImages(fallbackImages);
      } else {
        setImages(imagesData);
      }
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      // On error, show fallback images
      const fallbackImages = [
        {
          id: "fallback-1",
          url: heroImage,
          title: "Islamic Education & Unity",
          description:
            "Muslim students studying together - combining Islamic knowledge with academic excellence at HUMSJ",
          createdAt: new Date(),
        },
        {
          id: "fallback-2",
          url: educationImage,
          title: "Seeking Knowledge",
          description:
            "Muslim students engaged in Islamic studies and Quranic learning - fulfilling the Islamic duty of seeking knowledge",
          createdAt: new Date(),
        },
        {
          id: "fallback-3",
          url: unityImage,
          title: "Islamic Brotherhood",
          description:
            "Muslim brothers and sisters united in faith - building strong bonds through Islamic principles of Takaful",
          createdAt: new Date(),
        },
        {
          id: "fallback-4",
          url: successImage,
          title: "Empowered Muslim Graduates",
          description:
            "Celebrating Muslim student success - empowering the Ummah through education and faith",
          createdAt: new Date(),
        },
        {
          id: "fallback-5",
          url: communityPrayer,
          title: "Community Prayer & Worship",
          description:
            "Muslim students gathering for congregational prayer - strengthening faith and unity through worship",
          createdAt: new Date(),
        },
        {
          id: "fallback-6",
          url: groupStudy,
          title: "Collaborative Learning",
          description:
            "Students working together on projects - fostering teamwork and academic excellence in the Muslim community",
          createdAt: new Date(),
        },
        {
          id: "fallback-7",
          url: charityGiving,
          title: "Charity & Giving Back",
          description:
            "HUMSJ members distributing aid and support - practicing Sadaqah and helping those in need",
          createdAt: new Date(),
        },
        {
          id: "fallback-8",
          url: quranStudy,
          title: "Quranic Studies",
          description:
            "Students deepening their understanding of the Quran - combining spiritual growth with academic pursuits",
          createdAt: new Date(),
        },
      ];
      setImages(fallbackImages);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl font-bold mb-6">Our Gallery</h1>
            <p className="text-xl opacity-90">
              Witness the impact of your donations through moments captured with
              our students and community members
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-muted-foreground">Loading gallery images...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {images.map((image) => (
                  <Card
                    key={image.id}
                    className="overflow-hidden shadow-medium hover:shadow-strong transition-all group cursor-pointer"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.title}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                        <div className="p-6 text-white">
                          <h3 className="font-bold text-lg mb-1">
                            {image.title}
                          </h3>
                          <p className="text-sm">{image.description}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {images.length === 0 && (
                <div className="text-center">
                  <Card className="max-w-2xl mx-auto bg-muted">
                    <div className="p-8">
                      <h3 className="text-2xl font-bold mb-4 text-primary">
                        No Images Yet
                      </h3>
                      <p className="text-muted-foreground">
                        Our gallery will be updated soon with new photos from
                        events, distributions, and success stories. Follow us on
                        social media to see the latest updates from our student
                        and community programs.
                      </p>
                    </div>
                  </Card>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Gallery;
