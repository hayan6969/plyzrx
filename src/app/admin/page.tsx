"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Client, Account } from "appwrite";
import { isAdminAuthenticated, clearAdminAuth } from "@/lib/authStorage";
import {
  PaymentLog,
  UserTier,
  getPaymentLogs,
  getAllUserTiers,
} from "@/lib/appwriteDB";

// Initialize Appwrite Client directly in the component
const client = new Client()
  .setEndpoint(
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1"
  )
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "");

const account = new Account(client);

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentLogs, setPaymentLogs] = useState<PaymentLog[]>([]);
  const [users, setUsers] = useState<UserTier[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication directly from localStorage
    if (!isAdminAuthenticated()) {
      router.push("/admin/login");
      return;
    }

    // Load dashboard data
    fetchAppwriteData();
  }, [router]);

  const fetchAppwriteData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch payment logs from Appwrite
      const logs = await getPaymentLogs();

      if (logs.length > 0) {
        setPaymentLogs(logs);
      } else {
        // If no logs found, use mock data as fallback
        fetchMockPaymentLogs();
      }

      // Fetch user tiers from Appwrite
      const userTiers = await getAllUserTiers();

      if (userTiers.length > 0) {
        setUsers(userTiers);
      } else {
        // If no user tiers found, use mock data as fallback
        fetchMockUserTiers();
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(
        "Failed to load data from Appwrite. Using mock data as fallback."
      );

      // Use mock data as fallback
      fetchMockPaymentLogs();
      fetchMockUserTiers();
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMockPaymentLogs = () => {
    // Mock payment logs data
    const mockPaymentLogs: PaymentLog[] = [
      {
        userId: "user_123",
        username: "player1",
        dateTime: "2023-11-15 14:30:45",
        platform: "Web",
        paymentAmount: 19.99,
        paymentId: "pay_abc123",
      },
      {
        userId: "user_456",
        username: "gamer2",
        dateTime: "2023-11-16 09:15:22",
        platform: "Web",
        paymentAmount: 49.99,
        paymentId: "pay_def456",
      },
      {
        userId: "user_789",
        username: "xXProGamerXx",
        dateTime: "2023-11-17 18:45:12",
        platform: "Web",
        paymentAmount: 29.99,
        paymentId: "pay_ghi789",
      },
      {
        userId: "user_101",
        username: "gameMaster42",
        dateTime: "2023-11-18 22:10:33",
        platform: "Web",
        paymentAmount: 99.99,
        paymentId: "pay_jkl101",
      },
      {
        userId: "user_202",
        username: "epicPlayer",
        dateTime: "2023-11-19 11:05:56",
        platform: "Web",
        paymentAmount: 14.99,
        paymentId: "pay_mno202",
      },
      {
        userId: "user_303",
        username: "gameWizard",
        dateTime: "2023-11-20 15:30:18",
        platform: "Web",
        paymentAmount: 59.99,
        paymentId: "pay_pqr303",
      },
      {
        userId: "user_404",
        username: "legendaryGamer",
        dateTime: "2023-11-21 08:22:41",
        platform: "Web",
        paymentAmount: 39.99,
        paymentId: "pay_stu404",
      },
    ];

    setPaymentLogs(mockPaymentLogs);
  };

  const fetchMockUserTiers = () => {
    // Mock users data
    const mockUsers: UserTier[] = [
      {
        userId: "user_123",
        tier1: true,
        tier2: true,
        tier3: false,
      },
      {
        userId: "user_456",
        tier1: true,
        tier2: true,
        tier3: true,
      },
      {
        userId: "user_789",
        tier1: true,
        tier2: false,
        tier3: false,
      },
      {
        userId: "user_101",
        tier1: true,
        tier2: true,
        tier3: true,
      },
      {
        userId: "user_202",
        tier1: true,
        tier2: false,
        tier3: false,
      },
      {
        userId: "user_303",
        tier1: false,
        tier2: false,
        tier3: false,
      },
      {
        userId: "user_404",
        tier1: true,
        tier2: true,
        tier3: false,
      },
    ];

    setUsers(mockUsers);
  };

  const handleLogout = async () => {
    try {
      // Logout from Appwrite
      await account.deleteSession("current");

      // Clear localStorage
      clearAdminAuth();

      toast.success("Logged out successfully");
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);

      // Even if API logout fails, clear local storage and redirect
      clearAdminAuth();
      toast.warning("Session ended");
      router.push("/admin/login");
    }
  };

  const handleRefresh = () => {
    fetchAppwriteData();
    toast.info("Refreshing data...");
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-custompink"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-8">
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-custompink">Admin Dashboard</h1>
        <div className="flex gap-4">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Refresh Data
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <Tabs defaultValue="payments" className="w-full">
        <TabsList className="flex gap-2 mb-4 ">
          <TabsTrigger className="border-2 border-gray-800/50" value="payments">
            Payment Logs
          </TabsTrigger>
          <TabsTrigger className="border-2 border-gray-800/50" value="users">
            Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payments">
          <Card className=" border-2 border-gray-800/50 ">
            <CardHeader>
              <CardTitle>Payment Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>List of all payment transactions</TableCaption>
                <TableHeader>
                  <TableRow className="border-b-4 border-gray-800">
                    <TableHead>User ID</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date & Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No payment logs found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paymentLogs.map((log, index) => (
                      <TableRow
                        className="border-b border-gray-800/50"
                        key={log.$id || log.paymentId || index}
                      >
                        <TableCell>{log.userId}</TableCell>
                        <TableCell>{log.username}</TableCell>
                        <TableCell>{log.paymentId}</TableCell>
                        <TableCell>{log.platform}</TableCell>
                        <TableCell>${log.paymentAmount.toFixed(2)}</TableCell>
                        <TableCell>{log.dateTime}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className=" border-2 border-gray-800/50">
            <CardHeader>
              <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>User tier information</TableCaption>
                <TableHeader>
                  <TableRow className="border-b-4 border-gray-800">
                    <TableHead>User ID</TableHead>
                    <TableHead>Tier 1</TableHead>
                    <TableHead>Tier 2</TableHead>
                    <TableHead>Tier 3</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user, index) => (
                      <TableRow
                        className="border-b border-gray-800/50"
                        key={user.$id || user.userId || index}
                      >
                        <TableCell>{user.userId}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              user.tier1
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-red-600 hover:bg-red-700"
                            }
                            variant="default"
                          >
                            {user.tier1 ? "true" : "false"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              user.tier2
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-red-600 hover:bg-red-700"
                            }
                            variant="default"
                          >
                            {user.tier2 ? "true" : "false"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              user.tier3
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-red-600 hover:bg-red-700"
                            }
                            variant="default"
                          >
                            {user.tier3 ? "true" : "false"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
