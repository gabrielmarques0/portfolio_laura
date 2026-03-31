export type Photo = {
  id: string;
  src: string;
  alt: string;
  category: "landscape" | "portrait" | "urban" | "nature";
  width: number;
  height: number;
  title: string;
};

export const photos: Photo[] = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80",
    alt: "Golden hour landscape",
    category: "landscape",
    width: 1200,
    height: 800,
    title: "Golden Hour",
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80",
    alt: "Woman portrait in natural light",
    category: "portrait",
    width: 800,
    height: 1200,
    title: "Natural Light",
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80",
    alt: "City skyline at dusk",
    category: "urban",
    width: 1200,
    height: 800,
    title: "Urban Dusk",
  },
  {
    id: "4",
    src: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80",
    alt: "Forest path in morning mist",
    category: "nature",
    width: 1200,
    height: 800,
    title: "Morning Mist",
  },
  {
    id: "5",
    src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80",
    alt: "Portrait of a man",
    category: "portrait",
    width: 800,
    height: 1000,
    title: "Still",
  },
  {
    id: "6",
    src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80",
    alt: "Mountain peaks at night",
    category: "landscape",
    width: 1200,
    height: 800,
    title: "Starlit Peaks",
  },
  {
    id: "7",
    src: "https://images.unsplash.com/photo-1514565131-fce0801e6785?w=1200&q=80",
    alt: "Rainy street at night",
    category: "urban",
    width: 1200,
    height: 800,
    title: "After Rain",
  },
  {
    id: "8",
    src: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&q=80",
    alt: "Wild horses in a field",
    category: "nature",
    width: 1200,
    height: 800,
    title: "Wild",
  },
  {
    id: "9",
    src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80",
    alt: "Fashion portrait",
    category: "portrait",
    width: 800,
    height: 1100,
    title: "Elegance",
  },
  {
    id: "10",
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80",
    alt: "Lake at sunrise",
    category: "landscape",
    width: 1200,
    height: 800,
    title: "Stillwater",
  },
  {
    id: "11",
    src: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80",
    alt: "City alley with light",
    category: "urban",
    width: 800,
    height: 1200,
    title: "The Alley",
  },
  {
    id: "12",
    src: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1200&q=80",
    alt: "Autumn forest",
    category: "nature",
    width: 1200,
    height: 800,
    title: "Autumn",
  },
];

export const heroPhoto = {
  src: "https://cdn.myportfolio.com/7dcd7f2f-852c-4b0b-b759-617796e1ba9f/4ddf3a08-5dde-4a0f-9854-0b066f6fd16b_rw_3840.jpg?h=7a273b04a037dbc868d6b93538c4f6c6",
  alt: "Laura Peixoto photography",
};
