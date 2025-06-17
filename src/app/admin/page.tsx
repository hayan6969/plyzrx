"use client";

import { useEffect, useState, useCallback } from "react";
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
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Client, Account } from "appwrite";
import { isAdminAuthenticated, clearAdminAuth } from "@/lib/authStorage";
import {
  PaymentLog,
  UserTier,
  TournamentControl,
  TournamentAssignment,
  getPaymentLogs,
  getAllUserTiers,
  getAllTournaments,
  createTournament,
  updateTournament,
  startTournament,
  endTournament,
  getAllMatchLogs,
  MatchLog,
  getAllTournamentAssignments,
  bulkAssignAwaitingUsers,
} from "@/lib/appwriteDB";
import { useForm, Controller } from "react-hook-form";

// Tournament Form Interface for React Hook Form
interface TournamentFormData {
  name: string;
  tier: string;
  scheduledStartDate: string;
  scheduledEndDate: string;
  isManualMode: boolean;
}

// Edit Tournament Form Interface
interface EditTournamentForm {
  name: string;
  tier: string;
  scheduledStartDate: string;
  scheduledEndDate: string;
  isManualMode: boolean;
}

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
  const [tournamentControls, setTournamentControls] = useState<
    TournamentControl[]
  >([]);
  const [matchLogs, setMatchLogs] = useState<MatchLog[]>([]);
  const [selectedMatchLog, setSelectedMatchLog] = useState<MatchLog | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTournamentId, setEditingTournamentId] = useState<string>("");
  const [tournamentAssignments, setTournamentAssignments] = useState<
    TournamentAssignment[]
  >([]);
  const [activeAssignments, setActiveAssignments] = useState<
    TournamentAssignment[]
  >([]);
  const [awaitingAssignments, setAwaitingAssignments] = useState<
    TournamentAssignment[]
  >([]);
  const [completedAssignments, setCompletedAssignments] = useState<
    TournamentAssignment[]
  >([]);
  const [isAssigning, setIsAssigning] = useState(false);

  // Helper function to add one week to a date
  const addOneWeek = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    date.setDate(date.getDate() + 7);
    return date.toISOString().slice(0, 16);
  };

  // React Hook Form setup for create tournament
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TournamentFormData>({
    defaultValues: {
      name: "",
      tier: "1",
      scheduledStartDate: "",
      scheduledEndDate: "",
      isManualMode: false,
    },
  });

  // React Hook Form setup for edit tournament
  const {
    register: editRegister,
    handleSubmit: editHandleSubmit,
    control: editControl,
    reset: editReset,
    setValue: editSetValue,
    watch: editWatch,
    formState: { errors: editErrors },
  } = useForm<EditTournamentForm>({
    defaultValues: {
      name: "",
      tier: "1",
      scheduledStartDate: "",
      scheduledEndDate: "",
      isManualMode: false,
    },
  });

  // Watch for start date changes in create form
  const watchStartDate = watch("scheduledStartDate");
  const watchEditStartDate = editWatch("scheduledStartDate");

  // Auto-update end date when start date changes (Create form)
  useEffect(() => {
    if (watchStartDate) {
      const autoEndDate = addOneWeek(watchStartDate);
      setValue("scheduledEndDate", autoEndDate);
    }
  }, [watchStartDate, setValue]);

  // Auto-update end date when start date changes (Edit form)
  useEffect(() => {
    if (watchEditStartDate) {
      const autoEndDate = addOneWeek(watchEditStartDate);
      editSetValue("scheduledEndDate", autoEndDate);
    }
  }, [watchEditStartDate, editSetValue]);

  // Generate Tournament ID
  const generateTournamentId = (tier: number, startDate: Date): string => {
    const dateStr = startDate.toISOString().slice(0, 10).replace(/-/g, "_");
    return `T${tier}_${dateStr}`;
  };

  // Mock tournament data
  const fetchMockTournaments = () => {
    const mockTournaments: TournamentControl[] = [
      {
        tournamentId: "T1_2025_06_01",
        name: "Weekly Championship Tier 1",
        tier: 1,
        isManualMode: false,
        scheduledStartDate: new Date("2025-06-01T10:00:00"),
        scheduledEndDate: new Date("2025-06-08T10:00:00"), // One week later
        status: "scheduled",
        createdBy: "admin",
        lastModifiedBy: "admin",
      },
      {
        tournamentId: "T1_2025_06_08",
        name: "Premium League Tier 1",
        tier: 1,
        isManualMode: true,
        scheduledStartDate: new Date("2025-06-08T15:00:00"),
        scheduledEndDate: new Date("2025-06-15T15:00:00"), // One week later
        status: "scheduled",
        createdBy: "admin",
        lastModifiedBy: "admin",
      },
      {
        tournamentId: "T2_2025_06_15",
        name: "Elite Masters Tier 2",
        tier: 2,
        isManualMode: true,
        scheduledStartDate: new Date("2025-06-15T12:00:00"),
        scheduledEndDate: new Date("2025-06-22T12:00:00"), // One week later
        actualStartDate: new Date("2025-06-15T12:00:00"),
        status: "active",
        createdBy: "admin",
        lastModifiedBy: "admin",
      },
      {
        tournamentId: "T3_2025_06_10",
        name: "Champions League Tier 3",
        tier: 3,
        isManualMode: true,
        scheduledStartDate: new Date("2025-06-10T12:00:00"),
        scheduledEndDate: new Date("2025-06-17T12:00:00"), // One week later
        actualStartDate: new Date("2025-06-10T12:00:00"),
        actualEndDate: new Date("2025-06-17T18:30:00"),
        status: "ended",
        createdBy: "admin",
        lastModifiedBy: "admin",
      },
    ];

    setTournamentControls(mockTournaments);
  };

  const fetchAppwriteData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const fetchMockPaymentLogs = () => {
      // Mock payment logs data
      const mockPaymentLogs: PaymentLog[] = [
        {
          userId: "user_789",
          username: "xXProGamerXx",
          dateTime: "2023-11-17 18:45:12",
          platform: "Web",
          paymentAmount: 29.99,
          PaymentId: "pay_ghi789",
        },
        {
          userId: "user_101",
          username: "gameMaster42",
          dateTime: "2023-11-18 22:10:33",
          platform: "Web",
          paymentAmount: 99.99,
          PaymentId: "pay_jkl101",
        },
        {
          userId: "user_202",
          username: "epicPlayer",
          dateTime: "2023-11-19 11:05:56",
          platform: "Web",
          paymentAmount: 14.99,
          PaymentId: "pay_mno202",
        },
        {
          userId: "user_303",
          username: "gameWizard",
          dateTime: "2023-11-20 15:30:18",
          platform: "Web",
          paymentAmount: 59.99,
          PaymentId: "pay_pqr303",
        },
        {
          userId: "user_404",
          username: "legendaryGamer",
          dateTime: "2023-11-21 08:22:41",
          platform: "Web",
          paymentAmount: 39.99,
          PaymentId: "pay_stu404",
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

      // Fetch tournaments from Appwrite
      const tournaments = await getAllTournaments();

      if (tournaments.length > 0) {
        setTournamentControls(tournaments);
      } else {
        // If no tournaments found, use mock data as fallback
        fetchMockTournaments();
      }

      // Fetch match logs from Appwrite
      const matchess = await getAllMatchLogs();
      setMatchLogs(matchess);

      // Fetch tournament assignments
      const assignments = await getAllTournamentAssignments();
      setTournamentAssignments(assignments);

      // Separate assignments by status
      const active = assignments.filter((a) => a.AccessStatus === "Active");
      const awaiting = assignments.filter((a) => a.AccessStatus === "Awaiting");
      const completed = assignments.filter(
        (a) => a.AccessStatus === "Completed"
      );

      setActiveAssignments(active);
      setAwaitingAssignments(awaiting);
      setCompletedAssignments(completed);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(
        "Failed to load data from Appwrite. Using mock data as fallback."
      );

      // Use mock data as fallback
      fetchMockTournaments();
      fetchMockPaymentLogs();
      fetchMockUserTiers();
      setMatchLogs([]);
      setTournamentAssignments([]);
      setActiveAssignments([]);
      setAwaitingAssignments([]);
      setCompletedAssignments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create new tournament handler using React Hook Form
  const onSubmit = async (data: TournamentFormData) => {
    try {
      const startDate = new Date(data.scheduledStartDate);
      const endDate = new Date(data.scheduledEndDate);

      if (startDate >= endDate) {
        toast.error("End date must be after start date");
        return;
      }

      // Check if end date is at least one day after start date
      const minEndDate = new Date(startDate);
      minEndDate.setDate(minEndDate.getDate() + 1);

      if (endDate < minEndDate) {
        toast.error("Tournament must run for at least one day");
        return;
      }

      const tierNumber = parseInt(data.tier) as 1 | 2 | 3;
      const tournamentId = generateTournamentId(tierNumber, startDate);

      // Check if tournament ID already exists
      if (tournamentControls.some((t) => t.tournamentId === tournamentId)) {
        toast.error("A tournament with this tier and date already exists");
        return;
      }

      const newTournament: TournamentControl = {
        tournamentId,
        name: data.name,
        tier: tierNumber,
        isManualMode: data.isManualMode,
        scheduledStartDate: startDate,
        scheduledEndDate: endDate,
        status: "scheduled",
        createdBy: "admin",
        lastModifiedBy: "admin",
      };

      // Save to database
      const savedTournament = await createTournament(newTournament);

      // Update local state
      setTournamentControls((prev) => [...prev, savedTournament]);

      // Reset form
      reset();
      setIsCreateDialogOpen(false);
      toast.success("Tournament created successfully");
    } catch (error) {
      console.error("Failed to create tournament:", error);
      toast.error("Failed to create tournament");
    }
  };

  // Edit tournament handlers
  const handleEditTournament = (tournamentId: string) => {
    const tournament = tournamentControls.find(
      (t) => t.tournamentId === tournamentId
    );
    if (tournament) {
      // Check if tournament is in auto mode
      if (!tournament.isManualMode) {
        toast.error(
          "Cannot edit tournaments in auto mode. Switch to manual mode first."
        );
        return;
      }

      setEditingTournamentId(tournamentId);

      // Pre-populate form with existing data
      editSetValue("name", tournament.name);
      editSetValue("tier", String(tournament.tier));
      editSetValue(
        "scheduledStartDate",
        tournament.scheduledStartDate.toISOString().slice(0, 16)
      );
      editSetValue(
        "scheduledEndDate",
        tournament.scheduledEndDate.toISOString().slice(0, 16)
      );
      editSetValue("isManualMode", tournament.isManualMode);

      setIsEditDialogOpen(true);
    }
  };

  const onEditSubmit = async (data: EditTournamentForm) => {
    try {
      const startDate = new Date(data.scheduledStartDate);
      const endDate = new Date(data.scheduledEndDate);

      if (startDate >= endDate) {
        toast.error("End date must be after start date");
        return;
      }

      // Check if end date is at least one day after start date
      const minEndDate = new Date(startDate);
      minEndDate.setDate(minEndDate.getDate() + 1);

      if (endDate < minEndDate) {
        toast.error("Tournament must run for at least one day");
        return;
      }

      const tournament = tournamentControls.find(
        (t) => t.tournamentId === editingTournamentId
      );
      if (!tournament) {
        toast.error("Tournament not found");
        return;
      }

      // Double-check that tournament is still in manual mode
      if (!tournament.isManualMode) {
        toast.error("Cannot edit tournaments in auto mode");
        return;
      }

      const updatedTournament: Partial<TournamentControl> = {
        name: data.name,
        tier: parseInt(data.tier) as 1 | 2 | 3,
        scheduledStartDate: startDate,
        scheduledEndDate: endDate,
        isManualMode: data.isManualMode,
        lastModifiedBy: "admin",
      };

      // Update in database if tournament has $id
      if (tournament.$id) {
        await updateTournament(tournament.$id, updatedTournament);
      }

      // Update local state
      setTournamentControls((prev) =>
        prev.map((control) =>
          control.tournamentId === editingTournamentId
            ? { ...control, ...updatedTournament }
            : control
        )
      );

      setIsEditDialogOpen(false);
      setEditingTournamentId("");
      editReset();
      toast.success("Tournament updated successfully");
    } catch (error) {
      console.error("Failed to update tournament:", error);
      toast.error("Failed to update tournament");
    }
  };

  const handleStartTournament = async (tournamentId: string) => {
    try {
      // Update in database first
      const updatedTournament = await startTournament(tournamentId, "admin");

      if (updatedTournament) {
        // Update local state with the returned data
        setTournamentControls((prev) =>
          prev.map((control) =>
            control.tournamentId === tournamentId ? updatedTournament : control
          )
        );

        toast.success("Tournament started successfully");
      }
    } catch (error) {
      console.error("Failed to start tournament:", error);
      toast.error("Failed to start tournament");
    }
  };

  const handleEndTournament = async (tournamentId: string) => {
    try {
      // Update in database first
      const updatedTournament = await endTournament(tournamentId, "admin");

      if (updatedTournament) {
        // Update local state with the returned data
        setTournamentControls((prev) =>
          prev.map((control) =>
            control.tournamentId === tournamentId ? updatedTournament : control
          )
        );

        toast.success("Tournament ended successfully");
      }
    } catch (error) {
      console.error("Failed to end tournament:", error);
      toast.error("Failed to end tournament");
    }
  };

  // Handle bulk assignment
  const handleBulkAssignAwaitingUsers = async () => {
    setIsAssigning(true);
    try {
      const result = await bulkAssignAwaitingUsers();

      if (result.success > 0) {
        toast.success(
          `Successfully assigned ${result.success} users to tournaments`
        );

        // Refresh the data
        await fetchAppwriteData();
      }

      if (result.failed > 0) {
        toast.error(
          `Failed to assign ${result.failed} users. Check console for details.`
        );
        console.error("Assignment errors:", result.errors);
      }

      if (result.success === 0 && result.failed === 0) {
        toast.info("No awaiting users found to assign");
      }
    } catch (error) {
      console.error("Bulk assignment failed:", error);
      toast.error("Failed to assign users to tournaments");
    } finally {
      setIsAssigning(false);
    }
  };

  useEffect(() => {
    // Check authentication directly from localStorage
    if (!isAdminAuthenticated()) {
      router.push("/admin/login");
      return;
    }

    // Load dashboard data
    fetchAppwriteData();
  }, [router, fetchAppwriteData]);

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
        <TabsList className="flex gap-2 mb-4">
          <TabsTrigger className="border-2 border-gray-800/50" value="payments">
            Payment Logs
          </TabsTrigger>
          <TabsTrigger className="border-2 border-gray-800/50" value="users">
            Users
          </TabsTrigger>
          <TabsTrigger
            className="border-2 border-gray-800/50"
            value="tournaments"
          >
            Tournament Control
          </TabsTrigger>
          <TabsTrigger
            className="border-2 border-gray-800/50"
            value="assignments"
          >
            Tournament Assignments
          </TabsTrigger>
          <TabsTrigger
            className="border-2 border-gray-800/50"
            value="matchlogs"
          >
            Match Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payments">
          <Card className="border-2 border-gray-800/50">
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
                        key={log.$id || log.PaymentId || index}
                      >
                        <TableCell>{log.userId}</TableCell>
                        <TableCell>{log.username}</TableCell>
                        <TableCell>{log.PaymentId}</TableCell>
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
          <Card className="border-2 border-gray-800/50">
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

        <TabsContent value="tournaments">
          <Card className="border-2 border-gray-800/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Tournament Control Panel</CardTitle>
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-custompink hover:bg-custompink/90">
                    Create New Tournament
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-white text-black">
                  <DialogHeader>
                    <DialogTitle className="text-black">
                      Create New Tournament
                    </DialogTitle>
                    <p className="text-sm text-gray-600 mt-2">
                      End date will automatically be set to one week after start
                      date, but can be modified.
                    </p>
                  </DialogHeader>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <Label
                        htmlFor="tournament-name"
                        className="text-black font-medium"
                      >
                        Tournament Name *
                      </Label>
                      <Input
                        id="tournament-name"
                        placeholder="Enter tournament name"
                        {...register("name", {
                          required: "Tournament name is required",
                          minLength: {
                            value: 3,
                            message:
                              "Tournament name must be at least 3 characters",
                          },
                        })}
                        className="mt-1 bg-white text-black border-gray-300 placeholder:text-gray-500"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label
                        htmlFor="tournament-tier"
                        className="text-black font-medium"
                      >
                        Tier *
                      </Label>
                      <Controller
                        name="tier"
                        control={control}
                        rules={{ required: "Please select a tier" }}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="mt-1 bg-white text-black border-gray-300">
                              <SelectValue
                                placeholder="Select tier"
                                className="text-black"
                              />
                            </SelectTrigger>
                            <SelectContent className="bg-white text-black border-gray-300">
                              <SelectItem
                                value="1"
                                className="text-black hover:bg-gray-100"
                              >
                                Tier 1
                              </SelectItem>
                              <SelectItem
                                value="2"
                                className="text-black hover:bg-gray-100"
                              >
                                Tier 2
                              </SelectItem>
                              <SelectItem
                                value="3"
                                className="text-black hover:bg-gray-100"
                              >
                                Tier 3
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.tier && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.tier.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label
                        htmlFor="start-date"
                        className="text-black font-medium"
                      >
                        Start Date *
                      </Label>
                      <Input
                        id="start-date"
                        type="datetime-local"
                        {...register("scheduledStartDate", {
                          required: "Start date is required",
                        })}
                        className="mt-1 bg-white text-black border-gray-300"
                      />
                      {errors.scheduledStartDate && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.scheduledStartDate.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label
                        htmlFor="end-date"
                        className="text-black font-medium"
                      >
                        End Date * (Auto-set to 1 week after start date)
                      </Label>
                      <Input
                        id="end-date"
                        type="datetime-local"
                        {...register("scheduledEndDate", {
                          required: "End date is required",
                        })}
                        className="mt-1 bg-white text-black border-gray-300"
                      />
                      {errors.scheduledEndDate && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.scheduledEndDate.message}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        You can still modify the end date if needed
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Controller
                        name="isManualMode"
                        control={control}
                        render={({ field }) => (
                          <Switch
                            id="manual-mode"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label
                        htmlFor="manual-mode"
                        className="text-black font-medium"
                      >
                        Manual Control Mode
                      </Label>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsCreateDialogOpen(false);
                          reset();
                        }}
                        className="text-black border-gray-300 hover:bg-gray-100"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-custompink hover:bg-custompink/90 text-white"
                      >
                        Create Tournament
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-b-4 border-gray-800">
                    <TableHead>Tournament ID</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tournamentControls.map((control) => (
                    <TableRow
                      key={control.tournamentId}
                      className="border-b border-gray-800/50"
                    >
                      <TableCell className="font-medium">
                        {control.tournamentId}
                      </TableCell>
                      <TableCell>{control.tier}</TableCell>
                      <TableCell>
                        {control.scheduledStartDate.toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {control.scheduledEndDate.toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            control.status === "active"
                              ? "bg-green-600 hover:bg-green-700"
                              : control.status === "ended"
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-yellow-600 hover:bg-yellow-700"
                          }`}
                        >
                          {control.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={control.isManualMode ? "default" : "outline"}
                        >
                          {control.isManualMode ? "Manual" : "Auto"}
                        </Badge>
                      </TableCell>
                      <TableCell className="space-x-1">
                        <Button
                          size="sm"
                          onClick={() =>
                            handleStartTournament(control.tournamentId)
                          }
                          disabled={
                            !control.isManualMode ||
                            control.status === "active" ||
                            control.status === "ended"
                          }
                          className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Start Now
                        </Button>
                        <Button
                          size="sm"
                          onClick={() =>
                            handleEndTournament(control.tournamentId)
                          }
                          disabled={
                            !control.isManualMode || control.status !== "active"
                          }
                          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Stop Now
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleEditTournament(control.tournamentId)
                          }
                          disabled={
                            control.status !== "scheduled" ||
                            !control.isManualMode
                          }
                          className={`${
                            !control.isManualMode
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-gray-100"
                          }`}
                          title={
                            !control.isManualMode
                              ? "Cannot edit tournaments in auto mode"
                              : control.status !== "scheduled"
                              ? "Can only edit scheduled tournaments"
                              : "Edit tournament"
                          }
                        >
                          ✎
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Edit Tournament Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-md bg-white text-black">
              <DialogHeader>
                <DialogTitle className="text-black">
                  Edit Tournament
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-2">
                  End date will auto-update when you change the start date, but
                  can be modified.
                </p>
              </DialogHeader>
              <form
                onSubmit={editHandleSubmit(onEditSubmit)}
                className="space-y-4"
              >
                <div>
                  <Label
                    htmlFor="edit-tournament-name"
                    className="text-black font-medium"
                  >
                    Tournament Name *
                  </Label>
                  <Input
                    id="edit-tournament-name"
                    placeholder="Enter tournament name"
                    {...editRegister("name", {
                      required: "Tournament name is required",
                      minLength: {
                        value: 3,
                        message:
                          "Tournament name must be at least 3 characters",
                      },
                    })}
                    className="mt-1 bg-white text-black border-gray-300 placeholder:text-gray-500"
                  />
                  {editErrors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {editErrors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="edit-tournament-tier"
                    className="text-black font-medium"
                  >
                    Tier *
                  </Label>
                  <Controller
                    name="tier"
                    control={editControl}
                    rules={{ required: "Please select a tier" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="mt-1 bg-white text-black border-gray-300">
                          <SelectValue
                            placeholder="Select tier"
                            className="text-black"
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-black border-gray-300">
                          <SelectItem
                            value="1"
                            className="text-black hover:bg-gray-100"
                          >
                            Tier 1
                          </SelectItem>
                          <SelectItem
                            value="2"
                            className="text-black hover:bg-gray-100"
                          >
                            Tier 2
                          </SelectItem>
                          <SelectItem
                            value="3"
                            className="text-black hover:bg-gray-100"
                          >
                            Tier 3
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {editErrors.tier && (
                    <p className="text-red-500 text-sm mt-1">
                      {editErrors.tier.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="edit-start-date"
                    className="text-black font-medium"
                  >
                    Start Date *
                  </Label>
                  <Input
                    id="edit-start-date"
                    type="datetime-local"
                    {...editRegister("scheduledStartDate", {
                      required: "Start date is required",
                    })}
                    className="mt-1 bg-white text-black border-gray-300"
                  />
                  {editErrors.scheduledStartDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {editErrors.scheduledStartDate.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="edit-end-date"
                    className="text-black font-medium"
                  >
                    End Date * (Auto-updated)
                  </Label>
                  <Input
                    id="edit-end-date"
                    type="datetime-local"
                    {...editRegister("scheduledEndDate", {
                      required: "End date is required",
                    })}
                    className="mt-1 bg-white text-black border-gray-300"
                  />
                  {editErrors.scheduledEndDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {editErrors.scheduledEndDate.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    End date auto-updates to 1 week after start date, but you
                    can modify it
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Controller
                    name="isManualMode"
                    control={editControl}
                    render={({ field }) => (
                      <Switch
                        id="edit-manual-mode"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label
                    htmlFor="edit-manual-mode"
                    className="text-black font-medium"
                  >
                    Manual Control Mode
                  </Label>
                </div>

                {/* Warning message for mode switching */}
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                  <p className="text-yellow-800 text-sm">
                    <strong>Note:</strong> Switching to auto mode will prevent
                    further editing of this tournament.
                  </p>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditDialogOpen(false);
                      setEditingTournamentId("");
                      editReset();
                    }}
                    className="text-black border-gray-300 hover:bg-gray-100"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-custompink hover:bg-custompink/90 text-white"
                  >
                    Update Tournament
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="assignments">
          <Card className="border-2 border-gray-800/50">
            <CardHeader>
              <CardTitle>Tournament Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="active" className="w-full">
                <TabsList className="flex gap-2 mb-4">
                  <TabsTrigger value="active">
                    Active ({activeAssignments.length})
                  </TabsTrigger>
                  <TabsTrigger value="awaiting">
                    Awaiting ({awaitingAssignments.length})
                  </TabsTrigger>
                  <TabsTrigger value="completed">
                    Completed ({completedAssignments.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="active">
                  <Card>
                    <CardHeader>
                      <CardTitle>Active Tournament Assignments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow className="border-b-4 border-gray-800">
                            <TableHead>User ID</TableHead>
                            <TableHead>Tournament ID</TableHead>
                            <TableHead>Tier</TableHead>
                            <TableHead>Payment ID</TableHead>
                            <TableHead>Assigned At</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {activeAssignments.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={6}
                                className="text-center py-4"
                              >
                                No active assignments found
                              </TableCell>
                            </TableRow>
                          ) : (
                            activeAssignments.map((assignment, index) => (
                              <TableRow
                                className="border-b border-gray-800/50"
                                key={assignment.$id || index}
                              >
                                <TableCell>{assignment.userId}</TableCell>
                                <TableCell>
                                  {assignment.tournamentId || "N/A"}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">
                                    Tier {assignment.tier}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {assignment.PaymentId || "N/A"}
                                </TableCell>
                                <TableCell>
                                  {new Date(
                                    assignment.assignedAt
                                  ).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                  <Badge className="bg-green-600 hover:bg-green-700">
                                    {assignment.AccessStatus}
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

                <TabsContent value="awaiting">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Awaiting Tournament Assignments</CardTitle>
                      <Button
                        onClick={handleBulkAssignAwaitingUsers}
                        disabled={
                          isAssigning || awaitingAssignments.length === 0
                        }
                        className="bg-custompink hover:bg-custompink/90"
                      >
                        {isAssigning ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            Assigning...
                          </>
                        ) : (
                          `Assign All to Tournaments (${awaitingAssignments.length})`
                        )}
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow className="border-b-4 border-gray-800">
                            <TableHead>User ID</TableHead>
                            <TableHead>Tier</TableHead>
                            <TableHead>Payment ID</TableHead>
                            <TableHead>Assigned At</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {awaitingAssignments.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={5}
                                className="text-center py-4"
                              >
                                No awaiting assignments found
                              </TableCell>
                            </TableRow>
                          ) : (
                            awaitingAssignments.map((assignment, index) => (
                              <TableRow
                                className="border-b border-gray-800/50"
                                key={assignment.$id || index}
                              >
                                <TableCell>{assignment.userId}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">
                                    Tier {assignment.tier}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {assignment.PaymentId || "N/A"}
                                </TableCell>
                                <TableCell>
                                  {new Date(
                                    assignment.assignedAt
                                  ).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                  <Badge className="bg-yellow-600 hover:bg-yellow-700">
                                    {assignment.AccessStatus}
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

                <TabsContent value="completed">
                  <Card>
                    <CardHeader>
                      <CardTitle>Completed Tournament Assignments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow className="border-b-4 border-gray-800">
                            <TableHead>User ID</TableHead>
                            <TableHead>Tournament ID</TableHead>
                            <TableHead>Tier</TableHead>
                            <TableHead>Payment ID</TableHead>
                            <TableHead>Assigned At</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {completedAssignments.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={6}
                                className="text-center py-4"
                              >
                                No completed assignments found
                              </TableCell>
                            </TableRow>
                          ) : (
                            completedAssignments.map((assignment, index) => (
                              <TableRow
                                className="border-b border-gray-800/50"
                                key={assignment.$id || index}
                              >
                                <TableCell>{assignment.userId}</TableCell>
                                <TableCell>
                                  {assignment.tournamentId || "N/A"}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">
                                    Tier {assignment.tier}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {assignment.PaymentId || "N/A"}
                                </TableCell>
                                <TableCell>
                                  {new Date(
                                    assignment.assignedAt
                                  ).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                  <Badge className="bg-gray-600 hover:bg-gray-700">
                                    {assignment.AccessStatus}
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matchlogs">
          <Card className="border-2 border-gray-800/50">
            <CardHeader>
              <CardTitle>Match Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b-4 border-gray-800">
                        <TableHead>Match ID</TableHead>
                        <TableHead>Created At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {matchLogs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center py-4">
                            No match logs found
                          </TableCell>
                        </TableRow>
                      ) : (
                        matchLogs.map((log) => (
                          <TableRow
                            key={log.$id || log.Match_ID}
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() => setSelectedMatchLog(log)}
                          >
                            <TableCell>{log.Match_ID}</TableCell>
                            <TableCell>
                              {log.createdAt
                                ? new Date(log.createdAt).toLocaleString()
                                : "-"}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="w-full md:w-1/2">
                  {selectedMatchLog ? (
                    <div className="p-4 border rounded bg-gray-50">
                      <h3 className="font-bold mb-2">Match Log Details</h3>
                      <div>
                        <strong>Match ID:</strong> {selectedMatchLog.Match_ID}
                      </div>
                      <div>
                        <strong>Created At:</strong>{" "}
                        {selectedMatchLog.createdAt
                          ? new Date(
                              selectedMatchLog.createdAt
                            ).toLocaleString()
                          : "-"}
                      </div>
                      <div className="mt-2">
                        <strong>Logs:</strong>
                        <pre className="bg-gray-200 p-2 rounded mt-1 overflow-x-auto text-xs">
                          {selectedMatchLog.Logs}
                        </pre>
                      </div>
                      <Button
                        className="mt-4"
                        variant="outline"
                        onClick={() => setSelectedMatchLog(null)}
                      >
                        Close
                      </Button>
                    </div>
                  ) : (
                    <div className="p-4 text-gray-500">
                      Click a match log to view details.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
