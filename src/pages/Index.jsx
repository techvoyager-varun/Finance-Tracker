import { DashboardProvider } from "@/context/DashboardContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SummaryCards from "@/components/dashboard/SummaryCards";
import BalanceTrendChart from "@/components/dashboard/BalanceTrendChart";
import SpendingBreakdownChart from "@/components/dashboard/SpendingBreakdownChart";
import TransactionsTable from "@/components/dashboard/TransactionsTable";
import InsightsSection from "@/components/dashboard/InsightsSection";
const Index = () => {
  return <DashboardProvider>
      <div className="min-h-screen w-full bg-background transition-colors duration-300">
        <main className="w-full px-4 py-6 sm:px-6 lg:px-8">
          <div className="w-full space-y-6">
            <DashboardHeader />
            <SummaryCards />
            <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="w-full lg:col-span-2">
                <BalanceTrendChart />
              </div>
              <SpendingBreakdownChart />
            </div>
            <InsightsSection />
            <TransactionsTable />
          </div>
        </main>
      </div>
    </DashboardProvider>;
};
export default Index;
