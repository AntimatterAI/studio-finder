'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { 
  MapPin, Star, CheckCircle, X, Headphones, Radio, RefreshCw
} from 'lucide-react'

interface BookingProvider {
  id: string
  role: 'producer' | 'studio'
  display_name: string
  bio: string
  location: string
  hourly_rate: number
  rating: number
  total_bookings: number
  verified: boolean
  availability: Record<string, unknown>
  equipment: string[]
  rooms?: Array<{
    name: string
    capacity: number
    equipment: string[]
    hourly_rate?: number
  }>
  tier_level: number
}

interface Booking {
  id: string
  provider_id: string
  provider: BookingProvider
  client_id?: string
  client_email: string
  client_name: string
  client_phone?: string
  booking_type: 'studio_session' | 'production_service' | 'mixing' | 'mastering'
  room_name?: string
  start_time: string
  end_time: string
  duration_hours: number
  hourly_rate: number
  total_amount: number
  status: 'pending' | 'approved' | 'rejected' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  special_requests?: string
  equipment_needed: string[]
  notes?: string
  provider_notes?: string
  payment_status: 'unpaid' | 'paid' | 'refunded'
  created_at: string
}

interface BookingFormData {
  booking_type: 'studio_session' | 'production_service' | 'mixing' | 'mastering'
  room_name: string
  start_date: string
  start_time: string
  duration_hours: number
  special_requests: string
  equipment_needed: string[]
  client_name: string
  client_email: string
  client_phone: string
}

export function BookingSystem() {
  const [providers, setProviders] = useState<BookingProvider[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedProvider, setSelectedProvider] = useState<BookingProvider | null>(null)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userTier, setUserTier] = useState<number>(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'producer' | 'studio'>('all')
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'bookings'>('rating')
  
  const [formData, setFormData] = useState<BookingFormData>({
    booking_type: 'studio_session',
    room_name: '',
    start_date: '',
    start_time: '',
    duration_hours: 2,
    special_requests: '',
    equipment_needed: [],
    client_name: '',
    client_email: '',
    client_phone: ''
  })

  useEffect(() => {
    loadData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    await Promise.all([fetchProviders(), fetchUserBookings(), getUserTier()])
    setIsLoading(false)
  }

  const getUserTier = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('tier_level')
          .eq('id', user.id)
          .single()
        
        if (profile) setUserTier(profile.tier_level)
      }
    } catch (error) {
      console.error('Error getting user tier:', error)
    }
  }

  const fetchProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['producer', 'studio'])
        .eq('profile_complete', true)
        .order('rating', { ascending: false })

      if (error) throw error
      
      // Filter by user's tier visibility
      const filteredProviders = (data || []).filter(provider => 
        provider.tier_level <= userTier
      )
      
      setProviders(filteredProviders)
    } catch (error) {
      console.error('Error fetching providers:', error)
    }
  }

  const fetchUserBookings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          provider:profiles!provider_id(*)
        `)
        .eq('client_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookings(data || [])
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }

  const handleBooking = async () => {
    if (!selectedProvider) return
    
    setIsSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const startDateTime = new Date(`${formData.start_date}T${formData.start_time}`)
      const endDateTime = new Date(startDateTime.getTime() + formData.duration_hours * 60 * 60 * 1000)
      
      // Calculate rate (room-specific rate takes precedence)
      let hourlyRate = selectedProvider.hourly_rate
      if (formData.room_name && selectedProvider.rooms) {
        const room = selectedProvider.rooms.find(r => r.name === formData.room_name)
        if (room?.hourly_rate) hourlyRate = room.hourly_rate
      }
      
      const totalAmount = hourlyRate * formData.duration_hours
      
      const bookingData = {
        provider_id: selectedProvider.id,
        client_id: user?.id || null,
        client_email: formData.client_email,
        client_name: formData.client_name,
        client_phone: formData.client_phone,
        booking_type: formData.booking_type,
        room_name: formData.room_name || null,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        duration_hours: formData.duration_hours,
        hourly_rate: hourlyRate,
        total_amount: totalAmount,
        special_requests: formData.special_requests || null,
        equipment_needed: formData.equipment_needed,
        status: 'pending'
      }

      const { error } = await supabase.from('bookings').insert(bookingData)
      if (error) throw error

      alert('Booking request submitted successfully! The provider will review and respond soon.')
      setShowBookingForm(false)
      setSelectedProvider(null)
      resetForm()
      await fetchUserBookings()
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Failed to submit booking. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      booking_type: 'studio_session',
      room_name: '',
      start_date: '',
      start_time: '',
      duration_hours: 2,
      special_requests: '',
      equipment_needed: [],
      client_name: '',
      client_email: '',
      client_phone: ''
    })
  }

  const addEquipment = (equipment: string) => {
    if (equipment.trim() && !formData.equipment_needed.includes(equipment.trim())) {
      setFormData(prev => ({
        ...prev,
        equipment_needed: [...prev.equipment_needed, equipment.trim()]
      }))
    }
  }

  const removeEquipment = (equipment: string) => {
    setFormData(prev => ({
      ...prev,
      equipment_needed: prev.equipment_needed.filter(e => e !== equipment)
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-blue-600 bg-blue-50'
      case 'confirmed': return 'text-green-600 bg-green-50'
      case 'completed': return 'text-emerald-600 bg-emerald-50'
      case 'rejected': return 'text-red-600 bg-red-50'
      case 'cancelled': return 'text-gray-600 bg-gray-50'
      case 'in_progress': return 'text-yellow-600 bg-yellow-50'
      default: return 'text-orange-600 bg-orange-50'
    }
  }

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.bio?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || provider.role === roleFilter
    return matchesSearch && matchesRole
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating': return b.rating - a.rating
      case 'price': return a.hourly_rate - b.hourly_rate
      case 'bookings': return b.total_bookings - a.total_bookings
      default: return 0
    }
  })

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        <span>Loading booking system...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-heading-lg font-semibold">Book Studios & Producers</h2>
          <p className="text-muted-foreground">Find and book recording sessions, production services, and more</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            Tier {userTier} Access
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by name, location, or services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          value={roleFilter} 
          onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
          className="px-3 py-2 border rounded-lg bg-background"
        >
          <option value="all">All Providers</option>
          <option value="studio">Studios</option>
          <option value="producer">Producers</option>
        </select>
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-3 py-2 border rounded-lg bg-background"
        >
          <option value="rating">Sort by Rating</option>
          <option value="price">Sort by Price</option>
          <option value="bookings">Sort by Experience</option>
        </select>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProviders.map((provider) => (
          <Card key={provider.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {provider.role === 'studio' ? (
                    <Radio className="w-5 h-5 text-blue-500" />
                  ) : (
                    <Headphones className="w-5 h-5 text-purple-500" />
                  )}
                  <CardTitle className="text-lg">{provider.display_name}</CardTitle>
                  {provider.verified && <CheckCircle className="w-4 h-4 text-green-500" />}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{provider.rating}</span>
                  <span className="text-xs text-muted-foreground">({provider.total_bookings})</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {provider.location}
                <span className="ml-auto font-semibold text-foreground">
                  ${provider.hourly_rate}/hr
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {provider.bio}
              </p>
              
              {/* Equipment/Rooms */}
              {provider.role === 'studio' && provider.rooms && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Rooms Available:</h4>
                  <div className="space-y-1">
                    {provider.rooms.slice(0, 2).map((room) => (
                      <div key={room.name} className="text-xs text-muted-foreground">
                        {room.name} • {room.capacity} people • {room.equipment.length} equipment
                      </div>
                    ))}
                    {provider.rooms.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{provider.rooms.length - 2} more rooms
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {provider.equipment && provider.equipment.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Equipment:</h4>
                  <div className="flex flex-wrap gap-1">
                    {provider.equipment.slice(0, 3).map((item) => (
                      <span key={item} className="px-2 py-1 bg-muted rounded text-xs">
                        {item}
                      </span>
                    ))}
                    {provider.equipment.length > 3 && (
                      <span className="px-2 py-1 bg-muted rounded text-xs">
                        +{provider.equipment.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              <Button 
                onClick={() => {
                  setSelectedProvider(provider)
                  setShowBookingForm(true)
                }} 
                className="w-full"
              >
                Book Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && selectedProvider && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Book {selectedProvider.display_name}</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setShowBookingForm(false)
                    setSelectedProvider(null)
                    resetForm()
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <CardDescription>
                {selectedProvider.role === 'studio' ? 'Book a recording session' : 'Book production services'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Booking Type */}
              <div className="space-y-2">
                <Label>Service Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'studio_session', label: 'Studio Session', available: selectedProvider.role === 'studio' },
                    { value: 'production_service', label: 'Production', available: true },
                    { value: 'mixing', label: 'Mixing', available: selectedProvider.role === 'producer' },
                    { value: 'mastering', label: 'Mastering', available: selectedProvider.role === 'producer' }
                  ].filter(service => service.available).map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setFormData(prev => ({ ...prev, booking_type: value as BookingFormData['booking_type'] }))}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                        formData.booking_type === value
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Room Selection (Studios only) */}
              {selectedProvider.role === 'studio' && selectedProvider.rooms && (
                <div className="space-y-2">
                  <Label>Select Room</Label>
                  <select 
                    value={formData.room_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, room_name: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg bg-background"
                  >
                    <option value="">Choose a room...</option>
                    {selectedProvider.rooms.map((room) => (
                      <option key={room.name} value={room.name}>
                        {room.name} - ${room.hourly_rate || selectedProvider.hourly_rate}/hr (Cap: {room.capacity})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                  />
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label>Duration (hours)</Label>
                <Input
                  type="number"
                  min="1"
                  max="12"
                  value={formData.duration_hours}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration_hours: Number(e.target.value) }))}
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Your Name</Label>
                  <Input
                    value={formData.client_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                    placeholder="Full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.client_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, client_email: e.target.value }))}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Phone (Optional)</Label>
                <Input
                  type="tel"
                  value={formData.client_phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, client_phone: e.target.value }))}
                  placeholder="Phone number"
                />
              </div>

              {/* Equipment Needed */}
              <div className="space-y-2">
                <Label>Equipment Needed</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add equipment (press Enter)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addEquipment(e.currentTarget.value)
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                </div>
                {formData.equipment_needed.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.equipment_needed.map((item) => (
                      <span key={item} className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-sm">
                        {item}
                        <button onClick={() => removeEquipment(item)}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Special Requests */}
              <div className="space-y-2">
                <Label>Special Requests</Label>
                <textarea
                  className="w-full p-3 border rounded-lg bg-background"
                  rows={3}
                  value={formData.special_requests}
                  onChange={(e) => setFormData(prev => ({ ...prev, special_requests: e.target.value }))}
                  placeholder="Any special requirements or requests..."
                />
              </div>

              {/* Pricing Summary */}
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Cost:</span>
                  <span className="text-xl font-bold">
                    ${(selectedProvider.hourly_rate * formData.duration_hours).toFixed(2)}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  ${selectedProvider.hourly_rate}/hr × {formData.duration_hours} hour{formData.duration_hours !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                onClick={handleBooking} 
                disabled={isSubmitting || !formData.client_name || !formData.client_email || !formData.start_date || !formData.start_time}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Booking Request'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* User's Bookings */}
      {bookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Bookings</CardTitle>
            <CardDescription>Track your booking requests and sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      {booking.provider.role === 'studio' ? (
                        <Radio className="w-6 h-6 text-blue-500" />
                      ) : (
                        <Headphones className="w-6 h-6 text-purple-500" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{booking.provider.display_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDateTime(booking.start_time)} • {booking.duration_hours}h • ${booking.total_amount}
                      </div>
                      {booking.room_name && (
                        <div className="text-xs text-muted-foreground">Room: {booking.room_name}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.replace('_', ' ')}
                    </span>
                    {booking.provider_notes && (
                                             <div className="text-xs text-muted-foreground mt-1 max-w-xs">
                         &ldquo;{booking.provider_notes}&rdquo;
                       </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 