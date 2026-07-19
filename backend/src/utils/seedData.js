const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const Car = require("../models/Car");

const RAJKOT_DEALERSHIP = {
  name: "Apex Luxury Motors Flagship Showroom",
  address: "150 Feet Ring Road, Near Kalavad Road, Rajkot, Gujarat 360005, India",
  phone: "+91 (281) 555-APEX",
  lat: 22.3039,
  lng: 70.8022,
};

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
    ],
    description: "Naturally aspirated 4.0L flat-six producing 518 HP with active DRS wing aerodynamics and magnesium Weissach wheels.",
    specs: {
      engine: "4.0L Naturally Aspirated Boxer-6",
      horsepower: 518,
      acceleration: "3.0s 0-60mph",
      topSpeed: "184 mph",
      seating: 2,
      drivetrain: "RWD",
    },
    features: [
      "PDK 7-Speed Transmission",
      "Carbon Fiber Bucket Seats",
      "Weissach Package",
      "Front Axle Lift System",
    ],
    dealership: RAJKOT_DEALERSHIP,
    rating: 4.9,
    reviewsCount: 34,
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
    ],
    description: "An iconic high-performance executive sedan blending brutal V8 power with refined luxury and intelligent M xDrive technology.",
    specs: {
      engine: "4.4L Twin-Turbocharged V8",
      horsepower: 617,
      acceleration: "3.1s 0-60mph",
      topSpeed: "190 mph",
      seating: 5,
      drivetrain: "AWD",
    },
    features: [
      "M xDrive with 2WD Mode",
      "Bowers & Wilkins Surround Sound",
      "Merino Leather Interior",
    ],
    dealership: RAJKOT_DEALERSHIP,
    rating: 4.8,
    reviewsCount: 29,
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
    ],
    description: "Scintillating electric performance grand tourer with 800V fast charging architecture and iconic RS dynamic tuning.",
    specs: {
      engine: "Dual Electric Motors",
      horsepower: 637,
      acceleration: "3.1s 0-60mph",
      topSpeed: "155 mph",
      seating: 4,
      drivetrain: "AWD",
    },
    features: [
      "All-wheel Steering",
      "Bang & Olufsen 3D Sound",
      "Matrix LED Laser Headlights",
    ],
    dealership: RAJKOT_DEALERSHIP,
    rating: 4.9,
    reviewsCount: 19,
  },
  {
    make: "Mercedes-Benz",
    model: "AMG G 63",
    year: 2024,
    price: 183000,
    mileage: 2100,
    fuelType: "Petrol",
    transmission: "Automatic",
    color: "Obsidian Black",
    category: "SUV",
    quantity: 2,
    status: "Available",
    images: [
      "https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "The timeless icon of rugged luxury and raw power. Handmade AMG biturbo V8 paired with unmatched off-road capability.",
    specs: {
      engine: "4.0L Handcrafted AMG V8 Biturbo",
      horsepower: 577,
      acceleration: "4.5s 0-60mph",
      topSpeed: "149 mph",
      seating: 5,
      drivetrain: "AWD",
    },
    features: [
      "AMG Ride Control Suspension",
      "Burmester 3D Surround Sound",
      "Exclusive Nappa Leather",
    ],
    dealership: RAJKOT_DEALERSHIP,
    rating: 5.0,
    reviewsCount: 41,
  },
  {
    make: "Tata",
    model: "Harrier DARK Edition",
    year: 2024,
    price: 32000,
    mileage: 1500,
    fuelType: "Diesel",
    transmission: "Automatic",
    color: "Oberon Black",
    category: "SUV",
    quantity: 4,
    status: "Available",
    images: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Flagship Indian luxury SUV built on OMEGA ARC platform with Kryotec 2.0L Diesel engine and ADAS safety suite.",
    specs: {
      engine: "2.0L Kryotec Turbo Diesel",
      horsepower: 170,
      acceleration: "9.5s 0-60mph",
      topSpeed: "115 mph",
      seating: 5,
      drivetrain: "FWD",
    },
    features: [
      "Panoramic Sunroof",
      "JBL 10-Speaker Audio",
      "Level 2 ADAS",
      "360 3D HD Camera",
    ],
    dealership: RAJKOT_DEALERSHIP,
    rating: 4.7,
    reviewsCount: 22,
  },
  {
    make: "Mahindra",
    model: "XUV700 AX7 Luxury",
    year: 2024,
    price: 35000,
    mileage: 2300,
    fuelType: "Petrol",
    transmission: "Automatic",
    color: "Midnight Black",
    category: "SUV",
    quantity: 3,
    status: "Available",
    images: [
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Modern luxury SUV featuring mStallion Turbo Gasoline engine, dual HD superscreen displays, and AWD option.",
    specs: {
      engine: "2.0L mStallion Turbo Gasoline",
      horsepower: 200,
      acceleration: "8.8s 0-60mph",
      topSpeed: "124 mph",
      seating: 7,
      drivetrain: "AWD",
    },
    features: [
      "Sony 3D Immersive Audio",
      "Skyroof Panoramic Glass",
      "Ventilated Front Seats",
    ],
    dealership: RAJKOT_DEALERSHIP,
    rating: 4.8,
    reviewsCount: 38,
  },
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/car-dealership";
    console.log("🌱 Connecting to MongoDB for seeding...");
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });

    if (process.argv.includes("--force")) {
      await Car.deleteMany({});
      console.log("🧹 Cleared existing cars.");
    }

    const count = await Car.countDocuments();
    if (count === 0) {
      await Car.insertMany(initialCars);
      console.log(`✅ Successfully seeded ${initialCars.length} vehicles with Rajkot Dealership defaults!`);
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

module.exports = { seedDatabase, initialCars, RAJKOT_DEALERSHIP };
