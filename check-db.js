const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tvshjxsmblndqefnteqa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2c2hqeHNtYmxuZHFlZm50ZXFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MzAwNzIsImV4cCI6MjA4NTEwNjA3Mn0.tv4LIBqIWMn7ME7eyiMy0WgZBChvC4EdprbWxZL7D4I';

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkEvents() {
    console.log(`Checking events at ${supabaseUrl}...`);
    const { data, count, error } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('Error checking events:', error.message);
        if (error.code === 'PGRST116') {
            console.log('The "events" table might not exist.');
        }
    } else {
        console.log(`Number of events in database: ${count}`);
    }
}

checkEvents();
