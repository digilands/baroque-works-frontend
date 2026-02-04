const nigerianStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
  "Abuja"
];

const services = [
{
  name: 'House Section',
  sections: ['All', 'Bathroom', 'Kitchen', 'Roof', 'Floor', 'Door & Window', 'Interior Decoration'],
  image: 'https://images.unsplash.com/photo-1584622050111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
  category: 'housesection'
},
{
  name: 'Electrical Work',
  sections: ['All', 'Bathroom', 'Kitchen', 'Roof', 'Floor', 'Door & Window', 'Interior Decoration'],
  image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
  category: 'electrical-work'
},
{
  name: 'Carpentry',
  sections: ['All', 'Bathroom', 'Kitchen', 'Roof', 'Floor', 'Door & Window', 'Interior Decoration'],
  image: 'https://images.unsplash.com/photo-1622295023576-e413346831d9?auto=format&fit=crop&w=600&q=80',
  category: ''
},
{
  name: 'Plumbing',
  sections: ['All', 'Bathroom', 'Kitchen', 'Roof', 'Floor', 'Door & Window', 'Interior Decoration'],
  image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80',
  category: 'plumbing'
},
{
  name: 'General Maintenance',
  sections: ['All', 'Bathroom', 'Kitchen', 'Roof', 'Floor', 'Door & Window', 'Interior Decoration'],
  image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=600&q=80',
  category: 'general-maintenance'
},
{
  name: 'Painting',
  sections: ['All', 'Bathroom', 'Kitchen', 'Roof', 'Floor', 'Door & Window', 'Interior Decoration'],
  image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
  category: 'painting'
},
{
  name: 'Assembly',
  sections: ['All', 'Bathroom', 'Kitchen', 'Roof', 'Floor', 'Door & Window', 'Interior Decoration'],
  image: 'https://images.unsplash.com/photo-1503387837-b154b50e8b8a?auto=format&fit=crop&w=600&q=80',
  category: 'assembly'
},
{
  name: 'landscaping',
  sections: ['All', 'Bathroom', 'Kitchen', 'Roof', 'Floor', 'Door & Window', 'Interior Decoration'],
  image: 'https://images.unsplash.com/photo-1662058392176-2f5848c93542?auto=format&fit=crop&w=600&q=80',
  category: 'landscaping'
},
]

export const handymen = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80",
    category: "housesection",
    subcategory: "roof",
    title: "Professional Plumber for Home Repairs",
    rate: "₦5,000",
    rateType: "Hourly",
    profile: {
      profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      name: "Abdullahi Musa",
      availability: true,
      rating: 4.8,
      reviews: 50,
      aboutMe: "I'm Abdullahi, a reliable cleaner with 5+ years of experience in residential and office cleaning. I specialize in deep cleaning, post-renovation cleanup, and regular home maintenance. I take pride in leaving every space spotless, fresh, and organized so you can enjoy a healthier environment.",
      experience: "5 years Experience",
      previousWork: ["https://images.unsplash.com/photo-1584622050111-993a426fbf0a?auto=format&fit=crop&w=600&q=80", "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80", "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=600&q=80"],
      reviewsList: [
        {
          reviewerName: "Alex Thompson",
          reviewerPic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
          rating: 4.0,
          date: "2 days ago",
          comment: "Best cleaning service I've used. My office looks spotless and smells fresh. Highly recommend"
        }
      ],
      location: "123 Main Street, Wuse, Abuja"
    },
    offeredServices: [
        {
            name: "Roof fixing",
            image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80",
            rate: "₦15",
            rateType: "Hourly"
        },
        {
            name: "Kitchen Cleaning",
            image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
            rate: "₦30",
            rateType: "Fixed"
        }
    ]
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
    category: "housesection",
    subcategory: "kitchen",
    title: "Certified Electrician for Wiring & Fixes",
    rate: "₦7,000",
    rateType: "Fixed Rate",
    profile: {
      profilePic: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
      name: "Sani Ahmed",
      availability: false,
      rating: 4.5,
      reviews: 32,
      aboutMe: "Certified electrician with a passion for safety and efficiency.",
      experience: "7 years Experience",
      previousWork: ["https://images.unsplash.com/photo-1581092921461-eab62e97a7823?auto=format&fit=crop&w=600&q=80", "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=600&q=80"],
       reviewsList: [],
       location: "Gwarinpa, Abuja"
    },
     offeredServices: []
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1562184552-e0a539946671?auto=format&fit=crop&w=600&q=80",
    category: "housesection",
    subcategory: "door&window",
    title: "Interior & Exterior Painting Expert",
    rate: "₦10,000",
    rateType: "Per Room",
    profile: {
      profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      name: "Musa Idris",
      availability: true,
      rating: 4.7,
      reviews: 120,
      aboutMe: "Expert painter transforming spaces with color.",
      experience: "10 years Experience",
      previousWork: ["https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80"],
       reviewsList: [],
       location: "Maitama, Abuja"
    },
     offeredServices: []
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1584622050111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
    category: "housesection",
    subcategory: "bathroom",
    title: "Custom Furniture & Woodwork",
    rate: "₦12,000",
    rateType: "Per Job",
    profile: {
      profilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
      name: "Ibrahim Bello",
      availability: true,
      rating: 4.9,
      reviews: 15,
      aboutMe: "Crafting custom furniture pieces that last a lifetime.",
      experience: "3 years Experience",
      previousWork: [],
       reviewsList: [],
       location: "Asokoro, Abuja"
    },
     offeredServices: []
  },
];

export { nigerianStates, services };
