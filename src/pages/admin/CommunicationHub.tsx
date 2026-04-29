import { useState } from "react";
import { ComingSoon } from "@/components/ui/ComingSoon";
import {
  Send,
  Search,
  Phone,
  Mail,
  MessageSquare,
  User,
  Clock,
  CheckCheck,
  Paperclip,
  MoreVertical,
  Stethoscope,
  Brain,
  Dumbbell,
  Sparkles,
  Salad,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: "message" | "announcement" | "alert";
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    participantId: "TH-SP-001",
    participantName: "Dr. Sarah Johnson",
    participantRole: "Counselling",
    lastMessage: "I've reviewed John's progress and recommend continuing with weekly sessions.",
    lastMessageTime: "10:30 AM",
    unreadCount: 2,
    online: true,
  },
  {
    id: "2",
    participantId: "TH-SP-002",
    participantName: "Dr. Michael Chen",
    participantRole: "Dental Care",
    lastMessage: "The dental equipment has been serviced and is ready for use.",
    lastMessageTime: "09:15 AM",
    unreadCount: 0,
    online: true,
  },
  {
    id: "3",
    participantId: "TH-SP-003",
    participantName: "Coach James Williams",
    participantRole: "Fitness & Gym",
    lastMessage: "Mike Johnson achieved a new personal best today!",
    lastMessageTime: "Yesterday",
    unreadCount: 1,
    online: false,
  },
  {
    id: "4",
    participantId: "TH-SP-004",
    participantName: "Dr. Emily Brown",
    participantRole: "Skin Care",
    lastMessage: "Skin care products have been restocked.",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    online: true,
  },
  {
    id: "5",
    participantId: "TH-SP-005",
    participantName: "Therapist Robert Taylor",
    participantRole: "Rehabilitation",
    lastMessage: "Emily's rehabilitation is progressing well, 80% complete.",
    lastMessageTime: "2 days ago",
    unreadCount: 0,
    online: false,
  },
  {
    id: "6",
    participantId: "TH-SP-006",
    participantName: "Dr. Lisa Anderson",
    participantRole: "Nutrition",
    lastMessage: "New meal plans are ready for review.",
    lastMessageTime: "3 days ago",
    unreadCount: 0,
    online: true,
  },
];

const mockMessages: Message[] = [
  {
    id: "m1",
    senderId: "admin",
    senderName: "Admin",
    recipientId: "TH-SP-001",
    recipientName: "Dr. Sarah Johnson",
    content: "Good morning Sarah, how are the new clients progressing?",
    timestamp: "2024-01-15T09:00:00Z",
    read: true,
    type: "message",
  },
  {
    id: "m2",
    senderId: "TH-SP-001",
    senderName: "Dr. Sarah Johnson",
    recipientId: "admin",
    recipientName: "Admin",
    content: "Good morning! John is doing excellent, he just completed his 6th session and shows significant improvement. Jane is also responding well to treatment.",
    timestamp: "2024-01-15T09:15:00Z",
    read: true,
    type: "message",
  },
  {
    id: "m3",
    senderId: "admin",
    senderName: "Admin",
    recipientId: "TH-SP-001",
    recipientName: "Dr. Sarah Johnson",
    content: "That's wonderful to hear! What's the recommendation for their treatment plan?",
    timestamp: "2024-01-15T09:30:00Z",
    read: true,
    type: "message",
  },
  {
    id: "m4",
    senderId: "TH-SP-001",
    senderName: "Dr. Sarah Johnson",
    recipientId: "admin",
    recipientName: "Admin",
    content: "I've reviewed John's progress and recommend continuing with weekly sessions. For Jane, I suggest we increase frequency to twice a week for the next month.",
    timestamp: "2024-01-15T10:30:00Z",
    read: false,
    type: "message",
  },
];

const roleIcons: Record<string, React.ElementType> = {
  Counselling: Brain,
  "Dental Care": Activity,
  "Fitness & Gym": Dumbbell,
  "Skin Care": Sparkles,
  Rehabilitation: Activity,
  Nutrition: Salad,
};

const CommunicationHub = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(mockConversations[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const filteredConversations = mockConversations.filter((conv) => {
    const matchesSearch = conv.participantName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || conv.participantRole === filterRole;
    return matchesSearch && matchesRole;
  });

  const totalUnread = mockConversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message via API
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const RoleIcon = selectedConversation ? roleIcons[selectedConversation.participantRole] : User;

  return (
    <div className="relative h-[calc(100vh-8rem)] flex gap-4">
      <ComingSoon
        title="Communication Hub"
        description="In-app messaging between admins and clients is under development. This will be available once the messaging API is ready."
      />
      {/* Conversations List */}
      <Card className="w-80 flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Messages</span>
            <Badge variant="secondary">{totalUnread} unread</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-0">
          {/* Search and Filter */}
          <div className="p-4 pt-0 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search providers..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Counselling">Counselling</SelectItem>
                <SelectItem value="Dental Care">Dental Care</SelectItem>
                <SelectItem value="Fitness & Gym">Fitness & Gym</SelectItem>
                <SelectItem value="Skin Care">Skin Care</SelectItem>
                <SelectItem value="Rehabilitation">Rehabilitation</SelectItem>
                <SelectItem value="Nutrition">Nutrition</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Conversation List */}
          <div className="divide-y">
            {filteredConversations.map((conv) => {
              const Icon = roleIcons[conv.participantRole] || User;
              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                    selectedConversation?.id === conv.id ? "bg-muted" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {conv.participantName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      {conv.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{conv.participantName}</p>
                        <span className="text-xs text-muted-foreground">{conv.lastMessageTime}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Icon className="w-3 h-3" />
                        <span>{conv.participantRole}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {conv.lastMessage}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <Badge variant="default" className="ml-2">
                        {conv.unreadCount}
                      </Badge>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {selectedConversation.participantName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{selectedConversation.participantName}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <RoleIcon className="w-4 h-4" />
                      <span>{selectedConversation.participantRole}</span>
                      <span className="mx-1">•</span>
                      <span>{selectedConversation.online ? "Online" : "Offline"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Mail className="w-4 h-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Provider Profile</DropdownMenuItem>
                      <DropdownMenuItem>View Client History</DropdownMenuItem>
                      <DropdownMenuItem>Schedule Meeting</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {mockMessages.map((message) => {
                const isAdmin = message.senderId === "admin";
                return (
                  <div
                    key={message.id}
                    className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        isAdmin
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div
                        className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                          isAdmin ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                        {isAdmin && <CheckCheck className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input */}
            <div className="border-t p-4">
              <div className="flex items-end gap-2">
                <Button variant="outline" size="icon" className="shrink-0">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <div className="flex-1">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[60px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                </div>
                <Button size="icon" className="shrink-0" onClick={handleSendMessage}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </Card>

      {/* Provider Info Sidebar */}
      {selectedConversation && (
        <Card className="w-72">
          <CardHeader>
            <CardTitle className="text-lg">Provider Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Avatar className="w-20 h-20 mx-auto">
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  {selectedConversation.participantName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <p className="font-semibold mt-3">{selectedConversation.participantName}</p>
              <Badge variant="outline" className="mt-1">
                {selectedConversation.participantRole}
              </Badge>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{selectedConversation.participantId.toLowerCase()}@takehealth.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>+234 801 234 5678</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>Last seen: Online</span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <p className="text-sm font-medium">Quick Actions</p>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Phone className="w-4 h-4 mr-2" />
                Call Provider
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Stethoscope className="w-4 h-4 mr-2" />
                View Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CommunicationHub;
