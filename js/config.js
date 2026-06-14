// js/config.js
// Supabase connection config.
// 1. Create a free project at https://supabase.com
// 2. Settings -> API -> copy "Project URL" and the "anon public" key below.
// Both are SAFE to expose in frontend code (anon key is public by design;
// Row Level Security in the database controls who can write).

const SUPABASE_URL = 'https://taaukmatdadxpaudbpxp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhYXVrbWF0ZGFkeHBhdWRicHhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0MjYxODAsImV4cCI6MjA5NzAwMjE4MH0.2vvmRCAWDuzsVLYEJVKrXG2NFj7O3V9ve7H0JcUagwU';

// Storage bucket name where project images get uploaded.
const PROJECTS_BUCKET = 'project-images';

// Admin login uses a single passcode. Behind the scenes it signs in to this
// fixed Supabase user; the "passcode" is that user's password. Create a user
// with EXACTLY this email in Supabase -> Authentication -> Users, and set its
// password to whatever passcode you want to type at admin.html.
const ADMIN_EMAIL = 'greasemike2000@gmail.com';

// Shared client (supabase-js v2 is loaded from CDN before this file).
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
