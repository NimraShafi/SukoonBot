"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Star, MapPin, Clock, DollarSign, CalendarIcon, Video, MessageCircle, Phone } from "lucide-react"

interface Therapist {
  id: string
  name: string
  title: string
  specialties: string[]
  languages: string[]
  rating: number
  reviews: number
  location: string
  price: number
  availability: string[]
  image?: string
  bio: string
  experience: number
}

const mockTherapists: Therapist[] = [
  {
    id: "1",
    name: "Dr. Ayesha Khan",
    title: "Clinical Psychologist",
    specialties: ["Anxiety", "Depression", "Trauma", "Family Therapy"],
    languages: ["English", "Urdu", "Hindi"],
    rating: 4.9,
    reviews: 127,
    location: "Karachi, Pakistan",
    price: 50,
    availability: ["Mon", "Wed", "Fri"],
    bio: "Dr. Ayesha Khan is a licensed clinical psychologist with over 10 years of experience helping individuals and families navigate mental health challenges.",
    experience: 10,
  },
  {
    id: "2",
    name: "Dr. Rahul Sharma",
    title: "Psychiatrist",
    specialties: ["Bipolar Disorder", "ADHD", "Anxiety", "Medication Management"],
    languages: ["English", "Hindi", "Punjabi"],
    rating: 4.8,
    reviews: 89,
    location: "Delhi, India",
    price: 75,
    availability: ["Tue", "Thu", "Sat"],
    bio: "Dr. Rahul Sharma specializes in psychiatric care with a focus on culturally sensitive treatment approaches.",
    experience: 8,
  },
  {
    id: "3",
    name: "Dr. Fatima Ali",
    title: "Marriage & Family Therapist",
    specialties: ["Couples Therapy", "Family Dynamics", "Cultural Issues"],
    languages: ["English", "Urdu", "Arabic"],
    rating: 4.7,
    reviews: 156,
    location: "Lahore, Pakistan",
    price: 60,
    availability: ["Mon", "Tue", "Thu"],
    bio: "Dr. Fatima Ali helps couples and families build stronger relationships while honoring cultural values.",
    experience: 12,
  },
]

export function TherapistMarketplace() {
  const [therapists] = useState<Therapist[]>(mockTherapists)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [showBookingModal, setShowBookingModal] = useState(false)

  const specialties = Array.from(new Set(therapists.flatMap((t) => t.specialties)))
  const languages = Array.from(new Set(therapists.flatMap((t) => t.languages)))

  const filteredTherapists = therapists.filter((therapist) => {
    const matchesSearch =
      therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      therapist.specialties.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesSpecialty = !selectedSpecialty || therapist.specialties.includes(selectedSpecialty)
    const matchesLanguage = !selectedLanguage || therapist.languages.includes(selectedLanguage)

    return matchesSearch && matchesSpecialty && matchesLanguage
  })

  const handleBooking = (therapist: Therapist) => {
    setSelectedTherapist(therapist)
    setShowBookingModal(true)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search therapists by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Specialty</label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                >
                  <option value="">All specialties</option>
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                >
                  <option value="">All languages</option>
                  {languages.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Therapist Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTherapists.map((therapist, index) => (
          <motion.div
            key={therapist.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4 mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={therapist.image || "/placeholder.svg"} />
                    <AvatarFallback>
                      {therapist.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">{therapist.name}</h3>
                    <p className="text-sm text-muted-foreground">{therapist.title}</p>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm ml-1">{therapist.rating}</span>
                      <span className="text-sm text-muted-foreground ml-1">({therapist.reviews})</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {therapist.location}
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4 mr-2" />${therapist.price}/session
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    {therapist.experience} years experience
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Specialties:</p>
                  <div className="flex flex-wrap gap-1">
                    {therapist.specialties.slice(0, 3).map((specialty) => (
                      <Badge key={specialty} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {therapist.specialties.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{therapist.specialties.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Languages:</p>
                  <div className="flex flex-wrap gap-1">
                    {therapist.languages.map((language) => (
                      <Badge key={language} variant="outline" className="text-xs">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <Button
                    onClick={() => handleBooking(therapist)}
                    className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Book Session
                  </Button>

                  <div className="grid grid-cols-3 gap-2">
                    <Button size="sm" variant="outline">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book Session with {selectedTherapist?.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-center">
              <Avatar className="w-20 h-20 mx-auto mb-4">
                <AvatarImage src={selectedTherapist?.image || "/placeholder.svg"} />
                <AvatarFallback>
                  {selectedTherapist?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold">{selectedTherapist?.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedTherapist?.title}</p>
              <p className="text-lg font-bold mt-2">${selectedTherapist?.price}/session</p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Select Date</label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                disabled={(date) => date < new Date()}
              />
            </div>

            {selectedDate && (
              <div>
                <label className="text-sm font-medium mb-2 block">Available Times</label>
                <div className="grid grid-cols-3 gap-2">
                  {["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM", "6:00 PM"].map((time) => (
                    <Button key={time} variant="outline" size="sm">
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowBookingModal(false)}>
                Cancel
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                disabled={!selectedDate}
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
