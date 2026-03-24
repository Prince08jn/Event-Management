import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createClient } from '@supabase/supabase-js';
import { authOptions } from '@/lib/auth-config';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      eventId,
      quantity = 1,
      amountPaise = 0,
    } = body as {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      eventId: string;
      quantity?: number;
      amountPaise?: number;
    };

    // Verify Razorpay signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ message: 'Razorpay secret not configured' }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ message: 'Invalid payment signature' }, { status: 400 });
    }

    // Create booking record
    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .insert([
        {
          event_id: eventId,
          user_email: session.user.email,
          quantity,
          amount_paise: amountPaise,
          status: 'confirmed',
          razorpay_order_id,
          razorpay_payment_id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating booking after payment:', error);
      return NextResponse.json({ message: 'Payment verified but booking failed', error }, { status: 500 });
    }

    return NextResponse.json({ booking, verified: true }, { status: 201 });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ message: 'Error verifying payment', error }, { status: 500 });
  }
}
