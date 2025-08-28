import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, X, MapPin, Clock, Star, Utensils } from "lucide-react";

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
  }
];

const Meals = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedRestaurants, setSwipedRestaurants] = useState<{ restaurant: Restaurant; interested: boolean }[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const currentRestaurant = mockRestaurants[currentIndex];

  const handleSwipe = (interested: boolean) => {
    if (currentRestaurant) {
      setSwipedRestaurants(prev => [...prev, { restaurant: currentRestaurant, interested }]);
      setCurrentIndex(prev => prev + 1);
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
              <Card className="glass-card overflow-hidden">
                {/* Restaurant Image */}
                <div className="relative h-64">
                  <img 
                    src={currentRestaurant.image} 
                    alt={currentRestaurant.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-background/80 text-foreground">
                      {currentIndex + 1} of {mockRestaurants.length}
                    </Badge>
                  </div>
                </div>

                {/* Restaurant Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold">{currentRestaurant.name}</h2>
                      <p className="text-foreground-secondary">{currentRestaurant.cuisine}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-warning fill-current" />
                      <span className="text-sm font-medium">{currentRestaurant.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-6 text-sm text-foreground-secondary">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{currentRestaurant.distance}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Open now</span>
                    </div>
                  </div>

                  {/* Top Recommended Dishes */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Top Matches for You</h3>
                    <div className="space-y-3">
                      {currentRestaurant.topDishes.map((dish, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{dish.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge 
                                className={`text-xs ${getHealthScoreBg(dish.healthScore)} ${getHealthScoreColor(dish.healthScore)}`}
                              >
                                {dish.healthScore}% Health Match
                              </Badge>
                              <span className="text-xs font-medium">{dish.price}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Swipe Actions */}
                  <div className="flex gap-4">
                    <Button
                      onClick={() => handleSwipe(false)}
                      variant="outline"
                      size="lg"
                      className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                    >
                      <X className="h-5 w-5 mr-2" />
                      Pass
                    </Button>
                    <Button
                      onClick={() => handleSwipe(true)}
                      size="lg"
                      className="flex-1"
                    >
                      <Heart className="h-5 w-5 mr-2" />
                      Interested
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Meals;