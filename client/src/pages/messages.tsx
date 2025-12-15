import { useState } from "react";
import { Link } from "wouter";
import { MessageSquare, Search, Send, User, Building2, Clock, Check, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "@/hooks/use-translation";
import { useAppStore } from "@/lib/store";

const mockConversations = [
  {
    id: "1",
    name: "شركة التقنية المتقدمة",
    avatar: null,
    lastMessage: "شكراً لاهتمامك، سنتواصل معك قريباً",
    time: "10:30",
    unread: 2,
    isCompany: true,
  },
  {
    id: "2",
    name: "معهد التدريب المهني",
    avatar: null,
    lastMessage: "متى يمكنك البدء بالتدريب؟",
    time: "أمس",
    unread: 0,
    isCompany: true,
  },
  {
    id: "3",
    name: "أحمد محمد",
    avatar: null,
    lastMessage: "أرسلت لك السيرة الذاتية",
    time: "الأسبوع الماضي",
    unread: 0,
    isCompany: false,
  },
];

const mockMessages = [
  { id: "1", senderId: "company", content: "مرحباً، شكراً لتقديمك على الوظيفة", time: "10:00", isRead: true },
  { id: "2", senderId: "me", content: "شكراً لكم، أنا متحمس جداً لهذه الفرصة", time: "10:15", isRead: true },
  { id: "3", senderId: "company", content: "هل يمكنك إخبارنا المزيد عن خبرتك في React؟", time: "10:20", isRead: true },
  { id: "4", senderId: "me", content: "بالتأكيد! لدي خبرة 3 سنوات في تطوير تطبيقات React", time: "10:25", isRead: true },
  { id: "5", senderId: "company", content: "شكراً لاهتمامك، سنتواصل معك قريباً", time: "10:30", isRead: false },
];

export default function Messages() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAppStore();
  const [selectedConversation, setSelectedConversation] = useState<string | null>("1");
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-4">{t("messages")}</h1>
        <p className="text-muted-foreground mb-6">Please login to view your messages</p>
        <Link href="/login">
          <Button data-testid="button-go-login">{t("login")}</Button>
        </Link>
      </div>
    );
  }

  const selectedChat = mockConversations.find((c) => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setNewMessage("");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">{t("messages")}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)] min-h-[500px]">
        <Card className="lg:col-span-1">
          <CardContent className="p-0 h-full flex flex-col">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t("search")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ps-10"
                  data-testid="input-search-messages"
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="divide-y">
                {mockConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    className={`w-full p-4 text-start hover-elevate transition-colors ${
                      selectedConversation === conversation.id ? "bg-muted" : ""
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                    data-testid={`conversation-${conversation.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.avatar || undefined} />
                        <AvatarFallback>
                          {conversation.isCompany ? <Building2 className="h-5 w-5" /> : <User className="h-5 w-5" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium truncate">{conversation.name}</span>
                          <span className="text-xs text-muted-foreground shrink-0">{conversation.time}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-1">
                          <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                          {conversation.unread > 0 && (
                            <Badge className="h-5 w-5 p-0 flex items-center justify-center text-xs shrink-0">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="p-0 h-full flex flex-col">
            {selectedChat ? (
              <>
                <div className="p-4 border-b flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {selectedChat.isCompany ? <Building2 className="h-5 w-5" /> : <User className="h-5 w-5" />}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{selectedChat.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {selectedChat.isCompany ? t("employer") : t("individual")}
                    </p>
                  </div>
                </div>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {mockMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === "me" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.senderId === "me"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                          data-testid={`message-${message.id}`}
                        >
                          <p>{message.content}</p>
                          <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                            message.senderId === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}>
                            <span>{message.time}</span>
                            {message.senderId === "me" && (
                              message.isRead ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="min-h-[44px] max-h-[120px] resize-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      data-testid="textarea-message"
                    />
                    <Button onClick={handleSendMessage} data-testid="button-send">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
