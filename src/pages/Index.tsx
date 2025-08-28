import { Header } from "@/components/Header";
import { Dashboard } from "@/components/Dashboard";
import { BottomNavigation } from "@/components/BottomNavigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background-gradient-start via-background-gradient-mid to-background-gradient-end pt-16">
      <Header />
      <div className="max-w-7xl mx-auto">
        <main className="px-4 pt-4 pb-24">
          <Dashboard />
        </main>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Index;
