using backend.Models;

namespace backend.Data
{
    /// <summary>
    /// Sample inventory data, inserted automatically on first run
    /// when the InventoryItems table is empty.
    /// </summary>
    public static class SeedData
    {
        /// <summary>
        /// The sample inventory items inserted on first run.
        /// </summary>
        public static readonly InventoryItem[] InventoryItems =
        [
        new() { Name = "Apple MacBook Pro 16\"", Quantity = 50, Price = 2399.99m },
        new() { Name = "Samsung Galaxy S21", Quantity = 120, Price = 799.99m },
        new() { Name = "Sony WH-1000XM4 Headphones", Quantity = 75, Price = 349.99m },
        new() { Name = "Dell XPS 13", Quantity = 80, Price = 1299.99m },
        new() { Name = "HP Spectre x360", Quantity = 60, Price = 1399.99m },
        new() { Name = "Google Pixel 5", Quantity = 90, Price = 699.99m },
        new() { Name = "Microsoft Surface Pro 7", Quantity = 40, Price = 899.99m },
        new() { Name = "Fitbit Versa 3", Quantity = 100, Price = 229.99m },
        new() { Name = "Logitech MX Master 3 Mouse", Quantity = 110, Price = 99.99m },
        new() { Name = "Amazon Echo Dot (4th Gen)", Quantity = 150, Price = 49.99m },
        new() { Name = "Nikon D3500 Camera", Quantity = 30, Price = 499.99m },
        new() { Name = "Canon EOS Rebel T7", Quantity = 25, Price = 449.99m },
        new() { Name = "iPad Pro 11\"", Quantity = 65, Price = 799.99m },
        new() { Name = "Samsung Galaxy Tab S7", Quantity = 55, Price = 649.99m },
        new() { Name = "Razer Blade 15 Gaming Laptop", Quantity = 20, Price = 2499.99m },
        new() { Name = "Asus ROG Zephyrus G14", Quantity = 15, Price = 1799.99m },
        new() { Name = "Bose SoundLink Revolve", Quantity = 45, Price = 199.99m },
        new() { Name = "GoPro HERO9 Black", Quantity = 35, Price = 399.99m },
        new() { Name = "Anker PowerCore 10000", Quantity = 200, Price = 29.99m },
        new() { Name = "Sony A7 III Camera", Quantity = 10, Price = 1999.99m },
        new() { Name = "DJI Mavic Air 2", Quantity = 18, Price = 799.99m },
        new() { Name = "Oculus Quest 2", Quantity = 25, Price = 299.99m },
        new() { Name = "HP Omen 15 Gaming Laptop", Quantity = 22, Price = 1399.99m },
        new() { Name = "Apple AirPods Pro", Quantity = 150, Price = 249.99m },
        new() { Name = "Microsoft Xbox Series X", Quantity = 30, Price = 499.99m },
        new() { Name = "Sony PlayStation 5", Quantity = 20, Price = 499.99m },
        new() { Name = "Nintendo Switch", Quantity = 40, Price = 299.99m },
        new() { Name = "iPhone 12", Quantity = 75, Price = 999.99m },
        new() { Name = "Samsung 970 EVO SSD 1TB", Quantity = 50, Price = 149.99m },
        new() { Name = "Western Digital My Passport 2TB", Quantity = 65, Price = 89.99m },
        new() { Name = "Seagate Backup Plus 4TB", Quantity = 45, Price = 99.99m },
        new() { Name = "Lenovo ThinkPad X1 Carbon", Quantity = 25, Price = 1699.99m },
        new() { Name = "Acer Aspire 5", Quantity = 55, Price = 549.99m },
        new() { Name = "LG OLED55CXPUA TV", Quantity = 15, Price = 1399.99m },
        new() { Name = "Vizio 55-Inch 4K Smart TV", Quantity = 30, Price = 649.99m },
        new() { Name = "Samsung Galaxy Buds+", Quantity = 80, Price = 149.99m },
        new() { Name = "Bose QuietComfort 35 II", Quantity = 20, Price = 299.99m },
        new() { Name = "HP Envy 13", Quantity = 45, Price = 999.99m },
        new() { Name = "Apple Watch Series 6", Quantity = 65, Price = 399.99m },
        new() { Name = "Fitbit Charge 4", Quantity = 100, Price = 149.99m },
        new() { Name = "Roku Streaming Stick 4K", Quantity = 150, Price = 49.99m },
        new() { Name = "Google Nest Hub", Quantity = 70, Price = 99.99m },
        new() { Name = "Philips Hue White LED Smart Bulb", Quantity = 200, Price = 14.99m },
        new() { Name = "Keurig K-Elite Coffee Maker", Quantity = 50, Price = 129.99m },
        new() { Name = "Instant Pot Duo 7-in-1", Quantity = 80, Price = 89.99m },
        new() { Name = "KitchenAid Stand Mixer", Quantity = 20, Price = 349.99m },
        new() { Name = "Nespresso Vertuo Coffee Maker", Quantity = 30, Price = 199.99m },
        new() { Name = "Dyson V11 Torque Drive", Quantity = 25, Price = 599.99m },
        new() { Name = "Shark Navigator Lift-Away", Quantity = 45, Price = 199.99m },
        new() { Name = "iRobot Roomba 675", Quantity = 35, Price = 299.99m },
        new() { Name = "Breville Smart Oven", Quantity = 15, Price = 199.99m },
        new() { Name = "Cuisinart 14-Cup Food Processor", Quantity = 18, Price = 199.99m },
        new() { Name = "Hamilton Beach Slow Cooker", Quantity = 50, Price = 49.99m },
        new() { Name = "Vitamix 5200 Blender", Quantity = 20, Price = 449.99m },
        new() { Name = "Black+Decker 20V Max Drill", Quantity = 55, Price = 79.99m },
        new() { Name = "Makita 18V LXT Circular Saw", Quantity = 30, Price = 149.99m },
        new() { Name = "DeWalt 20V Max Lithium-Ion Cordless Combo Kit", Quantity = 25, Price = 349.99m },
        new() { Name = "Craftsman 20-Piece Socket Set", Quantity = 50, Price = 89.99m },
        new() { Name = "Ryobi 18V Cordless Drill", Quantity = 40, Price = 99.99m },
        new() { Name = "Milwaukee M18 Fuel 1/2\" Hammer Drill", Quantity = 22, Price = 199.99m },
        new() { Name = "Stanley 77-Piece Mechanics Tool Set", Quantity = 35, Price = 159.99m },
        new() { Name = "Dremel 4300 Rotary Tool Kit", Quantity = 30, Price = 199.99m },
        new() { Name = "Greenworks 20-Inch Cordless Lawn Mower", Quantity = 18, Price = 349.99m },
        new() { Name = "Sun Joe Electric Pressure Washer", Quantity = 20, Price = 159.99m },
        new() { Name = "Toro 22-Inch Recycler Mower", Quantity = 25, Price = 299.99m },
        new() { Name = "Black+Decker Electric Leaf Blower", Quantity = 40, Price = 99.99m },
        new() { Name = "Coleman Portable Camping Chair", Quantity = 100, Price = 39.99m },
        new() { Name = "REI Co-op Flash 22 Pack", Quantity = 80, Price = 59.99m },
        new() { Name = "YETI Rambler 20 oz Tumbler", Quantity = 150, Price = 29.99m },
        new() { Name = "LifeStraw Personal Water Filter", Quantity = 200, Price = 19.99m },
        new() { Name = "Patagonia Black Hole Duffel Bag", Quantity = 30, Price = 129.99m },
        new() { Name = "Columbia Bugaboo II Fleece Interchange Jacket", Quantity = 25, Price = 89.99m },
        new() { Name = "The North Face Recon Backpack", Quantity = 20, Price = 99.99m },
        ];
    }
}
