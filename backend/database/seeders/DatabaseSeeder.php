<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Announcement;
use App\Models\Event;
use App\Models\ProjectPlan;
use App\Models\Sermon;
use App\Models\Ministry;
use App\Models\Testimony;
use App\Models\PrayerRequest;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // ----------------- USERS / DIRECTORY (FILIPINO LOCALIZED) -----------------
        $admin = User::create([
            'name' => 'Sister Elena Reyes',
            'email' => 'admin@church.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'api_token' => Str::random(60),
            'bio' => 'Church Administrator overseeing all operations, communication, and scheduling in Cordova, Cebu.',
            'profile_photo' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
            'phone' => '+63 (917) 123-4567',
        ]);

        $pastor = User::create([
            'name' => 'Pastor Samuel Santos',
            'email' => 'pastor@church.com',
            'password' => Hash::make('pastor123'),
            'role' => 'pastor',
            'api_token' => Str::random(60),
            'bio' => 'Lead Pastor dedicated to theological instruction, community pastoral care, and discipleship in Cebu.',
            'profile_photo' => 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=300',
            'phone' => '+63 (918) 987-6543',
            'twitter_url' => 'https://twitter.com/pastorsamuel',
            'facebook_url' => 'https://facebook.com/pastorsamuelsantos',
        ]);

        $treasurer = User::create([
            'name' => 'Brother Juan Dela Cruz',
            'email' => 'treasurer@church.com',
            'password' => Hash::make('treasurer123'),
            'role' => 'treasurer',
            'api_token' => Str::random(60),
            'bio' => 'Financial manager stewardly handling all church contributions, outreach funds, and mission budgets.',
            'profile_photo' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
            'phone' => '+63 (919) 345-6789',
            'facebook_url' => 'https://facebook.com/juandelacruzfinance',
            'telegram_url' => 'https://t.me/juandelacruz',
        ]);

        $maria = User::create([
            'name' => 'Maria Santos',
            'email' => 'member@church.com',
            'password' => Hash::make('member123'),
            'role' => 'member',
            'api_token' => Str::random(60),
            'bio' => 'Active choir member, small group leader, and youth community coordinator helper.',
            'profile_photo' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
            'phone' => '+63 (915) 234-5678',
            'facebook_url' => 'https://facebook.com/mariasantoschoir',
            'telegram_url' => 'https://t.me/mariasantos',
            'twitter_url' => 'https://twitter.com/mariasantos',
        ]);

        $david = User::create([
            'name' => 'David Tecson',
            'email' => 'david@church.com',
            'password' => Hash::make('member123'),
            'role' => 'member',
            'api_token' => Str::random(60),
            'bio' => 'Worship Team Director, acoustic guitarist, and music mentor in our Cordova parish.',
            'profile_photo' => 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
            'phone' => '+63 (916) 876-5432',
            'facebook_url' => 'https://facebook.com/davidtecsonworship',
        ]);

        $sarah = User::create([
            'name' => 'Sarah Dela Cruz',
            'email' => 'sarah@church.com',
            'password' => Hash::make('member123'),
            'role' => 'member',
            'api_token' => Str::random(60),
            'bio' => 'Youth Ministry Coordinator, community organizer, and academic mentor.',
            'profile_photo' => 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
            'phone' => '+63 (920) 765-4321',
            'twitter_url' => 'https://twitter.com/sarahyouthcebu',
        ]);

        // ----------------- ANNOUNCEMENTS -----------------
        Announcement::create([
            'title' => 'Weekly Home Fellowship Groups Starting',
            'content' => 'Join one of our mid-week Home Fellowship groups starting next Tuesday! These smaller groups are the perfect place to build deeper friendships, study Scripture together, and support one another in prayer. Locations are hosted across north, south, and central Cordova districts.',
            'date' => Carbon::now()->toDateString(),
            'created_by' => $admin->id,
        ]);

        Announcement::create([
            'title' => 'Annual Food & Shelter Clothing Drive',
            'content' => 'Our local outreach center in Cebu is experiencing a high demand for non-perishable goods and seasonal winter clothing. We are accepting canned goods, rice packs, and clean jackets in the church foyer until next Sunday. Thank you for your incredible generosity!',
            'date' => Carbon::now()->subDays(2)->toDateString(),
            'created_by' => $admin->id,
        ]);

        Announcement::create([
            'title' => 'New Audio & Live-Stream Volunteer Team',
            'content' => 'We are expanding our tech and production team! No prior experience is necessary; full training on soundboards, dynamic camera operations, and broadcast streaming software will be provided. If you love media and tech, sign up today in the lobby or email media@gracechurch.org.',
            'date' => Carbon::now()->subDays(5)->toDateString(),
            'created_by' => $admin->id,
        ]);

        // ----------------- EVENTS (STABLE 100% ACTIVE UNSPLASH IMAGES) -----------------
        Event::create([
            'title' => 'Sunday Morning Fellowship Service',
            'description' => 'A weekly celebration focusing on corporate worship, unified prayer, and an inspiring sermon from our Lead Pastor. Free coffee and childcare are provided in the main hall. Everyone is welcome to join us in fellowship!',
            'date' => Carbon::now()->addDays(3)->toDateString(),
            'image' => 'https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&q=80&w=800', // Traditional warm church sanctuary
            'created_by' => $pastor->id,
        ]);

        Event::create([
            'title' => 'Youth Summer Camp 2026',
            'description' => 'A life-changing 4-day summer camp event in the beautiful mountain retreats of Redwood Valley. Perfect for students in grades 6-12 featuring outdoor recreation, customized small group discussions, team challenges, and inspirational guest speakers.',
            'date' => Carbon::now()->addDays(45)->toDateString(),
            'image' => 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=800', // Yellow illuminated tent in dark forest (extremely stable)
            'created_by' => $admin->id,
        ]);

        Event::create([
            'title' => 'Worship & Arts Evening of Praise',
            'description' => 'Join the choir and live worship band for an intimate night dedicated purely to prayer, praise, and corporate reflection. The nursery will be open for toddlers, and a dessert social will follow in the courtyard afterwards.',
            'date' => Carbon::now()->addDays(12)->toDateString(),
            'image' => 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800', // Worship crowd raising hands
            'created_by' => $pastor->id,
        ]);

        // ----------------- PROJECT PLANS -----------------
        ProjectPlan::create([
            'title' => 'Sanctuary Sound & Lighting Upgrade',
            'description' => 'An essential initiative to modernize our auditorium sound system, installing linear-array speakers, low-noise amplifiers, and energy-efficient LED stage lighting. This will greatly improve our hybrid virtual streaming experience and audio clarity during services.',
            'target_amount' => 250000.00,
            'current_amount' => 194500.00,
        ]);

        ProjectPlan::create([
            'title' => 'Building Accessibility Widening & Ramping',
            'description' => 'Ensuring our physical sanctuary is fully welcoming to all members. This project involves grading the front walkways, constructing automatic doors, installing ADA-compliant handrails, and updating our children wing ramps.',
            'target_amount' => 120000.00,
            'current_amount' => 45200.00,
        ]);

        ProjectPlan::create([
            'title' => 'Global Community Medical Mission Trip',
            'description' => 'Sponsoring a team of doctors, pediatricians, and nurses to travel to rural communities in East Africa. Funding will cover flight logistics, surgical kits, fresh water filtration drums, and local clinic support.',
            'target_amount' => 400000.00,
            'current_amount' => 312000.00,
        ]);

        // ----------------- SERMONS -----------------
        Sermon::create([
            'title' => 'Walking in Abundant & Undeserved Grace',
            'speaker' => 'Pastor Samuel Santos',
            'date' => Carbon::now()->subDays(7)->toDateString(),
            'description' => 'A deep exploration into the biblical definition of grace and how accepting undeserved love frees us to love others with authenticity and forgiveness.',
            'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'audio_url' => 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            'notes_url' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            'thumbnail_url' => 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&q=80&w=600',
        ]);

        Sermon::create([
            'title' => 'Building Community in Fractured Times',
            'speaker' => 'Pastor Samuel Santos',
            'date' => Carbon::now()->subDays(14)->toDateString(),
            'description' => 'Examining historical and theological blueprints for building deep, loving community networks that cross socio-political barriers to cultivate unity.',
            'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'audio_url' => 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
            'notes_url' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            'thumbnail_url' => 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=600',
        ]);

        Sermon::create([
            'title' => 'The Audacious Power of Persistent Prayer',
            'speaker' => 'Sarah Dela Cruz',
            'date' => Carbon::now()->subDays(21)->toDateString(),
            'description' => 'Looking at Luke 11 to study why bold, repeated petition in prayer changes our inner focus and opens doors of restoration in our neighborhoods.',
            'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'audio_url' => 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
            'notes_url' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            'thumbnail_url' => 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&q=80&w=600',
        ]);

        // ----------------- MINISTRIES (STABLE 100% ACTIVE UNSPLASH IMAGES) -----------------
        Ministry::create([
            'name' => 'Worship & Arts Collective',
            'description' => 'A team of musicians, singers, lyricists, visual artists, and dynamic media technicians dedicated to hosting beautiful worship experiences and expressions.',
            'leader_name' => 'David Tecson',
            'contact_email' => 'worship@gracechurch.org',
            'image_url' => 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600', // Close up mic
        ]);

        Ministry::create([
            'name' => 'Grace Kids (Childrens Ministry)',
            'description' => 'Creating interactive, safe, and biblically-grounded weekly activities for local Cebuano children from infants through 5th grade to discover God\'s love.',
            'leader_name' => 'Sarah Dela Cruz',
            'contact_email' => 'kids@gracechurch.org',
            'image_url' => 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600', // Joyful children smiling
        ]);

        Ministry::create([
            'name' => 'Grace Youth Network',
            'description' => 'Supporting high school and college students with weekly large-group meetings, retreats, community service hours, and supportive mentors.',
            'leader_name' => 'Maria Santos',
            'contact_email' => 'youth@gracechurch.org',
            'image_url' => 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=600', // Warm group of Asian youth smiling
        ]);

        Ministry::create([
            'name' => 'Local Outreach & Compassion',
            'description' => 'Serving local soup kitchens, hosting food pantry drives, assisting shelter needs, and facilitating weekly street care kits for our homeless neighbors in Cordova.',
            'leader_name' => 'Brother Juan Dela Cruz',
            'contact_email' => 'compassion@gracechurch.org',
            'image_url' => 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=600', // Caring volunteering outreach hands
        ]);

        // ----------------- TESTIMONIES -----------------
        Testimony::create([
            'user_id' => $maria->id,
            'author_name' => 'Maria Santos',
            'content' => 'When my family went through a major health crisis, the Grace Church community brought us daily meals, coordinated grocery runs, and prayed with us relentlessly. I have never experienced such tangible, life-giving Christ-like love in action before.',
            'amen_count' => 14,
        ]);

        Testimony::create([
            'user_id' => $david->id,
            'author_name' => 'David Tecson',
            'content' => 'Stepping into the Worship Team allowed me to find healing from severe social anxiety. The grace, warmth, and non-judgmental environment of these people helped me regain my confidence and discover a deep sense of divine purpose in my music.',
            'amen_count' => 8,
        ]);

        // ----------------- PRAYER REQUESTS -----------------
        PrayerRequest::create([
            'user_id' => $maria->id,
            'content' => 'Please join me in praying for my mother who is undergoing surgery next Thursday. Praying for surgeon precision, quick recovery, and peace of mind during this stressful season.',
            'is_public' => true,
            'pray_count' => 12,
        ]);

        PrayerRequest::create([
            'user_id' => null,
            'content' => 'Requesting silent prayer as I enter final-stage job interviews tomorrow. Praying for peace and clarity to know which path aligns best with my family\'s needs.',
            'is_public' => true,
            'pray_count' => 4,
        ]);
    }
}
