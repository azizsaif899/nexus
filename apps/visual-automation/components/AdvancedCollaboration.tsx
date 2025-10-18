import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, MessageCircle, AtSign, Eye, UserPlus, Share2, 
  Clock, Bell, CheckCircle, AlertCircle, Mic, Video,
  Send, Smile, Paperclip, MoreHorizontal, Star,
  Filter, Search, Settings, Volume2, VolumeX
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { enhancedToast as toast } from './ui/enhanced-toast';

interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  role: 'owner' | 'editor' | 'viewer' | 'commenter';
  lastSeen: Date;
  cursor?: { x: number; y: number; nodeId?: string };
}

interface Comment {
  id: string;
  userId: string;
  nodeId?: string;
  position?: { x: number; y: number };
  content: string;
  timestamp: Date;
  resolved: boolean;
  reactions: Record<string, string[]>;
  replies?: Comment[];
  type: 'comment' | 'suggestion' | 'bug' | 'feature';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface Activity {
  id: string;
  userId: string;
  type: 'node_added' | 'node_deleted' | 'node_modified' | 'connection_created' | 'comment_added' | 'workflow_saved';
  description: string;
  timestamp: Date;
  nodeId?: string;
}

interface AdvancedCollaborationProps {
  workflowId: string;
  currentUserId: string;
  onUserCursorMove?: (position: { x: number; y: number }) => void;
  onCommentAdd?: (comment: Omit<Comment, 'id' | 'timestamp'>) => void;
  onActivityLog?: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
}

export function AdvancedCollaboration({
  workflowId,
  currentUserId,
  onUserCursorMove,
  onCommentAdd,
  onActivityLog
}: AdvancedCollaborationProps) {
  const [users, setUsers] = useState<User[]>([
    {
      id: 'user1',
      name: 'أحمد محمد',
      avatar: '/avatars/user1.jpg',
      status: 'online',
      role: 'owner',
      lastSeen: new Date(),
    },
    {
      id: 'user2',
      name: 'فاطمة علي',
      avatar: '/avatars/user2.jpg',
      status: 'online',
      role: 'editor',
      lastSeen: new Date(),
      cursor: { x: 450, y: 300 }
    },
    {
      id: 'user3',
      name: 'محمد حسن',
      avatar: '/avatars/user3.jpg',
      status: 'away',
      role: 'viewer',
      lastSeen: new Date(Date.now() - 5 * 60 * 1000),
    }
  ]);

  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'comment1',
      userId: 'user2',
      nodeId: 'node1',
      position: { x: 200, y: 150 },
      content: 'يجب تحسين هذه العقدة لتعمل بشكل أسرع',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      resolved: false,
      reactions: { '👍': ['user1'], '❤️': ['user1', 'user3'] },
      type: 'suggestion',
      priority: 'medium'
    },
    {
      id: 'comment2',
      userId: 'user1',
      content: 'ممتاز! تم تطبيق التحديثات الجديدة بنجاح',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      resolved: true,
      reactions: { '🎉': ['user2', 'user3'] },
      type: 'comment',
      priority: 'low'
    }
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 'activity1',
      userId: 'user2',
      type: 'node_added',
      description: 'أضافت عقدة HTTP Request جديدة',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      nodeId: 'node4'
    },
    {
      id: 'activity2',
      userId: 'user1',
      type: 'workflow_saved',
      description: 'حفظ سير العمل',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
    }
  ]);

  const [showCollabPanel, setShowCollabPanel] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showActivities, setShowActivities] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentType, setCommentType] = useState<Comment['type']>('comment');
  const [commentPriority, setCommentPriority] = useState<Comment['priority']>('medium');
  const [selectedPosition, setSelectedPosition] = useState<{ x: number; y: number } | null>(null);
  const [activeCall, setActiveCall] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterResolved, setFilterResolved] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update user cursors
      setUsers(prev => prev.map(user => ({
        ...user,
        cursor: user.status === 'online' && user.id !== currentUserId ? {
          x: Math.random() * 800,
          y: Math.random() * 600,
          nodeId: Math.random() > 0.7 ? `node${Math.floor(Math.random() * 5) + 1}` : undefined
        } : user.cursor
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, [currentUserId]);

  const handleAddComment = useCallback(() => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `comment${Date.now()}`,
      userId: currentUserId,
      content: newComment,
      position: selectedPosition || undefined,
      timestamp: new Date(),
      resolved: false,
      reactions: {},
      type: commentType,
      priority: commentPriority
    };

    setComments(prev => [comment, ...prev]);
    onCommentAdd?.(comment);
    setNewComment('');
    setSelectedPosition(null);
    
    toast.success('تم إضافة التعليق بنجاح', {
      description: 'سيتم إشعار جميع أعضاء الفريق'
    });
  }, [newComment, selectedPosition, commentType, commentPriority, currentUserId, onCommentAdd]);

  const handleResolveComment = useCallback((commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId ? { ...comment, resolved: !comment.resolved } : comment
    ));
    
    toast.success('تم تحديث حالة التعليق');
  }, []);

  const handleReaction = useCallback((commentId: string, emoji: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        const reactions = { ...comment.reactions };
        if (reactions[emoji]?.includes(currentUserId)) {
          reactions[emoji] = reactions[emoji].filter(id => id !== currentUserId);
          if (reactions[emoji].length === 0) delete reactions[emoji];
        } else {
          reactions[emoji] = [...(reactions[emoji] || []), currentUserId];
        }
        return { ...comment, reactions };
      }
      return comment;
    }));
  }, [currentUserId]);

  const handleShareWorkflow = useCallback(() => {
    const shareUrl = `${window.location.origin}/workflow/${workflowId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('تم نسخ رابط المشاركة', {
      description: 'شارك الرابط مع فريقك للتعاون'
    });
  }, [workflowId]);

  const handleStartCall = useCallback(() => {
    setActiveCall(true);
    toast.success('بدأ المكالمة الصوتية', {
      description: 'يمكن للأعضاء الانضمام الآن'
    });
  }, []);

  const handleEndCall = useCallback(() => {
    setActiveCall(false);
    setMicMuted(false);
    setVideoMuted(true);
    toast.info('انتهت المكالمة');
  }, []);

  const filteredComments = comments.filter(comment => {
    const matchesSearch = comment.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterResolved ? comment.resolved : true;
    return matchesSearch && matchesFilter;
  });

  const onlineUsers = users.filter(user => user.status === 'online');
  const unresolvedComments = comments.filter(comment => !comment.resolved);

  return (
    <>
      {/* User Cursors */}
      <AnimatePresence>
        {users.map(user => user.cursor && user.id !== currentUserId && (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            style={{
              position: 'absolute',
              left: user.cursor.x,
              top: user.cursor.y,
              zIndex: 1000,
              pointerEvents: 'none'
            }}
            className="flex items-center gap-2"
          >
            <div className="relative">
              <div className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg" />
              <div className="absolute -top-8 left-0 whitespace-nowrap bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                {user.name}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Comment Pins */}
      <AnimatePresence>
        {comments.map(comment => comment.position && (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            style={{
              position: 'absolute',
              left: comment.position.x,
              top: comment.position.y,
              zIndex: 100
            }}
            className="cursor-pointer"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                    comment.resolved 
                      ? 'bg-success text-success-foreground' 
                      : comment.type === 'bug' 
                        ? 'bg-destructive text-destructive-foreground'
                        : comment.type === 'suggestion'
                          ? 'bg-warning text-warning-foreground'
                          : 'bg-primary text-primary-foreground'
                  }`}
                >
                  {comment.resolved ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : comment.type === 'bug' ? (
                    <AlertCircle className="w-3 h-3" />
                  ) : (
                    <MessageCircle className="w-3 h-3" />
                  )}
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="max-w-xs">
                  <p className="font-medium text-xs mb-1">
                    {users.find(u => u.id === comment.userId)?.name}
                  </p>
                  <p className="text-xs">{comment.content}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Floating Collaboration Panel */}
      <motion.div
        initial={{ x: 400 }}
        animate={{ x: showCollabPanel ? 0 : 380 }}
        className="fixed top-20 left-4 z-50 w-96 glass-medium border border-border rounded-xl shadow-xl"
        style={{ maxHeight: 'calc(100vh - 6rem)' }}
      >
        {/* Panel Header */}
        <div className="p-4 border-b border-border bg-background-elevated/50 rounded-t-xl">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCollabPanel(!showCollabPanel)}
              className="p-1 hover:bg-hover-bg"
            >
              <Users className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {onlineUsers.length} متصل
              </Badge>
              <Badge variant={unresolvedComments.length > 0 ? "destructive" : "secondary"} className="text-xs">
                {unresolvedComments.length} تعليق
              </Badge>
            </div>

            <div className="flex items-center gap-1">
              {activeCall && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMicMuted(!micMuted)}
                    className={`p-1 ${micMuted ? 'text-destructive' : 'text-success'}`}
                  >
                    {micMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setVideoMuted(!videoMuted)}
                    className={`p-1 ${videoMuted ? 'text-muted-foreground' : 'text-primary'}`}
                  >
                    <Video className="w-3 h-3" />
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleEndCall}
                    className="p-1"
                  >
                    ×
                  </Button>
                </div>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShareWorkflow}
                className="p-1"
              >
                <Share2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Panel Content */}
        <AnimatePresence>
          {showCollabPanel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              {/* Tab Navigation */}
              <div className="flex border-b border-border bg-background/50">
                <Button
                  variant={!showComments && !showActivities ? "default" : "ghost"}
                  size="sm"
                  onClick={() => { setShowComments(false); setShowActivities(false); }}
                  className="flex-1 rounded-none"
                >
                  الفريق
                </Button>
                <Button
                  variant={showComments ? "default" : "ghost"}
                  size="sm"
                  onClick={() => { setShowComments(true); setShowActivities(false); }}
                  className="flex-1 rounded-none"
                >
                  التعليقات
                </Button>
                <Button
                  variant={showActivities ? "default" : "ghost"}
                  size="sm"
                  onClick={() => { setShowComments(false); setShowActivities(true); }}
                  className="flex-1 rounded-none"
                >
                  النشاط
                </Button>
              </div>

              <ScrollArea className="max-h-96">
                {!showComments && !showActivities && (
                  /* Team Members */
                  <div className="p-4 space-y-3">
                    {!activeCall && (
                      <Button
                        onClick={handleStartCall}
                        className="w-full btn-primary mb-3"
                        size="sm"
                      >
                        <Mic className="w-4 h-4 ml-2" />
                        بدء مكالمة جماعية
                      </Button>
                    )}

                    {users.map(user => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-hover-bg"
                      >
                        <div className="relative">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                            user.status === 'online' ? 'bg-success' :
                            user.status === 'away' ? 'bg-warning' :
                            user.status === 'busy' ? 'bg-destructive' : 'bg-muted'
                          }`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.role === 'owner' ? 'مالك' :
                             user.role === 'editor' ? 'محرر' :
                             user.role === 'viewer' ? 'مشاهد' : 'معلق'}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {user.cursor && (
                            <Eye className="w-3 h-3 text-primary" />
                          )}
                          {activeCall && user.status === 'online' && (
                            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {showComments && (
                  /* Comments Section */
                  <div className="p-4 space-y-4">
                    {/* Comment Search and Filter */}
                    <div className="space-y-2">
                      <Input
                        placeholder="البحث في التعليقات..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="text-sm"
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          variant={filterResolved ? "default" : "outline"}
                          size="sm"
                          onClick={() => setFilterResolved(!filterResolved)}
                          className="text-xs"
                        >
                          <Filter className="w-3 h-3 ml-1" />
                          المحلولة
                        </Button>
                      </div>
                    </div>

                    {/* Add Comment */}
                    <div className="space-y-2 p-3 bg-background-elevated rounded-lg border">
                      <div className="flex gap-2">
                        <select
                          value={commentType}
                          onChange={(e) => setCommentType(e.target.value as Comment['type'])}
                          className="text-xs px-2 py-1 rounded border bg-background"
                        >
                          <option value="comment">تعليق</option>
                          <option value="suggestion">اقتراح</option>
                          <option value="bug">خطأ</option>
                          <option value="feature">ميزة</option>
                        </select>
                        <select
                          value={commentPriority}
                          onChange={(e) => setCommentPriority(e.target.value as Comment['priority'])}
                          className="text-xs px-2 py-1 rounded border bg-background"
                        >
                          <option value="low">منخفضة</option>
                          <option value="medium">متوسطة</option>
                          <option value="high">عالية</option>
                          <option value="critical">حرجة</option>
                        </select>
                      </div>
                      
                      <Textarea
                        placeholder="اكتب تعليقك هنا..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="text-sm min-h-[60px]"
                      />
                      
                      <Button
                        onClick={handleAddComment}
                        size="sm"
                        className="w-full btn-primary"
                        disabled={!newComment.trim()}
                      >
                        <Send className="w-3 h-3 ml-1" />
                        إضافة تعليق
                      </Button>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-3">
                      {filteredComments.map(comment => (
                        <motion.div
                          key={comment.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-3 rounded-lg border ${
                            comment.resolved ? 'bg-success-muted border-success' : 'bg-background-elevated'
                          }`}
                        >
                          <div className="flex items-start gap-2 mb-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">
                                {users.find(u => u.id === comment.userId)?.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-xs">
                                  {users.find(u => u.id === comment.userId)?.name}
                                </p>
                                <Badge
                                  variant={
                                    comment.type === 'bug' ? 'destructive' :
                                    comment.type === 'suggestion' ? 'secondary' :
                                    comment.type === 'feature' ? 'default' : 'outline'
                                  }
                                  className="text-[10px] px-1"
                                >
                                  {comment.type === 'comment' ? 'تعليق' :
                                   comment.type === 'suggestion' ? 'اقتراح' :
                                   comment.type === 'bug' ? 'خطأ' : 'ميزة'}
                                </Badge>
                                <Badge
                                  variant={
                                    comment.priority === 'critical' ? 'destructive' :
                                    comment.priority === 'high' ? 'destructive' :
                                    comment.priority === 'medium' ? 'secondary' : 'outline'
                                  }
                                  className="text-[10px] px-1"
                                >
                                  {comment.priority === 'low' ? 'منخفضة' :
                                   comment.priority === 'medium' ? 'متوسطة' :
                                   comment.priority === 'high' ? 'عالية' : 'حرجة'}
                                </Badge>
                              </div>
                              
                              <p className="text-xs text-foreground-secondary mb-2">
                                {comment.content}
                              </p>
                              
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleResolveComment(comment.id)}
                                  className="text-xs p-1 h-auto"
                                >
                                  {comment.resolved ? '↩️ إعادة فتح' : '✅ حل'}
                                </Button>
                                
                                <div className="flex items-center gap-1">
                                  {['👍', '❤️', '🎉', '👀'].map(emoji => (
                                    <Button
                                      key={emoji}
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleReaction(comment.id, emoji)}
                                      className={`text-xs p-1 h-auto ${
                                        comment.reactions[emoji]?.includes(currentUserId)
                                          ? 'bg-primary-muted'
                                          : ''
                                      }`}
                                    >
                                      {emoji} {comment.reactions[emoji]?.length || 0}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {showActivities && (
                  /* Activities Section */
                  <div className="p-4 space-y-3">
                    {activities.map(activity => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start gap-3 p-2 rounded-lg"
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          activity.type === 'node_added' ? 'bg-success text-success-foreground' :
                          activity.type === 'node_deleted' ? 'bg-destructive text-destructive-foreground' :
                          activity.type === 'workflow_saved' ? 'bg-primary text-primary-foreground' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {activity.type === 'node_added' ? '+' :
                           activity.type === 'node_deleted' ? '-' :
                           activity.type === 'workflow_saved' ? '💾' :
                           activity.type === 'comment_added' ? '💬' : '🔗'}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-foreground-secondary">
                            <span className="font-medium">
                              {users.find(u => u.id === activity.userId)?.name}
                            </span>
                            {' '}
                            {activity.description}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {activity.timestamp.toLocaleTimeString('ar')}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Active Call Indicator */}
      <AnimatePresence>
        {activeCall && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-4 right-4 z-50 bg-success text-success-foreground px-3 py-2 rounded-lg shadow-lg glass-medium"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success-foreground rounded-full animate-pulse" />
              <span className="text-sm font-medium">مكالمة نشطة</span>
              <span className="text-xs">({onlineUsers.length} مشاركين)</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}