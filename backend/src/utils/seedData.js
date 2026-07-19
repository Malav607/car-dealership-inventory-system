const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const Car = require("../models/Car");
const User = require("../models/User");

const initialCars = [
  {
    make: "Porsche",
    model: "911 GT3 RS",
    year: 2024,
    price: 241300,
    mileage: 450,
    fuelType: "Petrol",
    transmission: "Automatic",
    color: "Python Green",
    category: "Coupe",
    quantity: 2,
    status: "Available",
    images: [
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1611244419377-b0a760c19719?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "The peak of naturally aspirated performance. Motorsport aerodynamics, active rear-wing DRS, and ultra-lightweight magnesium construction.",
    specs: {
      engine: "4.0L Naturally Aspirated Boxer-6",
      horsepower: 518,
      acceleration: "3.0s 0-60mph",
      topSpeed: "184 mph",
      seating: 2,
      drivetrain: "RWD"
    },
    features: [
      "PDK 7-Speed Transmission",
      "Carbon Fiber Bucket Seats",
      "Weissach Package",
      "Front Axle Lift System",
      "Carbon Ceramic Brakes (PCCB)"
    ],
    dealership: {
      name: "Apex Beverly Hills Luxury",
      address: "9500 Wilshire Blvd, Beverly Hills, CA 90212",
      phone: "+1 (310) 555-9110",
      lat: 34.0671,
      lng: -118.4005
    },
    rating: 4.9,
    reviewsCount: 34
  },
  {
    make: "Tesla",
    model: "Model S Plaid",
    year: 2024,
    price: 89990,
    mileage: 1200,
    fuelType: "Electric",
    transmission: "Automatic",
    color: "Solid Black",
    category: "Sedan",
    quantity: 4,
    status: "Available",
    images: [
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Tri-motor all-wheel drive platform with torque vectoring and over 1,000 horsepower for unprecedented acceleration.",
    specs: {
      engine: "Tri-Motor Electric Architecture",
      horsepower: 1020,
      acceleration: "1.99s 0-60mph",
      topSpeed: "200 mph",
      seating: 5,
      drivetrain: "AWD"
    },
    features: [
      "Full Self-Driving Capability",
      "Yoke Steering Wheel",
      "22-Speaker Premium Audio",
      "Gaming Computer Console",
      "Adaptive Air Suspension"
    ],
    dealership: {
      name: "Apex Silicon Valley Experience Center",
      address: "3000 El Camino Real, Palo Alto, CA 94306",
      phone: "+1 (650) 555-8375",
      lat: 37.4241,
      lng: -122.1430
    },
    rating: 4.7,
    reviewsCount: 52
  },
  {
    make: "BMW",
    model: "M5 Competition",
    year: 2023,
    price: 110900,
    mileage: 5400,
    fuelType: "Petrol",
    transmission: "Automatic",
    color: "Marina Bay Blue",
    category: "Sedan",
    quantity: 3,
    status: "Available",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "An iconic high-performance executive sedan blending brutal V8 power with refined luxury and intelligent M xDrive technology.",
    specs: {
      engine: "4.4L Twin-Turbocharged V8",
      horsepower: 617,
      acceleration: "3.1s 0-60mph",
      topSpeed: "190 mph",
      seating: 5,
      drivetrain: "AWD"
    },
    features: [
      "M xDrive with 2WD Mode",
      "Bowerman & Wilkins Surround Sound",
      "Merino Leather Interior",
      "Carbon Fiber Roof",
      "Executive Package"
    ],
    dealership: {
      name: "Apex Downtown Motors",
      address: "1200 S Figueroa St, Los Angeles, CA 90015",
      phone: "+1 (213) 555-4650",
      lat: 34.0430,
      lng: -118.2673
    },
    rating: 4.8,
    reviewsCount: 29
  },
  {
    make: "Audi",
    model: "RS e-tron GT",
    year: 2024,
    price: 147100,
    mileage: 800,
    fuelType: "Electric",
    transmission: "Automatic",
    color: "Daytona Gray",
    category: "Sedan",
    quantity: 2,
    status: "Available",
    images: [
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Scintillating electric performance grand tourer with 800V fast charging architecture and iconic RS dynamic tuning.",
    specs: {
      engine: "Dual Permanent Magnet Electric Motors",
      horsepower: 637,
      acceleration: "3.1s 0-60mph",
      topSpeed: "155 mph",
      seating: 4,
      drivetrain: "AWD"
    },
    features: [
      "All-wheel Steering",
      "Bang & Olufsen 3D Sound",
      "Matrix-design LED Headlights with Laser Light",
      "Carbon Fiber Roof Panel",
      "Adaptive Air Suspension"
    ],
    dealership: {
      name: "Apex Newport Beach Motors",
      address: "1000 Coast Hwy, Newport Beach, CA 92660",
      phone: "+1 (949) 555-7740",
      lat: 33.6189,
      lng: -117.9298
    },
    rating: 4.9,
    reviewsCount: 19
  },
  {
    make: "Mercedes-Benz",
    model: "AMG G 63",
    year: 2024,
    price: 183000,
    mileage: 2100,
    fuelType: "Petrol",
    transmission: "Automatic",
    color: "G Manufaktur Obsidian Black",
    category: "SUV",
    quantity: 1,
    status: "Available",
    images: [
      "https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "The timeless icon of rugged luxury and raw power. Handmade AMG biturbo V8 paired with unmatched off-road capability.",
    specs: {
      engine: "4.0L Handcrafted AMG V8 Biturbo",
      horsepower: 577,
      acceleration: "4.5s 0-60mph",
      topSpeed: "149 mph",
      seating: 5,
      drivetrain: "AWD"
    },
    features: [
      "AMG Ride Control Suspension",
      "Burmester Surround Sound",
      "Exclusive Nappa Leather",
      "Triple Lock Differential",
      "Night Package Magno"
    ],
    dealership: {
      name: "Apex Beverly Hills Luxury",
      address: "9500 Wilshire Blvd, Beverly Hills, CA 90212",
      phone: "+1 (310) 555-9110",
      lat: 34.0671,
      lng: -118.4005
    },
    rating: 5.0,
    reviewsCount: 41
  },
  {
    make: "Range Rover",
    model: "SV Autobiography",
    year: 2024,
    price: 209000,
    mileage: 1500,
    fuelType: "Hybrid",
    transmission: "Automatic",
    color: "Charente Grey",
    category: "SUV",
    quantity: 2,
    status: "Available",
    images: [
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Peerless luxury SUV flagship featuring executive rear seating with massagers, ceramic controls, and whisper-quiet cabin acoustics.",
    specs: {
      engine: "4.4L Twin-Turbocharged V8 PHEV",
      horsepower: 523,
      acceleration: "4.4s 0-60mph",
      topSpeed: "162 mph",
      seating: 4,
      drivetrain: "AWD"
    },
    features: [
      "Executive Class Comfort Rear Seats",
      "Meridian Signature Sound System",
      "Digital LED Headlights with Image Projection",
      "Active Noise Cancellation",
      "Refrigerated Rear Compartment"
    ],
    dealership: {
      name: "Apex Newport Beach Motors",
      address: "1000 Coast Hwy, Newport Beach, CA 92660",
      phone: "+1 (949) 555-7740",
      lat: 33.6189,
      lng: -117.9298
    },
    rating: 4.9,
    reviewsCount: 22
  }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/car-dealership";
    console.log("🌱 Connecting to MongoDB for seeding...");
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });

    const count = await Car.countDocuments();
    if (count === 0 || process.argv.includes("--force")) {
      if (process.argv.includes("--force")) {
        await Car.deleteMany({});
        console.log("🧹 Cleared existing cars.");
      }
      await Car.insertMany(initialCars);
      console.log(`✅ Successfully seeded ${initialCars.length} luxury vehicles!`);
    } else {
      console.log(`ℹ️ Database already has ${count} vehicles. Use --force to re-seed.`);
    }
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, initialCars };
