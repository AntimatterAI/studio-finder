'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { CalendarDays, Clock, MapPin, Star, Mic2, DollarSign, Users, Wifi, Car, Coffee } from 'lucide-react'

interface Studio {
  id: string
  name: string
  location: string
  image: string
  rating: number
  pricePerHour: number
  amenities: string[]
  equipment: string[]
  availability: {
    date: string
    slots: {
      time: string
      available: boolean
      price: number
    }[]
  }[]
  description: string
  capacity: number
}

interface Booking {
  id: string
  studioId: string
  studioName: string
  date: string
  time: string
  duration: number
  totalPrice: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
}

export function BookingSystem() {
  const [studios] = useState<Studio[]>([
    {
      id: '1',
      name: 'Sonic Paradise Studios',
      location: 'Los Angeles, CA',
      image: '',
      rating: 4.9,
      pricePerHour: 120,
      amenities: ['Free WiFi', 'Parking', 'Coffee/Tea', 'Lounge Area'],
      equipment: ['Pro Tools HDX', 'SSL Console', 'Neumann U87', 'Yamaha NS-10M'],
      availability: [
        {
          date: '2024-01-20',
          slots: [
            { time: '10:00', available: true, price: 120 },
            { time: '12:00', available: true, price: 120 },
            { time: '14:00', available: false, price: 120 },
            { time: '16:00', available: true, price: 120 },
            { time: '18:00', available: true, price: 140 },
            { time: '20:00', available: true, price: 140 }
          ]
        }
      ],
      description: 'Professional recording studio with state-of-the-art equipment and acoustic treatment.',
      capacity: 8
    },
    {
      id: '2',
      name: 'Underground Beats',
      location: 'Atlanta, GA',
      image: '',
      rating: 4.7,
      pricePerHour: 85,
      amenities: ['Free WiFi', 'Parking', 'Vending Machine'],
      equipment: ['Logic Pro X', 'Yamaha HS8', 'Audio-Technica AT2020', 'Native Instruments Maschine'],
      availability: [
        {
          date: '2024-01-20',
          slots: [
            { time: '10:00', available: true, price: 85 },
            { time: '12:00', available: false, price: 85 },
            { time: '14:00', available: true, price: 85 },
            { time: '16:00', available: true, price: 85 },
            { time: '18:00', available: true, price: 95 },
            { time: '20:00', available: false, price: 95 }
          ]
        }
      ],
      description: 'Hip-hop focused studio with the latest beats and production equipment.',
      capacity: 6
    }
  ])

  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedSlot, setSelectedSlot] = useState<string>('')
  const [duration, setDuration] = useState<number>(2)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [bookings] = useState<Booking[]>([
    {
      id: '1',
      studioId: '1',
      studioName: 'Sonic Paradise Studios',
      date: '2024-01-18',
      time: '14:00',
      duration: 3,
      totalPrice: 360,
      status: 'confirmed'
    },
    {
      id: '2',
      studioId: '2',
      studioName: 'Underground Beats',
      date: '2024-01-15',
      time: '16:00',
      duration: 2,
      totalPrice: 170,
      status: 'completed'
    }
  ])

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'free wifi':
        return <Wifi className="w-4 h-4" />
      case 'parking':
        return <Car className="w-4 h-4" />
      case 'coffee/tea':
        return <Coffee className="w-4 h-4" />
      default:
        return <Star className="w-4 h-4" />
    }
  }

  const calculateTotalPrice = () => {
    if (!selectedStudio || !selectedSlot) return 0
    const slot = selectedStudio.availability[0]?.slots.find(s => s.time === selectedSlot)
    return (slot?.price || 0) * duration
  }

  const handleBooking = () => {
    if (!selectedStudio || !selectedDate || !selectedSlot) return
    
    // In a real app, this would make an API call
    console.log('Booking:', {
      studioId: selectedStudio.id,
      date: selectedDate,
      time: selectedSlot,
      duration,
      totalPrice: calculateTotalPrice()
    })
    
    setShowBookingForm(false)
    // Reset form
    setSelectedStudio(null)
    setSelectedDate('')
    setSelectedSlot('')
    setDuration(2)
  }

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      case 'confirmed':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
      case 'completed':
        return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'cancelled':
        return 'text-red-400 bg-red-400/10 border-red-400/20'
    }
  }

  if (showBookingForm && selectedStudio) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="glass-neon">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              Book {selectedStudio.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Studio Info */}
            <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white">{selectedStudio.name}</h3>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-white">{selectedStudio.rating}</span>
                </div>
              </div>
              <div className="flex items-center text-gray-300 text-sm mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                {selectedStudio.location}
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <DollarSign className="w-4 h-4 mr-1" />
                ${selectedStudio.pricePerHour}/hour
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <Label className="text-white mb-2 block">Select Date</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-background/50 border-border/20"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div>
                <Label className="text-white mb-2 block">Available Time Slots</Label>
                <div className="grid grid-cols-3 gap-3">
                  {selectedStudio.availability[0]?.slots.map((slot) => (
                    <motion.button
                      key={slot.time}
                      whileHover={{ scale: slot.available ? 1.05 : 1 }}
                      whileTap={{ scale: slot.available ? 0.95 : 1 }}
                      onClick={() => slot.available && setSelectedSlot(slot.time)}
                      disabled={!slot.available}
                      className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                        selectedSlot === slot.time
                          ? 'bg-primary/20 border-primary text-primary'
                          : slot.available
                          ? 'bg-background/50 border-border/20 text-white hover:border-primary/50'
                          : 'bg-background/20 border-border/10 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <div>{slot.time}</div>
                      <div className="text-xs opacity-80">${slot.price}/hr</div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Duration */}
            {selectedSlot && (
              <div>
                <Label className="text-white mb-2 block">Duration (hours)</Label>
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDuration(Math.max(1, duration - 1))}
                    className="w-10 h-10 p-0"
                  >
                    -
                  </Button>
                  <span className="text-white font-semibold w-12 text-center">{duration}h</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDuration(Math.min(8, duration + 1))}
                    className="w-10 h-10 p-0"
                  >
                    +
                  </Button>
                </div>
              </div>
            )}

            {/* Total Price */}
            {selectedSlot && (
              <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-green-300">Total Price:</span>
                  <span className="text-green-300 font-bold text-xl">${calculateTotalPrice()}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowBookingForm(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 gradient-primary"
                onClick={handleBooking}
                disabled={!selectedDate || !selectedSlot}
              >
                Confirm Booking
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-display-lg font-display text-white mb-2">Studio Booking</h2>
          <p className="text-gray-400">Find and book professional recording studios</p>
        </div>
      </div>

      {/* My Bookings */}
      <Card className="glass-neon">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="w-5 h-5" />
            My Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookings.map((booking) => (
              <motion.div
                key={booking.id}
                className="p-4 bg-background/30 rounded-xl border border-border/20 hover:border-primary/30 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">{booking.studioName}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" />
                        {booking.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {booking.time} ({booking.duration}h)
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ${booking.totalPrice}
                      </span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Studios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {studios.map((studio) => (
          <motion.div
            key={studio.id}
            whileHover={{ scale: 1.02 }}
            className="group"
          >
            <Card className="glass-neon hover-glow cursor-pointer h-full">
              <CardContent className="p-6">
                {/* Studio Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">{studio.name}</h3>
                    <div className="flex items-center text-gray-400 text-sm mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {studio.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white">{studio.rating}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">${studio.pricePerHour}</div>
                    <div className="text-sm text-gray-400">per hour</div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">{studio.description}</p>

                {/* Equipment */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Equipment</h4>
                  <div className="flex flex-wrap gap-2">
                    {studio.equipment.slice(0, 3).map((item) => (
                      <span key={item} className="skill-tag text-xs">
                        <Mic2 className="w-3 h-3" />
                        {item}
                      </span>
                    ))}
                    {studio.equipment.length > 3 && (
                      <span className="text-xs text-gray-400">+{studio.equipment.length - 3} more</span>
                    )}
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {studio.amenities.map((amenity) => (
                      <span key={amenity} className="flex items-center gap-1 text-xs text-gray-400">
                        {getAmenityIcon(amenity)}
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Capacity */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <Users className="w-4 h-4" />
                    Up to {studio.capacity} people
                  </div>
                </div>

                {/* Book Button */}
                <Button
                  className="w-full gradient-primary hover-glow"
                  onClick={() => {
                    setSelectedStudio(studio)
                    setSelectedDate('')
                    setSelectedSlot('')
                    setDuration(2)
                    setShowBookingForm(true)
                  }}
                >
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Book Studio
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 