import { motion } from 'framer-motion';
import { Activity, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useActivityLogs } from '@/hooks/useAdminData';
import { formatDistanceToNow, format } from 'date-fns';

const actionColors: Record<string, string> = {
  created: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  updated: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  deleted: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  updated_status: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
};

const ActivityLog = () => {
  const { data: activityLogs, isLoading } = useActivityLogs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Activity Log</h1>
        <p className="text-muted-foreground mt-1">
          Track all admin actions and changes
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : activityLogs?.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No activity recorded yet</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

              <div className="space-y-6">
                {activityLogs?.map((log: any, index: number) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative flex gap-4"
                  >
                    {/* Avatar */}
                    <div className="relative z-10 w-12 h-12 bg-card border-2 border-border rounded-full flex items-center justify-center flex-shrink-0">
                      {log.profiles?.avatar_url ? (
                        <img
                          src={log.profiles.avatar_url}
                          alt={log.profiles.full_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-primary">
                          {log.profiles?.full_name?.[0]?.toUpperCase() || 
                           log.profiles?.email?.[0]?.toUpperCase() || 
                           <User className="w-5 h-5 text-muted-foreground" />}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-semibold text-foreground">
                          {log.profiles?.full_name || log.profiles?.email || 'Admin'}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${actionColors[log.action] || 'bg-muted text-muted-foreground'}`}>
                          {log.action}
                        </span>
                        <span className="text-muted-foreground">
                          {log.target_table}
                        </span>
                      </div>

                      {log.details && (
                        <div className="text-sm text-muted-foreground mb-2">
                          {log.details.name && (
                            <p>
                              <span className="text-foreground font-medium">"{log.details.name}"</span>
                            </p>
                          )}
                          {log.details.status && (
                            <p>
                              Status changed to: <span className="text-foreground font-medium">{log.details.status}</span>
                            </p>
                          )}
                          {log.details.code && (
                            <p>
                              Coupon: <span className="text-foreground font-medium font-mono">{log.details.code}</span>
                            </p>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span title={format(new Date(log.created_at), 'PPpp')}>
                          {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                        </span>
                        {log.target_id && (
                          <span className="font-mono">
                            ID: {log.target_id.slice(0, 8)}...
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityLog;
