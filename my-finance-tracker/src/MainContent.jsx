import { useLocation, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "./Sidebar/Sidebar";
import Login from "./Users/Login";
import Signup from "./Users/SignUp";
import Header from "./Header/Header";
import { useSearchFilter } from "./Header/SearchFilterContext";
import Dashboard from "./Dashboard/Dashboard";
import Transactions from "./Transactions/Transactions";
import Bills from "./Bills/Bills";
import ViewBudget from "./Budgets/ViewBudget";
import Savings from "./Savings/Savings";
import PrivateWrapper from "./PrivateWrapper";
import "./global.css";

function MainContent() {
    const location = useLocation();
    const { setSearch, setFilter } = useSearchFilter();

    const allowedPaths = ["/", "/savings", "/budgets"];

    useEffect(() => {
        setSearch("");
        setFilter("Date \u2198\uFE0E");
    }, [location.pathname]);
  
    return (
        <>
            {
                (location.pathname !== "/login" && location.pathname !== "/signup") && (
                    <>
                    <Sidebar />
                    {location.pathname === "/transactions" &&
                        <Header onSearchChange={setSearch} 
                            onFilterChange={setFilter} 
                            filters={[
                                "Amount \u2197\uFE0E",
                                "Amount \u2198\uFE0E",
                                "Date \u2197\uFE0E",
                                "Date \u2198\uFE0E",
                                "Inbound",
                                "Outbound"
                            ]}/>
                    }
                    {location.pathname === "/bills" && 
                    <Header onSearchChange={setSearch} 
                    onFilterChange={setFilter} 
                    filters={[
                        "Amount \u2197\uFE0E",
                        "Amount \u2198\uFE0E",
                        "Date \u2197\uFE0E",
                        "Date \u2198\uFE0E",
                        "Unpaid",
                        "Paid",
                        "Not Recurring",
                        "Weekly",
                        "Monthly",
                        "Annually"
                    ]}/>
                    }
                    {allowedPaths.includes(location.pathname) && 
                    <Header />}
                    </>
                )
            }
            
            <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
                <Route path="" exact element={<PrivateWrapper />}>
                            <Route index element={<Dashboard />} />
                        </Route>
                    <Route path="/transactions" element={<PrivateWrapper />}>
                        <Route index element={<Transactions />} />
                    </Route>
                    <Route path="/bills" element={<PrivateWrapper />} >
                        <Route index element={<Bills />} />
                        </Route>
                    <Route path="/budgets" element={<PrivateWrapper />} >
                        <Route index element={<ViewBudget />} />
                        </Route>
                    <Route path="/savings" element={<PrivateWrapper />} >
                        <Route index element={<Savings />} />
                        </Route>
                    <Route path="/*" element={<PrivateWrapper />} />
            </Routes>
        </>
    );
  }

export default MainContent;
  