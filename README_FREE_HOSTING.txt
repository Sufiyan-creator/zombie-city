# Zombie City — FREE PC + Mobile Multiplayer Lobby Project

## Cost
This project is free to download and test. The included Render free-tier configuration is intended for testing, not guaranteed 24/7 hosting. Free web services can sleep after inactivity and may take a little time to wake. Availability, limits, and free-plan eligibility can change; check the hosting provider's current dashboard before deploying. No paid plan is required for the instructions below.

## Players do not install anything
Only the hosting server runs Node.js. Players open the hosted website URL in a browser on PC or phone. They do not download this ZIP, install Node.js, or install JavaScript files.

## Deploy on Render's free tier
1. Download and extract this ZIP.
2. Create a GitHub account if needed, then create a repository. You can make it private.
3. Upload the project files from the extracted folder to the repository's main/root folder. Keep the filenames.
4. Open Render and sign in. Choose **New + → Web Service** (or Blueprint if the dashboard offers it for your account) and connect the GitHub repository.
5. If using Web Service, choose:
   - Runtime: Node
   - Build command: `npm install`
   - Start command: `npm start`
   - Instance type: **Free**
6. If using Blueprint, select the repository containing `render.yaml`; the included file specifies `plan: free`.
7. Start deployment and wait until the service is live. Render will show a public HTTPS URL.
8. Open that URL on your PC or phone. Share the same URL with friends. Tap **Create Lobby** or choose a public lobby and tap **Join**.

## Test the server
Open `https://YOUR-SERVICE-ADDRESS/health` (replace with your actual Render address). A healthy server responds with JSON containing `ok: true`.

## Free-tier limitations
- Free hosting is not a 24/7 guarantee. The service may sleep when idle and wake when someone visits; joining may be delayed during wake-up.
- A free instance may have usage limits or temporary availability restrictions. Check the current provider dashboard.
- Rooms and player state are stored in server memory. If the service restarts or sleeps/restarts, rooms may be lost and players may need to create/join again.
- This is a lobby/player-relay prototype. It relays player positions and shot events, but zombies, bandits, loot, resources, base structures, turrets, day/night and Blood Moon are not yet synchronized as one shared world.

## Local testing (no hosting)
Install Node.js 18+ on the computer running the server, open the project folder in a terminal, and run:
    npm install
    npm start
Then open `http://localhost:3000` on that computer. This is for local testing; friends on other networks need a hosted public URL.

## Safety
Do not share passwords, recovery codes, payment details, or private access tokens in chat. If a hosting site asks for a payment method or paid upgrade, stop and ask a parent/guardian before continuing.
