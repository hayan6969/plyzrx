'use client';

import { useState, useEffect } from 'react';
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
import { AlertTriangle, Eye, Ban, Clock, CheckCircle, UserX, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminReportPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [bannedUsers, setBannedUsers] = useState<BanUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [bannedUsersLoading, setBannedUsersLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [banningUser, setBanningUser] = useState<string | null>(null);
  const [unbanning, setUnbanning] = useState<string | null>(null);
  const [showBanConfirm, setShowBanConfirm] = useState(false);
  const [showUnbanConfirm, setShowUnbanConfirm] = useState(false);
  const [userToBan, setUserToBan] = useState<string>('');
  const [userToUnban, setUserToUnban] = useState<BanUser | null>(null);
  const [activeTab, setActiveTab] = useState('reports');

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    if (activeTab === 'banned-users') {
      fetchBannedUsers();
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
      const users = await getAllBannedUsers();
      setBannedUsers(users);
    } catch (error) {
      console.error('Failed to fetch banned users:', error);
      toast.error('Failed to fetch banned users');
    } finally {
      setBannedUsersLoading(false);
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

  const filteredReports = reports.filter(report => {
    if (statusFilter === 'all') return true;
    const reportStatus = normalizeStatus(report.Status as string);
    return reportStatus === statusFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Helper function to get status counts with normalized status
  const getStatusCount = (status: string) => {
    return reports.filter(r => normalizeStatus(r.Status as string) === status).length;
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
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Management</h1>
          </div>
          <Button 
            onClick={activeTab === 'reports' ? fetchReports : fetchBannedUsers} 
            variant="outline" 
            className="border-gray-300"
          >
            Refresh
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Reports ({reports.length})
            </TabsTrigger>
            <TabsTrigger value="banned-users" className="flex items-center gap-2">
              <Ban className="w-4 h-4" />
              Banned Users ({bannedUsers.length})
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
                          <div className="font-mono text-gray-900 bg-gray-50 px-2 py-1 rounded text-sm">
                            {report.reporteduser}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600">Reported By</div>
                          <div className="font-mono text-gray-900 bg-gray-50 px-2 py-1 rounded text-sm">
                            {report.reportedBy}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600">Match ID</div>
                          <div className="font-mono text-gray-900 bg-gray-50 px-2 py-1 rounded text-sm">
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
                          <DialogContent className="max-w-2xl bg-white">
                            <DialogHeader>
                              <DialogTitle className="text-gray-900">
                                Report Details #{report.$id?.slice(-8)}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <div className="text-sm font-medium text-gray-600">Reported User</div>
                                  <div className="font-mono text-gray-900 bg-gray-50 px-2 py-1 rounded text-sm">
                                    {report.reporteduser}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-600">Reported By</div>
                                  <div className="font-mono text-gray-900 bg-gray-50 px-2 py-1 rounded text-sm">
                                    {report.reportedBy}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-600">Match ID</div>
                                  <div className="font-mono text-gray-900 bg-gray-50 px-2 py-1 rounded text-sm">
                                    {report.matchId}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-600">Status</div>
                                  <div className="mt-1">
                                    {getStatusBadge(report.Status as string)}
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <div className="text-sm font-medium text-gray-600 mb-2">Match Log</div>
                                <Textarea 
                                  value={report.matchLog || ''} 
                                  readOnly 
                                  className="min-h-[200px] bg-gray-50 border-gray-300 text-gray-900"
                                />
                              </div>
                              
                              <div>
                                <div className="text-sm font-medium text-gray-600 mb-2">Created At</div>
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
                            <DialogContent className="bg-white">
                              <DialogHeader>
                                <DialogTitle className="text-gray-900">Confirm Ban User</DialogTitle>
                              </DialogHeader>
                              <div className="py-4">
                                <p className="text-gray-700">
                                  Are you sure you want to ban user <strong>{userToBan}</strong>?
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
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
                              <div className="font-mono text-gray-900 bg-gray-50 px-2 py-1 rounded text-sm">
                                {bannedUser.reportedId}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-600">Ban Record ID</div>
                              <div className="font-mono text-gray-900 bg-gray-50 px-2 py-1 rounded text-sm">
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
                              <DialogContent className="bg-white">
                                <DialogHeader>
                                  <DialogTitle className="text-gray-900">Confirm Unban User</DialogTitle>
                                </DialogHeader>
                                <div className="py-4">
                                  <p className="text-gray-700">
                                    Are you sure you want to unban user <strong>{userToUnban?.reportedId}</strong>?
                                  </p>
                                  <p className="text-sm text-gray-500 mt-2">
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
        </Tabs>
      </div>
    </div>
  );
}