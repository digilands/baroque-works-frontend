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
  image: '/house-section.jpg',
  category: 'housesection'
},
{
  name: 'Electrical Work',
  sections: ['All', 'Bathroom', 'Kitchen', 'Roof', 'Floor', 'Door & Window', 'Interior Decoration'],
  image: '/electrical-work.jpg',
  category: 'electrical-work'
},
{
  name: 'Carpentry',
  sections: ['All', 'Bathroom', 'Kitchen', 'Roof', 'Floor', 'Door & Window', 'Interior Decoration'],
  image: '/carpentry.jpg',
  category: ''
},
{
  name: 'Plumbing',
  sections: ['All', 'Bathroom', 'Kitchen', 'Roof', 'Floor', 'Door & Window', 'Interior Decoration'],
  image: '/plumbing.jpg',
  category: 'plumbing'
},
{
  name: 'General Maintenance',
  sections: ['All', 'Bathroom', 'Kitchen', 'Roof', 'Floor', 'Door & Window', 'Interior Decoration'],
  image: '/general-maintenance.jpg',
  category: 'general-maintenance'
},
{
  name: 'Painting',
  sections: ['All', 'Bathroom', 'Kitchen', 'Roof', 'Floor', 'Door & Window', 'Interior Decoration'],
  image: '/painting.jpg',
  category: 'painting'
},
{
  name: 'Assembly',
  sections: ['All', 'Bathroom', 'Kitchen', 'Roof', 'Floor', 'Door & Window', 'Interior Decoration'],
  image: '/assembly.jpg',
  category: 'assembly'
},
{
  name: 'landscaping',
  sections: ['All', 'Bathroom', 'Kitchen', 'Roof', 'Floor', 'Door & Window', 'Interior Decoration'],
  image: '/landscaping.jpg',
  category: 'landscaping'
},
]

export const handymen = [
  {
    id: 1,
    image: "/roof-fixing.jpg",
    category: "housesection",
    subcategory: "roof",
    title: "Professional Plumber for Home Repairs",
    rate: "₦5,000",
    rateType: "Hourly",
    profile: {
      profilePic: "/profile.png",
      name: "Abdullahi Musa",
      availability: true,
      rating: 4.8,
      reviews: 50,
      aboutMe: "I'm Abdullahi, a reliable cleaner with 5+ years of experience in residential and office cleaning. I specialize in deep cleaning, post-renovation cleanup, and regular home maintenance. I take pride in leaving every space spotless, fresh, and organized so you can enjoy a healthier environment.",
      experience: "5 years Experience",
      previousWork: ["/prev1.jpg", "/prev2.jpg", "/prev3.jpg"],
      reviewsList: [
        {
          reviewerName: "Alex Thompson",
          reviewerPic: "/reviewer.jpg",
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
            image: "/roof-fixing.jpg",
            rate: "₦15",
            rateType: "Hourly"
        },
        {
            name: "Kitchen Cleaning",
            image: "/kitchen-cleaning.jpg",
            rate: "₦30",
            rateType: "Fixed"
        }
    ]
  },
  {
    id: 2,
    image: "/kitchen-cleaning.jpg",
    category: "housesection",
    subcategory: "kitchen",
    title: "Certified Electrician for Wiring & Fixes",
    rate: "₦7,000",
    rateType: "Fixed Rate",
    profile: {
      profilePic: "/profile.png",
      name: "Sani Ahmed",
      availability: false,
      rating: 4.5,
      reviews: 32,
      aboutMe: "Certified electrician with a passion for safety and efficiency.",
      experience: "7 years Experience",
      previousWork: ["/prev1.jpg", "/prev2.jpg"],
       reviewsList: [],
       location: "Gwarinpa, Abuja"
    },
     offeredServices: []
  },
  {
    id: 3,
    image: "/doorandwindow.jpg",
    category: "housesection",
    subcategory: "door&window",
    title: "Interior & Exterior Painting Expert",
    rate: "₦10,000",
    rateType: "Per Room",
    profile: {
      profilePic: "/profile.png",
      name: "Musa Idris",
      availability: true,
      rating: 4.7,
      reviews: 120,
      aboutMe: "Expert painter transforming spaces with color.",
      experience: "10 years Experience",
      previousWork: ["/prev1.jpg"],
       reviewsList: [],
       location: "Maitama, Abuja"
    },
     offeredServices: []
  },
  {
    id: 4,
    image: "/bathroom-cleaning.jpg",
    category: "housesection",
    subcategory: "bathroom",
    title: "Custom Furniture & Woodwork",
    rate: "₦12,000",
    rateType: "Per Job",
     profile: {
      profilePic: "/profile.png",
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
