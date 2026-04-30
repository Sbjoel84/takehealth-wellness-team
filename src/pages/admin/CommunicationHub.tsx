import { useState, useEffect, useRef, useCallback } from "react";
import {
  Send, Search, Phone, Mail, MessageSquare, User, Clock, CheckCheck,
  Paperclip, MoreVertical, Stethoscope, Brain, Dumbbell, Sparkles, Salad, Activity,
  AlertCircle, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { messagingService } from "@/services/messagingService";
import { ApiError } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
  isOwn: boolean;
}

const roleIcons: Record<string, React.ElementType> = {
  Counselling: Brain,
  "Dental Care": Activity,
  "Fitness & Gym": Dumbbell,
  "Skin Care": Sparkles,
  Rehabilitation: Activity,
  Nutrition: Salad,
};

function normalizeConversations(raw: unknown): Conversation[] {
  const list: unknown[] = Array.isArray(raw)
    ? raw
    : Array.isArray((raw as Record<string, unknown>)?.data)
    ? ((raw as Record<string, unknown>).data as unknown[])
    : [];

  return list.map((item) => {
    const c = item as Record<string, unknown>;
    const participant =
      (c.participant as Record<string, unknown>) ||
      ((c.participants as unknown[])?.[0] as Record<string, unknown>) ||
      {};

    const lastMsg = c.lastMessage;
    const lastMsgContent =
      typeof lastMsg === "string"
        ? lastMsg
        : typeof (lastMsg as Record<string, unknown>)?.content === "string"
        ? ((lastMsg as Record<string, unknown>).content as string)
        : "";

    const lastMsgTime =
      (c.lastMessageTime as string) ||
      (c.updatedAt as string) ||
      (c.createdAt as string) ||
      "";

    return {
      id: String(c.id || ""),
      participantId: String(participant.id || c.participantId || ""),
      participantName: String(participant.name || c.name || c.participantName || "Unknown"),
      participantRole: String(participant.role || c.type || c.participantRole || ""),
      lastMessage: lastMsgContent,
      lastMessageTime: lastMsgTime
        ? new Date(lastMsgTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "",
      unreadCount: Number(c.unreadCount ?? 0),
      online: Boolean(c.isOnline ?? c.online ?? false),
    };
  });
}

function normalizeMessages(raw: unknown): Message[] {
  const list: unknown[] = Array.isArray(raw)
    ? raw
    : Array.isArray((raw as Record<string, unknown>)?.data)
    ? ((raw as Record<string, unknown>).data as unknown[])
    : Array.isArray((raw as Record<string, unknown>)?.messages)
    ? ((raw as Record<string, unknown>).messages as unknown[])
    : [];

  return list.map((item) => {
    const m = item as Record<string, unknown>;
    const sender = (m.sender as Record<string, unknown>) || {};
    const senderId = String(m.senderId || sender.id || "");
    return {
      id: String(m.id || Math.random()),
      senderId,
      senderName: String(sender.name || m.senderName || senderId),
      content: String(m.content || ""),
      createdAt: String(m.createdAt || m.timestamp || new Date().toISOString()),
      isOwn: Boolean(m.isOwn ?? m.isMine ?? false),
    };
  });
}

const CommunicationHub = () => {
  const { toast } = useToast();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [convsLoading, setConvsLoading] = useState(true);
  const [convsError, setConvsError] = useState<string | null>(null);

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [msgsLoading, setMsgsLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = useCallback(async () => {
    setConvsLoading(true);
    setConvsError(null);
    try {
      const res = await messagingService.getConversations();
      setConversations(normalizeConversations(res));
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to load conversations";
      setConvsError(msg);
    } finally {
      setConvsLoading(false);
    }
  }, []);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  useEffect(() => {
    if (!selectedConversation) return;
    const fetchMessages = async () => {
      setMsgsLoading(true);
      try {
        const res = await messagingService.getMessages(selectedConversation.id);
        setMessages(normalizeMessages(res));
      } catch {
        setMessages([]);
      } finally {
        setMsgsLoading(false);
      }
    };
    fetchMessages();
  }, [selectedConversation?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    const content = newMessage.trim();
    if (!content || !selectedConversation || isSending) return;

    setIsSending(true);
    const optimisticMsg: Message = {
      id: `opt-${Date.now()}`,
      senderId: "me",
      senderName: "Admin",
      content,
      createdAt: new Date().toISOString(),
      isOwn: true,
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    setNewMessage("");

    try {
      const res = await messagingService.sendMessage(selectedConversation.id, content);
      const sent = res as Record<string, unknown>;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === optimisticMsg.id
            ? { ...optimisticMsg, id: String(sent?.id || optimisticMsg.id) }
            : m
        )
      );
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedConversation.id
            ? { ...c, lastMessage: content, lastMessageTime: "Just now" }
            : c
        )
      );
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
      const msg = err instanceof ApiError ? err.message : "Failed to send message";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsSending(false);
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.participantName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || conv.participantRole === filterRole;
    return matchesSearch && matchesRole;
  });

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
  const RoleIcon = selectedConversation
    ? roleIcons[selectedConversation.participantRole] ?? User
    : User;

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Conversations List */}
      <Card className="w-80 flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Messages</span>
            <Badge variant="secondary">{totalUnread} unread</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-0">
          <div className="p-4 pt-0 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
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

          {convsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : convsError ? (
            <div className="px-4 pb-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">{convsError}</AlertDescription>
              </Alert>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm px-4">
              {conversations.length === 0 ? "No conversations yet" : "No results match your search"}
            </div>
          ) : (
            <div className="divide-y">
              {filteredConversations.map((conv) => {
                const Icon = roleIcons[conv.participantRole] ?? User;
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
                            {conv.participantName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
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
                        <p className="text-sm text-muted-foreground truncate mt-1">{conv.lastMessage}</p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <Badge variant="default" className="ml-2">{conv.unreadCount}</Badge>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        {selectedConversation ? (
          <>
            <CardHeader className="border-b shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {selectedConversation.participantName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
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
                  <Button variant="outline" size="icon"><Phone className="w-4 h-4" /></Button>
                  <Button variant="outline" size="icon"><Mail className="w-4 h-4" /></Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon"><MoreVertical className="w-4 h-4" /></Button>
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

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {msgsLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No messages yet. Say hello!</p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        msg.isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <div
                        className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                          msg.isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        {msg.isOwn && <CheckCheck className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t p-4 shrink-0">
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
                <Button
                  size="icon"
                  className="shrink-0"
                  onClick={handleSendMessage}
                  disabled={isSending || !newMessage.trim()}
                >
                  {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
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
                  {selectedConversation.participantName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <p className="font-semibold mt-3">{selectedConversation.participantName}</p>
              <Badge variant="outline" className="mt-1">{selectedConversation.participantRole}</Badge>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{selectedConversation.online ? "Online now" : "Offline"}</span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <p className="text-sm font-medium">Quick Actions</p>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Mail className="w-4 h-4 mr-2" />Send Email
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Phone className="w-4 h-4 mr-2" />Call Provider
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Stethoscope className="w-4 h-4 mr-2" />View Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CommunicationHub;
