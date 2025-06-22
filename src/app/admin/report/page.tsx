'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getAllReports, 
  updateReportStatus, 
  Report, 
  createBanUser, 
  isUserBanned,
  getAllBannedUsers,
  unbanUser,
  BanUser
} from '@/lib/appwriteDB';
import { 
  getAllUsers, 
  UserWithStats, 
  getAllPaymentRequests, 
  updatePaymentStatus, 
  PaymentRequest 
} from '@/lib/userdataappwrite.db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  AlertTriangle, 
  Eye, 
  Ban, 
  Clock, 
  CheckCircle, 
  UserX, 
  Shield, 
  Users, 
  Trophy,
  Target,
  Calendar,
  DollarSign,
  CreditCard,
  XCircle,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminReportPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [bannedUsers, setBannedUsers] = useState<BanUser[]>([]);
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [bannedUsersLoading, setBannedUsersLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserWithStats | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [banningUser, setBanningUser] = useState<string | null>(null);
  const [unbanning, setUnbanning] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);
  const [showBanConfirm, setShowBanConfirm] = useState(false);
  const [showUnbanConfirm, setShowUnbanConfirm] = useState(false);
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);
  const [userToBan, setUserToBan] = useState<string>('');
  const [userToUnban, setUserToUnban] = useState<BanUser | null>(null);
  const [paymentToProcess, setPaymentToProcess] = useState<PaymentRequest | null>(null);
  const [paymentAction, setPaymentAction] = useState<'completed' | 'rejected'>('completed');
  const [activeTab, setActiveTab] = useState('reports');

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    if (activeTab === 'banned-users') {
      fetchBannedUsers();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'payments') {
      fetchPayments();
    }
  }, [activeTab]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const fetchedReports = await getAllReports();
      setReports(fetchedReports);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      toast.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const fetchBannedUsers = async () => {
    try {
      setBannedUsersLoading(true);
      const bannedUsersData = await getAllBannedUsers();
      setBannedUsers(bannedUsersData);
    } catch (error) {
      console.error('Failed to fetch banned users:', error);
      toast.error('Failed to fetch banned users');
    } finally {
      setBannedUsersLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const usersData = await getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      setPaymentsLoading(true);
      const paymentsData = await getAllPaymentRequests();
      setPayments(paymentsData);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
      toast.error('Failed to fetch payments');
    } finally {
      setPaymentsLoading(false);
    }
  };

  const handleStatusUpdate = async (reportId: string, newStatus: string) => {
    try {
      console.log('Updating status for report:', reportId, 'to:', newStatus);
      await updateReportStatus(reportId, newStatus);
      toast.success('Report status updated successfully');
      await fetchReports(); // Refresh the list
    } catch (error) {
      console.error('Failed to update report status:', error);
      toast.error('Failed to update report status');
    }
  };

  const handlePaymentStatusUpdate = async (paymentId: string, newStatus: 'completed' | 'rejected') => {
    try {
      setProcessingPayment(paymentId);
      await updatePaymentStatus(paymentId, newStatus);
      toast.success(`Payment ${newStatus} successfully`);
      await fetchPayments(); // Refresh the list
      setShowPaymentConfirm(false);
      setPaymentToProcess(null);
    } catch (error) {
      console.error('Failed to update payment status:', error);
      toast.error('Failed to update payment status');
    } finally {
      setProcessingPayment(null);
    }
  };

  const handleBanUser = async (userId: string) => {
    try {
      setBanningUser(userId);
      
      // Check if user is already banned
      const alreadyBanned = await isUserBanned(userId);
      if (alreadyBanned) {
        toast.error('User is already banned');
        return;
      }

      await createBanUser(userId);
      toast.success('User has been banned successfully');
      setShowBanConfirm(false);
      setUserToBan('');
      
      // Refresh banned users if that tab is active
      if (activeTab === 'banned-users') {
        fetchBannedUsers();
      }
    } catch (error) {
      console.error('Failed to ban user:', error);
      toast.error('Failed to ban user');
    } finally {
      setBanningUser(null);
    }
  };

  const handleUnbanUser = async (banUser: BanUser) => {
    try {
      setUnbanning(banUser.$id as string);
      
      await unbanUser(banUser.$id as string);
      toast.success('User has been unbanned successfully');
      
      // Refresh the list
      await fetchBannedUsers();
      
      setShowUnbanConfirm(false);
      setUserToUnban(null);
    } catch (error) {
      console.error('Failed to unban user:', error);
      toast.error('Failed to unban user');
    } finally {
      setUnbanning(null);
    }
  };

  // Helper function to normalize status strings - only pending and completed
  const normalizeStatus = (status: string | null | undefined): string => {
    if (!status) return 'pending';
    const normalized = status.toLowerCase().trim();
    
    // Handle variations in status naming - only two statuses
    switch (normalized) {
      case 'completed':
      case 'resolved':
      case 'done':
      case 'finished':
        return 'completed';
      case 'pending':
      case 'waiting':
      case 'open':
      default:
        return 'pending';
    }
  };

  const getStatusBadge = (status: string | null | undefined) => {
    const normalizedStatus = normalizeStatus(status);
    
    switch (normalizedStatus) {
      case 'pending':
        return <Badge variant="secondary" className="flex items-center gap-1 bg-yellow-100 text-yellow-800 border-yellow-200">
          <Clock className="w-3 h-3" />
          Pending
        </Badge>;
      case 'completed':
        return <Badge variant="default" className="flex items-center gap-1 bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3" />
          Completed
        </Badge>;
      default:
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200">
          {status || 'Pending'}
        </Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Badge variant="secondary" className="flex items-center gap-1 bg-yellow-100 text-yellow-800 border-yellow-200">
          <Clock className="w-3 h-3" />
          Pending
        </Badge>;
      case 'completed':
        return <Badge variant="default" className="flex items-center gap-1 bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3" />
          Completed
        </Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="flex items-center gap-1 bg-red-100 text-red-800 border-red-200">
          <XCircle className="w-3 h-3" />
          Rejected
        </Badge>;
      default:
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200">
          {status}
        </Badge>;
    }
  };

  const filteredReports = reports.filter(report => {
    if (statusFilter === 'all') return true;
    const reportStatus = normalizeStatus(report.Status as string);
    return reportStatus === statusFilter;
  });

  const filteredPayments = payments.filter(payment => {
    if (paymentFilter === 'all') return true;
    return payment.Status === paymentFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Helper function to get status counts with normalized status
  const getStatusCount = (status: string) => {
    return reports.filter(r => normalizeStatus(r.Status as string) === status).length;
  };

  const getPaymentStatusCount = (status: string) => {
    return payments.filter(p => p.Status === status).length;
  };

  // Helper function to get tier badges for users - FIXED STYLING
  const getTierBadges = (user: UserWithStats) => {
    const badges = [];
    if (user.tier1) badges.push(
      <Badge key="tier1" className="bg-amber-600 text-white hover:bg-amber-700 border-amber-600">
        Tier 1
      </Badge>
    );
    if (user.tier2) badges.push(
      <Badge key="tier2" className="bg-gray-600 text-white hover:bg-gray-700 border-gray-600">
        Tier 2
      </Badge>
    );
    if (user.tier3) badges.push(
      <Badge key="tier3" className="bg-yellow-600 text-white hover:bg-yellow-700 border-yellow-600">
        Tier 3
      </Badge>
    );
    return badges.length > 0 ? badges : [
      <Badge key="none" variant="outline" className="border-gray-300 text-gray-700">
        No Tiers
      </Badge>
    ];
  };

  if (loading && activeTab === 'reports') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg text-gray-700">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => router.push('/admin')}
              variant="outline" 
              className="border-gray-300 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Button>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h1 className="text-3xl font-bold text-gray-900">Admin Management</h1>
            </div>
          </div>
          <Button 
            onClick={() => {
              if (activeTab === 'reports') fetchReports();
              else if (activeTab === 'banned-users') fetchBannedUsers();
              else if (activeTab === 'users') fetchUsers();
              else if (activeTab === 'payments') fetchPayments();
            }} 
            variant="outline" 
            className="border-gray-300"
          >
            Refresh
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Reports ({reports.length})
            </TabsTrigger>
            <TabsTrigger value="banned-users" className="flex items-center gap-2">
              <Ban className="w-4 h-4" />
              Banned Users ({bannedUsers.length})
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              All Users ({users.length})
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Payments ({payments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-6">
            {/* Filter Controls */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Filter by Status:</span>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-white border-gray-300">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reports Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-gray-900">{reports.length}</div>
                  <div className="text-sm text-gray-600">Total Reports</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-yellow-600">
                    {getStatusCount('pending')}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {getStatusCount('completed')}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </CardContent>
              </Card>
            </div>

            {/* Reports List */}
            <div className="space-y-4">
              {filteredReports.length === 0 ? (
                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardContent className="p-8 text-center">
                    <div className="text-gray-500">No reports found</div>
                  </CardContent>
                </Card>
              ) : (
                filteredReports.map((report) => (
                  <Card key={report.$id} className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-gray-900">
                          Report #{report.$id?.slice(-8)}
                        </CardTitle>
                        {getStatusBadge(report.Status as string)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-sm font-medium text-gray-600">Reported User</div>
                          <div className="font-mono text-gray-900 bg-gray-100 px-3 py-2 rounded border text-sm">
                            {report.reporteduser}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600">Reported By</div>
                          <div className="font-mono text-gray-900 bg-gray-100 px-3 py-2 rounded border text-sm">
                            {report.reportedBy}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600">Match ID</div>
                          <div className="font-mono text-gray-900 bg-gray-100 px-3 py-2 rounded border text-sm">
                            {report.matchId}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="text-sm font-medium text-gray-600 mb-2">Created At</div>
                        <div className="text-gray-900">{formatDate(report.createdAt)}</div>
                      </div>

                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-gray-300"
                              onClick={() => setSelectedReport(report)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl bg-white border border-gray-200">
                            <DialogHeader>
                              <DialogTitle className="text-gray-900">
                                Report Details #{report.$id?.slice(-8)}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <div className="text-sm font-medium text-gray-700 mb-1">Reported User</div>
                                  <div className="font-mono text-gray-900 bg-gray-100 px-3 py-2 rounded border text-sm">
                                    {report.reporteduser}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-700 mb-1">Reported By</div>
                                  <div className="font-mono text-gray-900 bg-gray-100 px-3 py-2 rounded border text-sm">
                                    {report.reportedBy}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-700 mb-1">Match ID</div>
                                  <div className="font-mono text-gray-900 bg-gray-100 px-3 py-2 rounded border text-sm">
                                    {report.matchId}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-700 mb-1">Status</div>
                                  <div className="mt-1">
                                    {getStatusBadge(report.Status as string)}
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <div className="text-sm font-medium text-gray-700 mb-2">Match Log</div>
                                <Textarea 
                                  value={report.matchLog || ''} 
                                  readOnly 
                                  className="min-h-[200px] bg-gray-100 border-gray-300 text-gray-900"
                                />
                              </div>
                              
                              <div>
                                <div className="text-sm font-medium text-gray-700 mb-2">Created At</div>
                                <div className="text-gray-900">{formatDate(report.createdAt)}</div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <div className="flex items-center gap-2">
                          <Select 
                            value={normalizeStatus(report.Status as string)} 
                            onValueChange={(value) => handleStatusUpdate(report.$id!, value)}
                          >
                            <SelectTrigger className="w-[140px] bg-white border-gray-300">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Dialog open={showBanConfirm} onOpenChange={setShowBanConfirm}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={() => {
                                  setUserToBan(report.reporteduser);
                                  setShowBanConfirm(true);
                                }}
                              >
                                <Ban className="w-4 h-4 mr-2" />
                                Ban User
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white border border-gray-200">
                              <DialogHeader>
                                <DialogTitle className="text-gray-900">Confirm Ban User</DialogTitle>
                              </DialogHeader>
                              <div className="py-4">
                                <p className="text-gray-700">
                                  Are you sure you want to ban user <strong className="text-gray-900">{userToBan}</strong>?
                                </p>
                                <p className="text-sm text-gray-600 mt-2">
                                  This action will prevent the user from participating in tournaments.
                                </p>
                              </div>
                              <DialogFooter>
                                <Button 
                                  variant="outline" 
                                  onClick={() => setShowBanConfirm(false)}
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  onClick={() => handleBanUser(userToBan)}
                                  disabled={banningUser === userToBan}
                                >
                                  {banningUser === userToBan ? 'Banning...' : 'Ban User'}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="banned-users" className="space-y-6">
            {bannedUsersLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-lg text-gray-700">Loading banned users...</div>
              </div>
            ) : (
              <>
                {/* Banned Users Summary */}
                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-red-600">{bannedUsers.length}</div>
                      <div className="text-sm text-gray-600">Total Banned Users</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Banned Users List */}
                <div className="space-y-4">
                  {bannedUsers.length === 0 ? (
                    <Card className="bg-white border-gray-200 shadow-sm">
                      <CardContent className="p-8 text-center">
                        <UserX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <div className="text-gray-500">No banned users found</div>
                      </CardContent>
                    </Card>
                  ) : (
                    bannedUsers.map((bannedUser, index) => (
                      <Card key={index} className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                              <Ban className="w-5 h-5 text-red-500" />
                              Banned User
                            </CardTitle>
                            <Badge variant="destructive" className="flex items-center gap-1">
                              <UserX className="w-3 h-3" />
                              Banned
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <div className="text-sm font-medium text-gray-600">User ID</div>
                              <div className="font-mono text-gray-900 bg-gray-100 px-3 py-2 rounded border text-sm">
                                {bannedUser.reportedId}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-600">Ban Record ID</div>
                              <div className="font-mono text-gray-900 bg-gray-100 px-3 py-2 rounded border text-sm">
                                {bannedUser.$id?.slice(-8)}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-end">
                            <Dialog open={showUnbanConfirm} onOpenChange={setShowUnbanConfirm}>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="border-green-300 text-green-700 hover:bg-green-50"
                                  onClick={() => {
                                    setUserToUnban(bannedUser);
                                    setShowUnbanConfirm(true);
                                  }}
                                >
                                  <Shield className="w-4 h-4 mr-2" />
                                  Unban User
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-white border border-gray-200">
                                <DialogHeader>
                                  <DialogTitle className="text-gray-900">Confirm Unban User</DialogTitle>
                                </DialogHeader>
                                <div className="py-4">
                                  <p className="text-gray-700">
                                    Are you sure you want to unban user <strong className="text-gray-900">{userToUnban?.reportedId}</strong>?
                                  </p>
                                  <p className="text-sm text-gray-600 mt-2">
                                    This action will allow the user to participate in tournaments again.
                                  </p>
                                </div>
                                <DialogFooter>
                                  <Button 
                                    variant="outline" 
                                    onClick={() => setShowUnbanConfirm(false)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button 
                                    variant="default" 
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => userToUnban && handleUnbanUser(userToUnban)}
                                    disabled={unbanning === userToUnban?.$id}
                                  >
                                    {unbanning === userToUnban?.$id ? 'Unbanning...' : 'Unban User'}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </>
            )}
          </TabsContent>

          {/* FIXED Users Tab */}
          <TabsContent value="users" className="space-y-6">
            {usersLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-lg text-gray-700">Loading users...</div>
              </div>
            ) : (
              <>
                {/* Users Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-white border-gray-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-blue-600">{users.length}</div>
                      <div className="text-sm text-gray-600">Total Users</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white border-gray-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-amber-600">
                        {users.filter(u => u.tier1).length}
                      </div>
                      <div className="text-sm text-gray-600">Tier 1 Users</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white border-gray-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-gray-600">
                        {users.filter(u => u.tier2).length}
                      </div>
                      <div className="text-sm text-gray-600">Tier 2 Users</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white border-gray-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-yellow-600">
                        {users.filter(u => u.tier3).length}
                      </div>
                      <div className="text-sm text-gray-600">Tier 3 Users</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Users List */}
                <div className="space-y-4">
                  {users.length === 0 ? (
                    <Card className="bg-white border-gray-200 shadow-sm">
                      <CardContent className="p-8 text-center">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <div className="text-gray-500">No users found</div>
                      </CardContent>
                    </Card>
                  ) : (
                    users.map((user, index) => (
                      <Card key={user.$id || index} className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                              <Users className="w-5 h-5 text-blue-500" />
                              User: {user.userId}
                            </CardTitle>
                            <div className="flex gap-2">
                              {getTierBadges(user)}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                            <div>
                              <div className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                <Trophy className="w-4 h-4" />
                                Tournament Score
                              </div>
                              <div className="text-xl font-bold text-gray-900">
                                {user.tournamentStats.totalScore}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                <Target className="w-4 h-4 text-green-500" />
                                Wins
                              </div>
                              <div className="text-xl font-bold text-green-600">
                                {user.tournamentStats.totalWins}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                <Target className="w-4 h-4 text-red-500" />
                                Losses
                              </div>
                              <div className="text-xl font-bold text-red-600">
                                {user.tournamentStats.totalLosses}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-600">Win Rate</div>
                              <div className="text-xl font-bold text-blue-600">
                                {user.tournamentStats.winRate}%
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-600">Active</div>
                              <div className="text-xl font-bold text-purple-600">
                                {user.tournamentStats.activeAssignments}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Created: {user.$createdAt ? formatDate(user.$createdAt) : 'N/A'}
                            </div>
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="border-gray-300"
                                  onClick={() => setSelectedUser(user)}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl bg-white border border-gray-200">
                                <DialogHeader>
                                  <DialogTitle className="text-gray-900 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-blue-500" />
                                    User Details: {user.userId}
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <div className="text-sm font-medium text-gray-700 mb-1">User ID</div>
                                      <div className="font-mono text-gray-900 bg-gray-100 px-3 py-2 rounded border text-sm">
                                        {user.userId}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium text-gray-700 mb-1">Document ID</div>
                                      <div className="font-mono text-gray-900 bg-gray-100 px-3 py-2 rounded border text-sm">
                                        {user.$id?.slice(-8) || 'N/A'}
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <div className="text-sm font-medium text-gray-700 mb-2">Tier Access</div>
                                    <div className="flex gap-2">
                                      {getTierBadges(user)}
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    <div className="text-center p-4 bg-gray-100 border rounded-lg">
                                      <div className="text-2xl font-bold text-gray-900">{user.tournamentStats.totalScore}</div>
                                      <div className="text-sm text-gray-600">Total Score</div>
                                    </div>
                                    <div className="text-center p-4 bg-green-100 border border-green-200 rounded-lg">
                                      <div className="text-2xl font-bold text-green-700">{user.tournamentStats.totalWins}</div>
                                      <div className="text-sm text-gray-600">Total Wins</div>
                                    </div>
                                    <div className="text-center p-4 bg-red-100 border border-red-200 rounded-lg">
                                      <div className="text-2xl font-bold text-red-700">{user.tournamentStats.totalLosses}</div>
                                      <div className="text-sm text-gray-600">Total Losses</div>
                                    </div>
                                    <div className="text-center p-4 bg-blue-100 border border-blue-200 rounded-lg">
                                      <div className="text-2xl font-bold text-blue-700">{user.tournamentStats.winRate}%</div>
                                      <div className="text-sm text-gray-600">Win Rate</div>
                                    </div>
                                    <div className="text-center p-4 bg-purple-100 border border-purple-200 rounded-lg">
                                      <div className="text-2xl font-bold text-purple-700">{user.tournamentStats.activeAssignments}</div>
                                      <div className="text-sm text-gray-600">Active</div>
                                    </div>
                                  </div>

                                  <div>
                                    <div className="text-sm font-medium text-gray-700 mb-2">Tournament Statistics</div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="bg-gray-100 border p-3 rounded">
                                        <div className="text-lg font-bold text-gray-900">{user.tournamentStats.completedAssignments}</div>
                                        <div className="text-sm text-gray-600">Completed Tournaments</div>
                                      </div>
                                      <div className="bg-gray-100 border p-3 rounded">
                                        <div className="text-lg font-bold text-gray-900">{user.tournamentStats.activeAssignments}</div>
                                        <div className="text-sm text-gray-600">Active Tournaments</div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="border-t border-gray-200 pt-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <span className="font-medium text-gray-700">Created:</span>
                                        <div className="text-gray-900 mt-1">
                                          {user.$createdAt ? formatDate(user.$createdAt) : 'N/A'}
                                        </div>
                                      </div>
                                      <div>
                                        <span className="font-medium text-gray-700">Last Updated:</span>
                                        <div className="text-gray-900 mt-1">
                                          {user.$updatedAt ? formatDate(user.$updatedAt) : 'N/A'}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </>
            )}
          </TabsContent>

          {/* UPDATED Payments Tab with PayPal Account and Fixed Hover Issues */}
          <TabsContent value="payments" className="space-y-6">
            {paymentsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-lg text-gray-700">Loading payments...</div>
              </div>
            ) : (
              <>
                {/* Payment Filter Controls */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">Filter by Status:</span>
                  <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                    <SelectTrigger className="w-[180px] bg-white border-gray-300">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">All Payments</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Payment Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-white border-gray-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-gray-900">{payments.length}</div>
                      <div className="text-sm text-gray-600">Total Requests</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white border-gray-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-yellow-600">
                        {getPaymentStatusCount('pending')}
                      </div>
                      <div className="text-sm text-gray-600">Pending</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white border-gray-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-green-600">
                        {getPaymentStatusCount('completed')}
                      </div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white border-gray-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-red-600">
                        {getPaymentStatusCount('rejected')}
                      </div>
                      <div className="text-sm text-gray-600">Rejected</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Payments List */}
                <div className="space-y-4">
                  {filteredPayments.length === 0 ? (
                    <Card className="bg-white border-gray-200 shadow-sm">
                      <CardContent className="p-8 text-center">
                        <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <div className="text-gray-500">No payment requests found</div>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredPayments.map((payment) => (
                      <Card key={payment.$id} className="bg-white border-gray-200 shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-200">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                              <DollarSign className="w-5 h-5 text-green-500" />
                              Payment Request #{payment.$id?.slice(-8)}
                            </CardTitle>
                            {getPaymentStatusBadge(payment.Status)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <div className="text-sm font-medium text-gray-600">User ID</div>
                              <div className="font-mono text-gray-900 bg-gray-100 px-3 py-2 rounded border text-sm">
                                {payment.userId}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-600">PayPal Account</div>
                              <div className="font-mono text-gray-900 bg-gray-100 px-3 py-2 rounded border text-sm">
                                {payment.paypalAccount || 'Not provided'}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-600">Amount</div>
                              <div className="text-xl font-bold text-green-600">
                                {formatCurrency(payment.paymentValue)}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-600">Requested At</div>
                              <div className="text-gray-900 text-sm">{formatDate(payment.RequestedAt)}</div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                                  onClick={() => setSelectedPayment(payment)}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl bg-white border border-gray-200">
                                <DialogHeader>
                                  <DialogTitle className="text-gray-900 flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-green-500" />
                                    Payment Details #{payment.$id?.slice(-8)}
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <div className="text-sm font-medium text-gray-700 mb-1">User ID</div>
                                      <div className="font-mono text-gray-900 bg-gray-100 px-3 py-2 rounded border text-sm">
                                        {payment.userId}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium text-gray-700 mb-1">Payment ID</div>
                                      <div className="font-mono text-gray-900 bg-gray-100 px-3 py-2 rounded border text-sm break-all">
                                        {payment.$id}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <div className="text-sm font-medium text-gray-700 mb-1">PayPal Account</div>
                                      <div className="font-mono text-gray-900 bg-gray-100 px-3 py-2 rounded border text-sm break-all">
                                        {payment.paypalAccount || 'Not provided'}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium text-gray-700 mb-1">Status</div>
                                      <div className="mt-1">
                                        {getPaymentStatusBadge(payment.Status)}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 gap-4">
                                    <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg">
                                      <div className="text-3xl font-bold text-green-700">
                                        {formatCurrency(payment.paymentValue)}
                                      </div>
                                      <div className="text-sm text-gray-600 mt-1">Requested Amount</div>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <div className="text-sm font-medium text-gray-700 mb-1">Requested At</div>
                                      <div className="text-gray-900">{formatDate(payment.RequestedAt)}</div>
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium text-gray-700 mb-1">Last Updated</div>
                                      <div className="text-gray-900">
                                        {payment.$updatedAt ? formatDate(payment.$updatedAt) : 'N/A'}
                                      </div>
                                    </div>
                                  </div>

                                  {payment.paypalAccount && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                      <div className="text-sm font-medium text-blue-700 mb-2">Payment Instructions</div>
                                      <div className="text-sm text-blue-600">
                                        Send payment of <strong>{formatCurrency(payment.paymentValue)}</strong> to PayPal account: <strong>{payment.paypalAccount}</strong>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>

                            {payment.Status === 'pending' && (
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="default" 
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white transition-colors"
                                  onClick={() => {
                                    setPaymentToProcess(payment);
                                    setPaymentAction('completed');
                                    setShowPaymentConfirm(true);
                                  }}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Mark Paid
                                </Button>

                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  className="bg-red-600 hover:bg-red-700 text-white transition-colors"
                                  onClick={() => {
                                    setPaymentToProcess(payment);
                                    setPaymentAction('rejected');
                                    setShowPaymentConfirm(true);
                                  }}
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Reject
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>

                {/* Payment Action Confirmation Dialog */}
                <Dialog open={showPaymentConfirm} onOpenChange={setShowPaymentConfirm}>
                  <DialogContent className="bg-white border border-gray-200">
                    <DialogHeader>
                      <DialogTitle className="text-gray-900">
                        Confirm Payment {paymentAction === 'completed' ? 'Completion' : 'Rejection'}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="text-gray-700">
                        Are you sure you want to mark payment request <strong className="text-gray-900">#{paymentToProcess?.$id?.slice(-8)}</strong> as <strong className="text-gray-900">{paymentAction}</strong>?
                      </p>
                      <div className="mt-4 p-4 bg-gray-50 border rounded-lg">
                        <div className="grid grid-cols-1 gap-3 text-sm">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="font-medium text-gray-600">User:</span>
                              <div className="text-gray-900">{paymentToProcess?.userId}</div>
                            </div>
                            <div>
                              <span className="font-medium text-gray-600">Amount:</span>
                              <div className="text-gray-900 font-bold">{paymentToProcess && formatCurrency(paymentToProcess.paymentValue)}</div>
                            </div>
                          </div>
                          {paymentToProcess?.paypalAccount && (
                            <div>
                              <span className="font-medium text-gray-600">PayPal Account:</span>
                              <div className="text-gray-900 font-mono">{paymentToProcess.paypalAccount}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowPaymentConfirm(false)}
                        className="hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant={paymentAction === 'completed' ? 'default' : 'destructive'}
                        onClick={() => paymentToProcess && handlePaymentStatusUpdate(paymentToProcess.$id!, paymentAction)}
                        disabled={processingPayment === paymentToProcess?.$id}
                        className={paymentAction === 'completed' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                      >
                        {processingPayment === paymentToProcess?.$id ? 'Processing...' : `Mark ${paymentAction}`}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}