#header RESE; 2024/2025

#phrase One middle man was doing the work of thirty people. I designed and developed a web platform to fix it.

+[reseWebsite.mp4]

# Note
This article covers a web platform I designed and built solo for [RESE](https://radiorese.pt/). I also designed its visual identity, so I've added that at the end, in the last section.

# The Problem

RESE had close to 25 people making music and podcast shows. The process ran entirely by hand. Hosts recorded episodes on their own schedule. When ready, they sent the files to one person: the middle man.

#logicChain Show Hosts; Middle Man; Website.

The middle man did everything else. They named the files. They organized storage. They built the weekly schedule. They loaded shows into [PlayIt Live](https://www.playitsoftware.com/). They wrote .csv files so the website could display the schedule. Every week, solo.

Meanwhile, [Trello](https://trello.com/) started charging for teams over 10 people. We couldn't afford it, so we lost our project management tool. And the website streamed audio through an embedded Twitch player, a video streaming platform, not an audio one.

![reseOldWebsite.png]

# The New System

The priority was simple, take work off the middle man's plate. We needed a database. That meant upgrading from static hosting to a VPS. The VPS also let us self-host [Planka](https://planka.app/), which solved our project management problem.

I redesigned every step of the workflow. Some steps still needed a human. But the platform could make even those easier. The system has two account types. Admins manage everything: shows, episodes, schedules, new accounts. Members manage only their own shows.

# Submitting Episodes

Hosts log in and see their own shows. They edit show details, add episode info, and upload new episodes directly. This offloads two jobs from the middle man. First, receiving files is now automatic. Second, naming files is now the creator's job, following a team-wide naming standard.
The platform also asks for a synopsis, Spotify links, and credit for multiple creators per episode. Hosts think harder about their episodes as a result. The shows got better.

+[resePrograms.mp4]

# Managing Accounts

Admins create and edit account profiles. Each profile stores an email and phone number, so the system doubles as a contact list.

+[reseMembers.mp4]

# Downloading Episodes

The "Episodes" page tracks downloads. New episodes start as "not downloaded." Any admin can download an episode to the radio's computer and mark it done. This used to be one person's job. Now anyone can do it. And everyone can see, at a glance, what's backed up locally. No coordination needed.

+[reseEpisodes.mp4]

# Scheduling

Most shows air at the same hour, same day, every week. Only the episode changes. The scheduling page is built around that. It shows every available episode through two dropdowns (radio show, then its episodes) pulled live from the database. Before, we tracked this in a Google Sheet, cross-checked against a folder on a local computer.

You can copy last week's schedule and adjust it, since the show-per-hour structure rarely changes. You can also auto-select episodes: the system picks the least-played episode for each show, and breaks ties by choosing the older one.

+[reseSchedule.mp4]

This turned an hour of weekly work into a few clicks. And scheduling a show now publishes it straight to the website. The .csv files are gone.

# Updates

The database can hold far more than it does today. Right now, the public site only shows the live stream and the schedule. Two updates are planned.

The first is to dynamically show and episode pages, using data the database already has. The Second is to display profile pages for current and past members, including the many contributors, in design, events, and communication, who don't host a show but still built the radio.

# Project in Review

The project met its goals. Spreading the middle man's work across the team made the radio scalable. Shortly after launch, I became president of [RESE](https://radiorese.pt/). Membership doubled from about 30 to about 60 people, most joining music or podcast departments.

# Tech Stack

The platform runs on [PostgreSQL](https://www.postgresql.org/) and [SvelteKit](https://svelte.dev/). The VPS runs [Linux](https://www.linux.org/). Audio streams through [Icecast](https://icecast.org/).

# Graphic Design

The identity had one goal: look proudly online-only. People kept assuming RESE wanted a terrestrial broadcast. It never did. Six colors anchor the identity, one per department. Each uses an RGB value that can only exist on a screen, digital by nature, like the radio itself.

#endDiv
#gallery ![marcaRese.png; 1]; +[reseManuais.mp4; 2]

#startDiv

I built the identity alone at first. [Bruno Carril](https://www.instagram.com/_opiaet/) and Matilde Couto later entirely rebuilt its Instagram presence. The first three images below show the old version; the last three show the new one.

#endDiv
#gallery ![reseOldPost1.jpg; 1]; ![reseOldPost2.jpg; 1]; ![reseOldPost3.jpg; 1]
#gallery ![reseNewPost1.jpg; 1]; ![reseNewPost2.jpg; 1]; ![reseNewPost3.jpg; 1]

#startDiv

Below are more pieces I've designed for [RESE](https://radiorese.pt/) over the years. My presence in [RESE](https://radiorese.pt/) has taken up a large share of my time as a designer, so there's a lot to show.
#endDiv 
#gallery +[reseFest.mp4; 1]; ![reseFestR.jpg; 2]

#startDiv 
+[reseCeramimcs.mp4]
#endDiv 
+[reseVideoEntrada.mp4]
#startDiv
#igEmbed https://www.instagram.com/reel/DE5iwwkuUFy/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA==
#endDiv 

#gallery ![tShirtR.jpg; 2]; ![tShirtM.png; 1]

#startDiv 
#igEmbed https://www.instagram.com/p/DARZpSmoaR9/
#endDiv 