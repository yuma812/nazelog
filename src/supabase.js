import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lgjlcntsqbfxvuvbjykj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnamxjbnRzcWJmeHZ1dmJqeWtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NTY1MTMsImV4cCI6MjA5NTQzMjUxM30.w_V5zlGGmZ6EcMKqxeLSb0yPNl0KnIkmqnXC8juMm30'

export const supabase = createClient(supabaseUrl, supabaseKey)