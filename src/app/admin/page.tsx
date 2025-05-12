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

// Initialize Appwrite Client directly in the component
const client = new Client()
  .setEndpoint(
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1"
  )
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "");

const account = new Account(client);

interface PaymentLog {
  userId: string;
  username: string;
  dateTime: string;
  paymentFrom: string;
  platform: string;
  playerId: string;
  paymentAmount: number;
  paymentId: string;
}

interface User {
  userId: string;
  tier1: boolean;
  tier2: boolean;
  tier3: boolean;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentLogs, setPaymentLogs] = useState<PaymentLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Check authentication directly from localStorage
    if (!isAdminAuthenticated()) {
      router.push("/admin/login");
      return;
    }

    // Load dashboard data
    fetchMockData();
    setIsLoading(false);
  }, [router]);

  const fetchMockData = () => {
    // Mock payment logs data
    const mockPaymentLogs: PaymentLog[] = [
      {
        userId: "user_123",
        username: "player1",
        dateTime: "2023-11-15 14:30:45",
        paymentFrom: "PayPal",
        platform: "Web",
        playerId: "unity_123",
        paymentAmount: 19.99,
        paymentId: "pay_abc123",
      },
      {
        userId: "user_456",
        username: "gamer2",
        dateTime: "2023-11-16 09:15:22",
        paymentFrom: "Credit Card",
        platform: "Mobile",
        playerId: "unity_456",
        paymentAmount: 49.99,
        paymentId: "pay_def456",
      },
      {
        userId: "user_789",
        username: "xXProGamerXx",
        dateTime: "2023-11-17 18:45:12",
        paymentFrom: "Google Pay",
        platform: "Web",
        playerId: "unity_789",
        paymentAmount: 29.99,
        paymentId: "pay_ghi789",
      },
      {
        userId: "user_101",
        username: "gameMaster42",
        dateTime: "2023-11-18 22:10:33",
        paymentFrom: "Apple Pay",
        platform: "Mobile",
        playerId: "unity_101",
        paymentAmount: 99.99,
        paymentId: "pay_jkl101",
      },
      {
        userId: "user_202",
        username: "epicPlayer",
        dateTime: "2023-11-19 11:05:56",
        paymentFrom: "PayPal",
        platform: "Web",
        playerId: "unity_202",
        paymentAmount: 14.99,
        paymentId: "pay_mno202",
      },
      {
        userId: "user_303",
        username: "gameWizard",
        dateTime: "2023-11-20 15:30:18",
        paymentFrom: "Credit Card",
        platform: "Mobile",
        playerId: "unity_303",
        paymentAmount: 59.99,
        paymentId: "pay_pqr303",
      },
      {
        userId: "user_404",
        username: "legendaryGamer",
        dateTime: "2023-11-21 08:22:41",
        paymentFrom: "Google Pay",
        platform: "Web",
        playerId: "unity_404",
        paymentAmount: 39.99,
        paymentId: "pay_stu404",
      },
    ];

    // Mock users data
    const mockUsers: User[] = [
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

    setPaymentLogs(mockPaymentLogs);
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
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

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
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Payment From</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Player ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentLogs.map((log, index) => (
                    <TableRow
                      className="border-b border-gray-800/50"
                      key={index}
                    >
                      <TableCell>{log.userId}</TableCell>
                      <TableCell>{log.username}</TableCell>
                      <TableCell>{log.dateTime}</TableCell>
                      <TableCell>{log.paymentFrom}</TableCell>
                      <TableCell>{log.platform}</TableCell>
                      <TableCell>{log.playerId}</TableCell>
                      <TableCell>${log.paymentAmount.toFixed(2)}</TableCell>
                      <TableCell>{log.paymentId}</TableCell>
                    </TableRow>
                  ))}
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
                  {users.map((user, index) => (
                    <TableRow
                      className="border-b border-gray-800/50"
                      key={index}
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
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
