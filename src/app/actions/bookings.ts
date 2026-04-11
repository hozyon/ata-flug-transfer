'use server'

import { createClient } from '../../utils/supabase/server'
import { Booking } from '../../types'
import { revalidatePath } from 'next/cache'

function rowToBooking(row: Record<string, unknown>): Booking {
    return {
        id: row.id as string,
        customerName: row.customer_name as string,
        phone: row.phone as string,
        email: (row.email as string) || undefined,
        pickup: row.pickup as string,
        destination: row.destination as string,
        date: row.date as string,
        time: row.time as string,
        passengers: row.passengers as number,
        vehicleId: row.vehicle_id as string,
        status: row.status as Booking['status'],
        totalPrice: Number(row.total_price),
        createdAt: row.created_at as string,
        notes: (row.notes as string) || undefined,
        flightNumber: (row.flight_number as string) || undefined,
    }
}

function bookingToRow(b: Partial<Booking>) {
    return {
        customer_name: b.customerName,
        phone: b.phone,
        email: b.email || null,
        pickup: b.pickup,
        destination: b.destination,
        date: b.date,
        time: b.time,
        passengers: b.passengers,
        vehicle_id: b.vehicleId,
        status: b.status,
        total_price: b.totalPrice,
        notes: b.notes || null,
        flight_number: b.flightNumber || null,
    }
}

export async function addBooking(partialBooking: Partial<Booking>) {
    const supabase = await createClient()
    
    // Public action (customers can create bookings)
    const { data, error } = await supabase
        .from('bookings')
        .insert(bookingToRow(partialBooking))
        .select()
        .single()

    if (error) {
        console.error('Failed to add booking:', error)
        throw new Error(error.message)
    }

    revalidatePath('/admin')
    return rowToBooking(data as Record<string, unknown>)
}

export async function updateBookingStatus(id: string, status: Booking['status']) {
    const supabase = await createClient()
    
    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id)

    if (error) {
        console.error('Failed to update booking status:', error)
        throw new Error(error.message)
    }

    revalidatePath('/admin')
}

export async function deleteBooking(id: string) {
    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Failed to delete booking:', error)
        throw new Error(error.message)
    }

    revalidatePath('/admin')
}
