import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, X, MapPin, Clock, Star, Utensils } from "lucide-react";
import { SwipeableRestaurantCard } from "@/components/SwipeableRestaurantCard";

interface Restaurant {
  id: string;
  name: string;
  distance: string;
  cuisine: string;
  rating: number;
  image: string;
  topDishes: Array<{
    name: string;
    healthScore: number;
    price: string;
  }>;
}

const mockRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "Green Garden Bistro",
    distance: "0.3 miles",
    cuisine: "Mediterranean",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
    topDishes: [
      { name: "Quinoa Power Bowl", healthScore: 95, price: "$14" },
      { name: "Grilled Salmon", healthScore: 92, price: "$18" },
      { name: "Greek Salad", healthScore: 88, price: "$12" }
    ]
  },
  {
    id: "2", 
    name: "Tokyo Fusion",
    distance: "0.5 miles",
    cuisine: "Japanese",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
    topDishes: [
      { name: "Miso Salmon Bowl", healthScore: 90, price: "$16" },
      { name: "Veggie Sushi Roll", healthScore: 85, price: "$13" },
      { name: "Seaweed Salad", healthScore: 93, price: "$8" }
    ]
  },
  {
    id: "3",
    name: "Farm Fresh Kitchen",
    distance: "0.8 miles", 
    cuisine: "Farm-to-Table",
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
    topDishes: [
      { name: "Grass-Fed Steak", healthScore: 87, price: "$24" },
      { name: "Roasted Veggie Plate", healthScore: 94, price: "$15" },
      { name: "Herb Crusted Chicken", healthScore: 89, price: "$19" }
    ]
  },
  {
    id: "4",
    name: "Spice Route",
    distance: "0.6 miles",
    cuisine: "Indian",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
    topDishes: [
      { name: "Tandoori Chicken", healthScore: 88, price: "$17" },
      { name: "Lentil Dal", healthScore: 94, price: "$11" },
      { name: "Vegetable Curry", healthScore: 91, price: "$13" }
    ]
  },
  {
    id: "5",
    name: "Coastal Catch",
    distance: "0.4 miles",
    cuisine: "Seafood",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop",
    topDishes: [
      { name: "Grilled Halibut", healthScore: 93, price: "$22" },
      { name: "Seafood Salad", healthScore: 89, price: "$16" },
      { name: "Clam Chowder", healthScore: 82, price: "$9" }
    ]
  },
  {
    id: "6",
    name: "Verde Vegan",
    distance: "0.7 miles",
    cuisine: "Plant-Based",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    topDishes: [
      { name: "Buddha Bowl", healthScore: 96, price: "$15" },
      { name: "Jackfruit Tacos", healthScore: 92, price: "$12" },
      { name: "Cashew Cheese Plate", healthScore: 87, price: "$14" }
    ]
  },
  {
    id: "7",
    name: "Nonna's Kitchen",
    distance: "0.9 miles",
    cuisine: "Italian",
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
    topDishes: [
      { name: "Zucchini Pasta", healthScore: 90, price: "$16" },
      { name: "Margherita Pizza", healthScore: 83, price: "$18" },
      { name: "Caprese Salad", healthScore: 91, price: "$13" }
    ]
  },
  {
    id: "8",
    name: "Mountain View Grill",
    distance: "1.1 miles",
    cuisine: "American",
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
    topDishes: [
      { name: "Turkey Burger", healthScore: 86, price: "$15" },
      { name: "Sweet Potato Fries", healthScore: 84, price: "$8" },
      { name: "Quinoa Salad", healthScore: 92, price: "$12" }
    ]
  },
  {
    id: "9",
    name: "Thai Harmony",
    distance: "0.8 miles",
    cuisine: "Thai",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1559314809-0f31657def5e?w=400&h=300&fit=crop",
    topDishes: [
      { name: "Tom Yum Soup", healthScore: 89, price: "$10" },
      { name: "Pad Thai (Brown Rice)", healthScore: 85, price: "$14" },
      { name: "Green Papaya Salad", healthScore: 93, price: "$11" }
    ]
  },
  {
    id: "10",
    name: "Artisan Brew & Bites",
    distance: "0.6 miles",
    cuisine: "Café",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop",
    topDishes: [
      { name: "Avocado Toast", healthScore: 88, price: "$9" },
      { name: "Acai Bowl", healthScore: 94, price: "$12" },
      { name: "Protein Smoothie", healthScore: 91, price: "$8" }
    ]
  }
];

const Meals = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedRestaurants, setSwipedRestaurants] = useState<{ restaurant: Restaurant; interested: boolean }[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentRestaurant = mockRestaurants[currentIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentRestaurant && !isTransitioning) {
      setIsTransitioning(true);
      const interested = direction === 'right';
      setSwipedRestaurants(prev => [...prev, { restaurant: currentRestaurant, interested }]);
      
      // Delay index change to allow animation to complete
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setIsTransitioning(false);
      }, 500);
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 80) return "text-warning";
    return "text-metric-negative";
  };

  const getHealthScoreBg = (score: number) => {
    if (score >= 90) return "bg-success/20";
    if (score >= 80) return "bg-warning/20";
    return "bg-metric-negative/20";
  };

  if (showHistory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background-gradient-start via-background to-background-gradient-end pt-16">
        <div className="max-w-7xl mx-auto">
          <Header />
          <main className="px-4 pt-4 pb-24">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Meal History</h1>
              <Button onClick={() => setShowHistory(false)} variant="outline">
                Back to Discovery
              </Button>
            </div>
            
            <div className="grid gap-4">
              {swipedRestaurants.map((item, index) => (
                <Card key={index} className={`glass-card p-4 ${item.interested ? 'border-success' : 'border-muted'}`}>
                  <div className="flex items-center gap-4">
                    <img 
                      src={item.restaurant.image} 
                      alt={item.restaurant.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.restaurant.name}</h3>
                      <p className="text-sm text-foreground-secondary">{item.restaurant.cuisine}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-3 w-3" />
                        <span className="text-xs">{item.restaurant.distance}</span>
                      </div>
                    </div>
                    <Badge variant={item.interested ? "default" : "secondary"}>
                      {item.interested ? "Interested" : "Passed"}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </main>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (currentIndex >= mockRestaurants.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background-gradient-start via-background to-background-gradient-end pt-16">
        <div className="max-w-7xl mx-auto">
          <Header />
          <main className="px-4 pt-4 pb-24">
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <Utensils className="h-16 w-16 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-2">All Done!</h2>
              <p className="text-foreground-secondary mb-6">
                You've reviewed all nearby restaurants. Check back later for more options!
              </p>
              <div className="flex gap-4">
                <Button onClick={() => setCurrentIndex(0)}>
                  Start Over
                </Button>
                <Button onClick={() => setShowHistory(true)} variant="outline">
                  View History
                </Button>
              </div>
            </div>
          </main>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-gradient-start via-background to-background-gradient-end pt-16">
      <div className="max-w-7xl mx-auto">
        <Header />
        <main className="px-4 pt-4 pb-24">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Restaurant Finder</h1>
              <p className="text-sm text-foreground-secondary">
                Personalized recommendations based on your nutrition goals
              </p>
            </div>
            <Button onClick={() => setShowHistory(true)} variant="outline" size="sm">
              History ({swipedRestaurants.length})
            </Button>
          </div>

          {currentRestaurant && (
            <div className="max-w-md mx-auto">
              <SwipeableRestaurantCard
                restaurant={currentRestaurant}
                nextRestaurant={currentIndex + 1 < mockRestaurants.length ? mockRestaurants[currentIndex + 1] : undefined}
                onSwipe={handleSwipe}
                totalCount={mockRestaurants.length}
                currentIndex={currentIndex}
              />
            </div>
          )}
        </main>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Meals;