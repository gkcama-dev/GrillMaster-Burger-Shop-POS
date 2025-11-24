// Initial default data for GrillMaster POS (products, customers)
// Loads ONLY if localStorage is empty.

const seedProducts = [
    {
        id: generateId(),
        name: "Double Beef Smash Burger",
        price: 1200,
        category: "burgers",
        image: "./assets/burgers/DoubleBeefSmashBurger.jpg"
    },
    {
        id: generateId(),
        name: "BBQ Bacon Cheese Burger",
        price: 1350,
        category: "burgers",
        image: "./assets/burgers/BBQBaconCheeseBurger.jpg"
    },
    {
        id: generateId(),
        name: "Spicy Chicken Burger Large",
        price: 900,
        category: "burgers",
        image: "./assets/burgers/SpicyChickenBurger.jpg"
    },
    {
        id: generateId(),
        name: "Veggie Delight Burger Large",
        price: 750,
        category: "burgers",
        image: "./assets/burgers/VeggieDelightBurger.jpg"
    },
    {
        id: generateId(),
        name: "Crispy Fish Burger Large Meal",
        price: 950,
        category: "burgers",
        image: "./assets/burgers/CrispyFishBurger.jpg"
    },
    {
        id: generateId(),
        name: "Mushroom Melt Burger Large",
        price: 1100,
        category: "burgers",
        image: "./assets/burgers/MushroomMeltBurger.jpg"
    },
    {
        id: generateId(),
        name: "Grilled Chicken Burger Large",
        price: 980,
        category: "burgers",
        image: "./assets/burgers/GrilledChickenBurger.jpg"
    },
    {
        id: generateId(),
        name: "Triple Patty Monster Burger",
        price: 1600,
        category: "burgers",
        image: "./assets/burgers/TriplePattyMonsterBurger.jpg"
    },
    {
        id: generateId(),
        name: "Medium Chicken Nuggets (6 pcs)",
        price: 550,
        category: "sides",
        image: "./assets/sides/ChickenNuggets.jpg"
    },
    {
        id: generateId(),
        name: "Chicken Nuggets (12 pcs)",
        price: 950,
        category: "sides",
        image: "./assets/sides/ChickenNuggets12.jpg"
    },
    {
        id: generateId(),
        name: "Medium Onion Rings (6 pcs)",
        price: 500,
        category: "sides",
        image: "./assets/sides/OnionRings.jpg"
    },
    {
        id: generateId(),
        name: "Extra Cheese Loaded Fries",
        price: 650,
        category: "sides",
        image: "./assets/sides/CheeseLoadedFries.jpg"
    },
    {
        id: generateId(),
        name: "Medium Garlic Bread (4 pcs)",
        price: 450,
        category: "sides",
        image: "./assets/sides/GarlicBread.jpg"
    },
    {
        id: generateId(),
        name: "Mozzarella Sticks with Sauce",
        price: 700,
        category: "sides",
        image: "./assets/sides/MozzarellaSticks.jpg"
    },
    {
        id: generateId(),
        name: "Chicken Popcorn with Maionese",
        price: 600,
        category: "sides",
        image: "./assets/sides/ChickenPopcorn.jpg"
    },
    {
        id: generateId(),
        name: "Coleslaw with Maionese & Sauce",
        price: 350,
        category: "sides",
        image: "./assets/sides/Coleslaw.jpg"
    },
    {
        id: generateId(),
        name: "Pepsi",
        price: 250,
        category: "drinks",
        image: "./assets/drinks/Pepsi.jpg"
    },
    {
        id: generateId(),
        name: "Fanta Orange",
        price: 250,
        category: "drinks",
        image: "./assets/drinks/FantaOrange.jpg"
    },
    {
        id: generateId(),
        name: "Iced Coffee",
        price: 600,
        category: "drinks",
        image: "./assets/drinks/IcedCoffee.jpg"
    },
    {
        id: generateId(),
        name: "Iced Milo",
        price: 550,
        category: "drinks",
        image: "./assets/drinks/IcedMilo.jpg"
    },
    {
        id: generateId(),
        name: "Lemonade",
        price: 400,
        category: "drinks",
        image: "./assets/drinks/Lemonade.jpg"
    },
    {
        id: generateId(),
        name: "Strawberry Milkshake",
        price: 700,
        category: "drinks",
        image: "./assets/drinks/StrawberryMilkshake.jpg"
    },
    {
        id: generateId(),
        name: "Chocolate Milkshake",
        price: 750,
        category: "drinks",
        image: "./assets/drinks/ChocolateMilkshake.jpg"
    },
    {
        id: generateId(),
        name: "Fresh Orange Juice",
        price: 650,
        category: "drinks",
        image: "./assets/drinks/FreshOrangeJuice.jpg"
    },
    {
        id: generateId(),
        name: "Vanilla Sundae",
        price: 450,
        category: "desserts",
        image: "./assets/desserts/VanillaSundae.jpg"
    },
    {
        id: generateId(),
        name: "Strawberry Sundae",
        price: 500,
        category: "desserts",
        image: "./assets/desserts/StrawberrySundae.jpg"
    },
    {
        id: generateId(),
        name: "Chocolate Sundae",
        price: 650,
        category: "desserts",
        image: "./assets/desserts/ChocolateSundae.jpg"
    },
    {
        id: generateId(),
        name: "Caramel Sundae",
        price: 650,
        category: "desserts",
        image: "./assets/desserts/CaramelSundae.jpg"
    },
    {
        id: generateId(),
        name: "Brownie with Ice Cream",
        price: 900,
        category: "desserts",
        image: "./assets/desserts/BrowniewithIceCream.jpg"
    },
    {
        id: generateId(),
        name: "Chocolate Lava Cake",
        price: 950,
        category: "desserts",
        image: "./assets/desserts/ChocolateLavaCake.jpg"
    },
    {
        id: generateId(),
        name: "Mini Donuts (6 pcs)",
        price: 700,
        category: "desserts",
        image: "./assets/desserts/MiniDonuts.jpg"
    },
    {
        id: generateId(),
        name: "Oreo Milkshake",
        price: 780,
        category: "desserts",
        image: "./assets/desserts/OreoMilkshake.jpg"
    }
];

// Optional seed customers
const seedCustomers = [
    { id: generateId(), name: "Walk-in Customer" },
    { id: generateId(), name: "John Doe" },
    { id: generateId(), name: "Mary Silva" }
];

// Load existing data
let products = loadData("gm_products");
let customers = loadData("gm_customers");
let orders = loadData("gm_orders");

// Insert seed data only if empty
if (products.length === 0) {
    products = seedProducts;
    saveData("gm_products", products);
}

if (customers.length === 0) {
    customers = seedCustomers;
    saveData("gm_customers", customers);
}

if (orders.length === 0) {
    saveData("gm_orders", []);
}

console.log("Seed data loaded successfully (only if storage was empty).");