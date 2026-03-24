import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createClient } from '@supabase/supabase-js';
import { authOptions } from '@/lib/auth-config';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { eventId, quantity = 1 } = body as { eventId: string; quantity?: number };

    if (!eventId || !quantity || quantity <= 0) {
      return NextResponse.json({ message: 'Invalid booking data' }, { status: 400 });
    }

    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .insert([
        {
          event_id: eventId,
          user_email: session.user.email,
          quantity,
          amount_paise: 0,
          status: 'confirmed',
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ message: 'Failed to create free booking', error }, { status: 500 });
    }

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating free booking', error }, { status: 500 });
  }
}


