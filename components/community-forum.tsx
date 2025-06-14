"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Heart, MessageCircle, Users, Clock, Shield, Filter } from "lucide-react"

interface ForumPost {
  id: string
  title: string
  content: string
  author: string
  timestamp: Date
  category: string
  likes: number
  replies: number
  isAnonymous: boolean
  tags: string[]
}

interface ChatRoom {
  id: string
  name: string
  description: string
  members: number
  isActive: boolean
  category: string
}

const mockPosts: ForumPost[] = [
  {
    id: "1",
    title: "Dealing with anxiety during job interviews",
    content:
      "I have been struggling with severe anxiety whenever I have job interviews. My heart races and I forget everything I wanted to say. Has anyone found effective techniques to manage this?",
    author: "Anonymous",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    category: "Anxiety",
    likes: 12,
    replies: 8,
    isAnonymous: true,
    tags: ["anxiety", "career", "coping"],
  },
  {
    id: "2",
    title: "Meditation helped me through depression",
    content:
      "I wanted to share my experience with meditation. After 6 months of daily practice, I have noticed significant improvements in my mood and overall mental health.",
    author: "WellnessSeeker",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    category: "Success Stories",
    likes: 24,
    replies: 15,
    isAnonymous: false,
    tags: ["meditation", "depression", "success"],
  },
  {
    id: "3",
    title: "Supporting a family member with mental health issues",
    content:
      "My brother has been going through a difficult time with his mental health. I want to be supportive but I am not sure how to help without being overwhelming. Any advice?",
    author: "CaringBrother",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    category: "Family Support",
    likes: 18,
    replies: 22,
    isAnonymous: false,
    tags: ["family", "support", "advice"],
  },
]

const mockChatRooms: ChatRoom[] = [
  {
    id: "1",
    name: "Daily Check-in",
    description: "Share how you are feeling today",
    members: 156,
    isActive: true,
    category: "General",
  },
  {
    id: "2",
    name: "Anxiety Support",
    description: "Safe space for anxiety discussions",
    members: 89,
    isActive: true,
    category: "Support",
  },
  {
    id: "3",
    name: "Mindfulness & Meditation",
    description: "Discuss meditation practices and mindfulness",
    members: 124,
    isActive: false,
    category: "Wellness",
  },
]

export function CommunityForum() {
  const [posts] = useState<ForumPost[]>(mockPosts)
  const [chatRooms] = useState<ChatRoom[]>(mockChatRooms)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [showNewPostModal, setShowNewPostModal] = useState(false)
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "",
    isAnonymous: true,
    tags: "",
  })

  const categories = Array.from(new Set(posts.map((p) => p.category)))

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCreatePost = () => {
    console.log("Creating post:", newPost)
    setShowNewPostModal(false)
    setNewPost({
      title: "",
      content: "",
      category: "",
      isAnonymous: true,
      tags: "",
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Community Support</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Connect with others in a safe, supportive environment
              </p>
            </div>
            <Button
              onClick={() => setShowNewPostModal(true)}
              className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="posts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts">Discussion Posts</TabsTrigger>
          <TabsTrigger value="chat">Chat Rooms</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="">All categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts */}
          <div className="space-y-4">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{post.content}</p>
                      </div>
                      <Badge variant="outline">{post.category}</Badge>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">
                              {post.isAnonymous ? "A" : post.author.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{post.isAnonymous ? "Anonymous" : post.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.timestamp.toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          <Heart className="w-4 h-4 mr-1" />
                          {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {post.replies}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chatRooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{room.name}</h3>
                        <p className="text-sm text-muted-foreground">{room.description}</p>
                      </div>
                      {room.isActive && <div className="w-3 h-3 bg-green-500 rounded-full"></div>}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{room.members} members</span>
                      </div>
                      <Badge variant={room.isActive ? "default" : "secondary"}>
                        {room.isActive ? "Active" : "Quiet"}
                      </Badge>
                    </div>

                    <Button className="w-full mt-4" variant="outline">
                      Join Room
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* New Post Modal */}
      <Dialog open={showNewPostModal} onOpenChange={setShowNewPostModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Title</label>
              <Input
                placeholder="What would you like to discuss?"
                value={newPost.title}
                onChange={(e) => setNewPost((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <select
                value={newPost.category}
                onChange={(e) => setNewPost((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Content</label>
              <Textarea
                placeholder="Share your thoughts, experiences, or questions..."
                value={newPost.content}
                onChange={(e) => setNewPost((prev) => ({ ...prev, content: e.target.value }))}
                className="min-h-[120px]"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Tags (comma separated)</label>
              <Input
                placeholder="anxiety, support, coping"
                value={newPost.tags}
                onChange={(e) => setNewPost((prev) => ({ ...prev, tags: e.target.value }))}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={newPost.isAnonymous}
                onChange={(e) => setNewPost((prev) => ({ ...prev, isAnonymous: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="anonymous" className="text-sm flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Post anonymously</span>
              </label>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowNewPostModal(false)}>
                Cancel
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                onClick={handleCreatePost}
                disabled={!newPost.title.trim() || !newPost.content.trim()}
              >
                Create Post
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
