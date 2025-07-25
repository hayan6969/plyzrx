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
  MatchAssignment,
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
  getAllMatchAssignments,
  createMatchAssignment,
  createAutomaticMatches,
  getActiveUsersByTier,
  updateMatchAssignment,
} from "@/lib/appwriteDB";
import { useForm, Controller } from "react-hook-form";
import Link from "next/link";

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

// Add interface for manual match creation form
interface ManualMatchForm {
  tier: string;
  player1Id: string;
  player2Id: string;
}

// Payout Details Interfaces
interface PayoutDetails {
  userId: string;
  amount: number;
  rank: number;
  score: number;
}

interface PayoutModalData {
  tournamentId: string;
  tournamentName: string;
  tier: number;
  totalPayout: number;
  payouts: PayoutDetails[];
  usersWithScores: number;
  usersWithoutScores: number;
  earningRecords: number;
  errors: string[];
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
  console.log(tournamentAssignments);
  
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
  const [matchAssignments, setMatchAssignments] = useState<MatchAssignment[]>([]);
  const [isCreatingMatches, setIsCreatingMatches] = useState(false);
  const [isManualMatchDialogOpen, setIsManualMatchDialogOpen] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<{
    [key: string]: TournamentAssignment[];
  }>({
    "1": [],
    "2": [],
    "3": [],
  });
  const [isDistributingPayouts, setIsDistributingPayouts] = useState(false);

  // New state for payout modal
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutModalData, setPayoutModalData] = useState<PayoutModalData | null>(null);

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

  // React Hook Form for manual match creation
  const {
    handleSubmit: matchHandleSubmit,
    control: matchControl,
    reset: matchReset,
    watch: matchWatch,
    formState: { errors: matchErrors },
  } = useForm<ManualMatchForm>({
    defaultValues: {
      tier: "1",
      player1Id: "",
      player2Id: "",
    },
  });

  // Watch for start date changes in create form
  const watchStartDate = watch("scheduledStartDate");
  const watchEditStartDate = editWatch("scheduledStartDate");
  const watchTier = matchWatch("tier");

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
 
    ];

    setTournamentControls(mockTournaments);
  };

  const fetchAppwriteData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const fetchMockPaymentLogs = () => {
      // Mock payment logs data
      const mockPaymentLogs: PaymentLog[] = [
      ];

      setPaymentLogs(mockPaymentLogs);
    };

    const fetchMockUserTiers = () => {
      // Mock users data
      const mockUsers: UserTier[] = [
      
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

      // Fetch match assignments
      const matches = await getAllMatchAssignments();
      setMatchAssignments(matches);

      // Fetch available users for each tier
      const tier1Users = await getActiveUsersByTier("1");
      const tier2Users = await getActiveUsersByTier("2");
      const tier3Users = await getActiveUsersByTier("3");

      setAvailableUsers({
        "1": tier1Users,
        "2": tier2Users,
        "3": tier3Users,
      });
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

      // Helper function to convert UTC date to local datetime-local format
      const convertToLocalDateTime = (date: Date): string => {
        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return localDate.toISOString().slice(0, 16);
      };

      // Pre-populate form with existing data (converted to local time)
      editSetValue("name", tournament.name);
      editSetValue("tier", String(tournament.tier));
      editSetValue(
        "scheduledStartDate",
        convertToLocalDateTime(tournament.scheduledStartDate)
      );
      editSetValue(
        "scheduledEndDate",
        convertToLocalDateTime(tournament.scheduledEndDate)
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
      // Check if the error is about an active tournament
      const errorMessage = error instanceof Error ? error.message : "Failed to start tournament";
      if (errorMessage.includes("already an active")) {
        toast.error(errorMessage);
      } else {
        toast.error("Failed to start tournament");
      }
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

  // Handle automatic match creation
  const handleCreateAutomaticMatches = async (tier: "1" | "2" | "3") => {
    setIsCreatingMatches(true);
    try {
      const result = await createAutomaticMatches(tier);

      if (result.success > 0) {
        toast.success(`Successfully created ${result.success} matches for Tier ${tier}`);

        // Update local state
        setMatchAssignments((prev) => [...prev, ...result.matches]);

        // Refresh data to get updated user availability
        await fetchAppwriteData();
      }

      if (result.failed > 0) {
        toast.error(`Failed to create ${result.failed} matches. Check console for details.`);
        console.error("Match creation errors:", result.errors);
      }

      if (result.errors.length > 0) {
        result.errors.forEach((error) => {
          if (error.includes("bye") || error.includes("Not enough")) {
            toast.info(error);
          }
        });
      }

      if (result.success === 0 && result.failed === 0) {
        toast.info(`No matches could be created for Tier ${tier}`);
      }
    } catch (error) {
      console.error("Automatic match creation failed:", error);
      toast.error("Failed to create automatic matches");
    } finally {
      setIsCreatingMatches(false);
    }
  };

  // Handle manual match creation
  const onManualMatchSubmit = async (data: ManualMatchForm) => {
    try {
      if (data.player1Id === data.player2Id) {
        toast.error("Cannot create a match between the same player");
        return;
      }

      // Find tournament assignment for player1 (or player2)
      const player1Assignment = availableUsers[data.tier].find(
        (u) => u.userId === data.player1Id
      );
      const tournamentid = player1Assignment?.tournamentId || "";

      const matchData: MatchAssignment = {
        player1Id: data.player1Id,
        player2Id: data.player2Id,
        WinnerId: "",
        WinnerScore: "",
        tournamentid, // <-- add tournament id
        StartedAt: new Date().toISOString(), // <-- add startedAt
      };

      const createdMatch = await createMatchAssignment(matchData);

      // Update local state
      setMatchAssignments((prev) => [...prev, createdMatch]);

      // Reset form and close dialog
      matchReset();
      setIsManualMatchDialogOpen(false);

      toast.success("Manual match created successfully");

      // Refresh data
      await fetchAppwriteData();
    } catch (error) {
      console.error("Failed to create manual match:", error);
      toast.error("Failed to create manual match");
    }
  };

  // Handle match result update
  const handleUpdateMatchResult = async (
    matchId: string,
    winnerId: string,
    winnerScore: string
  ) => {
    try {
      await updateMatchAssignment(matchId, {
        WinnerId: winnerId,
        WinnerScore: winnerScore,
      });

      // Update local state
      setMatchAssignments((prev) =>
        prev.map((match) =>
          match.$id === matchId
            ? { ...match, WinnerId: winnerId, WinnerScore: winnerScore }
            : match
        )
      );

      toast.success("Match result updated successfully");
    } catch (error) {
      console.error("Failed to update match result:", error);
      toast.error("Failed to update match result");
    }
  };

  // Distribute tournament payouts
  const handleDistributePayouts = async (tournamentId: string) => {
    setIsDistributingPayouts(true);
    try {
      const response = await fetch('/api/leaderboard/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        const processedTournament = result.data.processedTournaments?.find(
          (t: any) => t.tournamentId === tournamentId
        );

        if (processedTournament) {
          const payoutResult = processedTournament.payoutResult;
          const tournament = tournamentControls.find(t => t.tournamentId === tournamentId);
          
          // Set modal data
          setPayoutModalData({
            tournamentId,
            tournamentName: tournament?.name || 'Unknown Tournament',
            tier: tournament?.tier || 1,
            totalPayout: payoutResult.totalPayout,
            payouts: payoutResult.payouts,
            usersWithScores: payoutResult.usersWithScores || 0,
            usersWithoutScores: payoutResult.usersWithoutScores || 0,
            earningRecords: payoutResult.earningRecords,
            errors: payoutResult.errors || []
          });
          
          setShowPayoutModal(true);
          
          if (payoutResult.success > 0) {
            toast.success(
              `Successfully distributed payouts to ${payoutResult.success} players. Total: $${payoutResult.totalPayout.toLocaleString()}`
            );
          } else {
            toast.info("No eligible players found for payout distribution");
          }

          if (payoutResult.failed > 0) {
            toast.error(
              `Failed to distribute payouts to ${payoutResult.failed} players. Check console for details.`
            );
            console.error("Payout errors:", payoutResult.errors);
          }
        } else {
          toast.info(`Tournament ${tournamentId} was not processed. It may not have ended yet or already been processed.`);
        }

        await fetchAppwriteData();
      } else {
        throw new Error(result.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error("Payout distribution failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to distribute payouts";
      toast.error(`Failed to distribute payouts: ${errorMessage}`);
    } finally {
      setIsDistributingPayouts(false);
    }
  };

  // Payout Modal Component
  const PayoutModal = () => {
    if (!payoutModalData) return null;

    return (
      <Dialog open={showPayoutModal} onOpenChange={setShowPayoutModal}>
        <DialogContent className="max-w-4xl bg-white text-black max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Payout Distribution Results
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Tournament Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Tournament Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Tournament ID:</strong> {payoutModalData.tournamentId}</div>
                <div><strong>Name:</strong> {payoutModalData.tournamentName}</div>
                <div><strong>Tier:</strong> {payoutModalData.tier}</div>
                <div><strong>Total Payout:</strong> ${payoutModalData.totalPayout.toLocaleString()}</div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{payoutModalData.usersWithScores}</div>
                <div className="text-sm text-gray-600">Users with Scores</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-600">{payoutModalData.usersWithoutScores}</div>
                <div className="text-sm text-gray-600">Users without Scores</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{payoutModalData.payouts.length}</div>
                <div className="text-sm text-gray-600">Paid Users</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">{payoutModalData.earningRecords}</div>
                <div className="text-sm text-gray-600">Earning Records</div>
              </div>
            </div>

            {/* Payout Details Table */}
            {payoutModalData.payouts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Payout Details</h3>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Rank</TableHead>
                        <TableHead>User ID</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Payout Amount</TableHead>
                        <TableHead>Category</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payoutModalData.payouts.map((payout, index) => (
                        <TableRow key={index} className="hover:bg-gray-50">
                          <TableCell className="font-medium">#{payout.rank}</TableCell>
                          <TableCell className="font-mono">{payout.userId}</TableCell>
                          <TableCell>{payout.score.toLocaleString()}</TableCell>
                          <TableCell className="font-bold text-green-600">
                            ${payout.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={payout.rank <= 10 ? "bg-yellow-500" : "bg-blue-500"}
                            >
                              {payout.rank <= 10 ? "Top 10" : "Top 100"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Errors Section */}
            {payoutModalData.errors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-red-600">Errors</h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <ul className="space-y-1">
                    {payoutModalData.errors.map((error, index) => (
                      <li key={index} className="text-sm text-red-700">
                        • {error}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              onClick={() => setShowPayoutModal(false)}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Fetch data and check auth on mount
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
            value="matches"
          >
            Matches
          </TabsTrigger>
          <TabsTrigger
            className="border-2 border-gray-800/50"
            value="matchlogs"
          >
            Match Logs
          </TabsTrigger>
             <Link
            className="border-2 border-gray-800/50 px-2 rounded-md py-1"
            href="/admin/report"
          >
            Report
          </Link>

    <Link
            className="border-2 border-gray-800/50 px-2 rounded-md py-1"
            href="/admin/rewards"
          >
            Rewards
          </Link>

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
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleDistributePayouts(control.tournamentId)
                          }
                          disabled={
                            control.status !== "ended" ||
                            isDistributingPayouts
                          }
                          className={`${
                            control.status !== "ended"
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-gray-100"
                          }`}
                          title={
                            control.status !== "ended"
                              ? "Payouts can only be distributed for ended tournaments"
                              : "Distribute Payouts"
                          }
                        >
                          {isDistributingPayouts ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-custompink"></div>
                          ) : (
                            "💰"
                          )}
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

        <TabsContent value="matches">
          <Card className="border-2 border-gray-800/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Match Management</CardTitle>
              <div className="flex gap-2">
                <Dialog
                  open={isManualMatchDialogOpen}
                  onOpenChange={setIsManualMatchDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline">Create Manual Match</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-white text-black">
                    <DialogHeader>
                      <DialogTitle className="text-black">
                        Create Manual Match
                      </DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={matchHandleSubmit(onManualMatchSubmit)}
                      className="space-y-4"
                    >
                      <div>
                        <Label
                          htmlFor="match-tier"
                          className="text-black font-medium"
                        >
                          Tier *
                        </Label>
                        <Controller
                          name="tier"
                          control={matchControl}
                          rules={{ required: "Please select a tier" }}
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="mt-1 bg-white text-black border-gray-300">
                                <SelectValue placeholder="Select tier" />
                              </SelectTrigger>
                              <SelectContent className="bg-white text-black border-gray-300">
                                <SelectItem value="1">
                                  Tier 1 ({availableUsers["1"].length} users)
                                </SelectItem>
                                <SelectItem value="2">
                                  Tier 2 ({availableUsers["2"].length} users)
                                </SelectItem>
                                <SelectItem value="3">
                                  Tier 3 ({availableUsers["3"].length} users)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {matchErrors.tier && (
                          <p className="text-red-500 text-sm mt-1">
                            {matchErrors.tier.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label
                          htmlFor="player1"
                          className="text-black font-medium"
                        >
                          Player 1 *
                        </Label>
                        <Controller
                          name="player1Id"
                          control={matchControl}
                          rules={{ required: "Please select Player 1" }}
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="mt-1 bg-white text-black border-gray-300">
                                <SelectValue placeholder="Select Player 1" />
                              </SelectTrigger>
                              <SelectContent className="bg-white text-black border-gray-300">
                                {availableUsers[watchTier as "1" | "2" | "3"]?.map(
                                  (user) => (
                                    <SelectItem key={user.userId} value={user.userId}>
                                      {user.userId}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {matchErrors.player1Id && (
                          <p className="text-red-500 text-sm mt-1">
                            {matchErrors.player1Id.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label
                          htmlFor="player2"
                          className="text-black font-medium"
                        >
                          Player 2 *
                        </Label>
                        <Controller
                          name="player2Id"
                          control={matchControl}
                          rules={{ required: "Please select Player 2" }}
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="mt-1 bg-white text-black border-gray-300">
                                <SelectValue placeholder="Select Player 2" />
                              </SelectTrigger>
                              <SelectContent className="bg-white text-black border-gray-300">
                                {availableUsers[watchTier as "1" | "2" | "3"]?.map(
                                  (user) => (
                                    <SelectItem key={user.userId} value={user.userId}>
                                      {user.userId}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {matchErrors.player2Id && (
                          <p className="text-red-500 text-sm mt-1">
                            {matchErrors.player2Id.message}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-end space-x-2 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsManualMatchDialogOpen(false);
                            matchReset();
                          }}
                          className="text-black border-gray-300 hover:bg-gray-100"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="bg-custompink hover:bg-custompink/90 text-white"
                        >
                          Create Match
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  Create Automatic Matches
                </h3>
                <div className="flex gap-4">
                  <Button
                    onClick={() => handleCreateAutomaticMatches("1")}
                    disabled={isCreatingMatches || availableUsers["1"].length < 2}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isCreatingMatches ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      `Auto Create Tier 1 Matches (${
                        Math.floor(availableUsers["1"].length / 2)
                      } possible)`
                    )}
                  </Button>
                  <Button
                    onClick={() => handleCreateAutomaticMatches("2")}
                    disabled={isCreatingMatches || availableUsers["2"].length < 2}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isCreatingMatches ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      `Auto Create Tier 2 Matches (${
                        Math.floor(availableUsers["2"].length / 2)
                      } possible)`
                    )}
                  </Button>
                  <Button
                    onClick={() => handleCreateAutomaticMatches("3")}
                    disabled={isCreatingMatches || availableUsers["3"].length < 2}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isCreatingMatches ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      `Auto Create Tier 3 Matches (${
                        Math.floor(availableUsers["3"].length / 2)
                      } possible)`
                    )}
                  </Button>
                </div>
              </div>

              <Table>
                <TableCaption>List of all matches</TableCaption>
                <TableHeader>
                  <TableRow className="border-b-4 border-gray-800">
                    <TableHead>Match ID</TableHead>
                    <TableHead>Player 1</TableHead>
                    <TableHead>Player 2</TableHead>
                    <TableHead>Winner</TableHead>
                    <TableHead>Winner Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matchAssignments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No matches found
                      </TableCell>
                    </TableRow>
                  ) : (
                    matchAssignments.map((match, index) => (
                      <TableRow
                        className="border-b border-gray-800/50"
                        key={match.$id || index}
                      >
                        <TableCell>
                          {match.$id}
                        </TableCell>
                        <TableCell>{match.player1Id}</TableCell>
                        <TableCell>{match.player2Id}</TableCell>
                        <TableCell>{match.WinnerId || "TBD"}</TableCell>
                        <TableCell>{match.WinnerScore || "TBD"}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              match.WinnerId
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-yellow-600 hover:bg-yellow-700"
                            }
                          >
                            {match.WinnerId ? "Completed" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {!match.WinnerId && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => {
                                  const score = prompt("Enter winner score:");
                                  if (score) {
                                    handleUpdateMatchResult(match.$id!, match.player1Id, score);
                                  }
                                }}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                P1 Wins
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => {
                                  const score = prompt("Enter winner score:");
                                  if (score) {
                                    handleUpdateMatchResult(match.$id!, match.player2Id, score);
                                  }
                                }}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                P2 Wins
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
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

      {/* Add the PayoutModal component */}
      <PayoutModal />
    </div>
  );
}
