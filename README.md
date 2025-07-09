# Family Feud Game

A real-time Family Feud game for family gatherings, built with Next.js and PubNub.

## Features

- Admin interface to control the game
- Live board display for the audience
- Real-time updates using PubNub
- Question selection from a database of questions
- Wrong answer tracking (X's)

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd patrick-family-feud
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Create a `.env.local` file in the root directory with your PubNub keys:

```
NEXT_PUBLIC_PUBNUB_PUBLISH_KEY=your_pubnub_publish_key
NEXT_PUBLIC_PUBNUB_SUBSCRIBE_KEY=your_pubnub_subscribe_key
```

You can sign up for a free PubNub account at [pubnub.com](https://www.pubnub.com/), or use the default "demo" keys for testing.

## Running the App

1. Start the development server:

```bash
npm run dev
# or
yarn dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser to see the home page.

3. Open the Admin Dashboard and Live Board on separate devices/screens:
   - Admin Dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)
   - Live Board: [http://localhost:3000/live](http://localhost:3000/live)

## How to Play

### Admin Dashboard:

- Select a question from the list
- Click on answers to reveal them on the live board
- Use the "Add X" button to mark wrong answers
- "Reset X's" to clear wrong answers
- "End Round" to finish the current round

### Live Board:

- Displays the current question and answers as they are revealed
- Shows X's for wrong answers

## Customizing Questions

Questions are stored in `src/data.json`. You can modify this file to add your own questions and answers.

Each question should follow this format:

```json
{
  "id": 1,
  "question": "Your question here?",
  "answers": [
    { "answer": "Top answer", "points": 30 },
    { "answer": "Second answer", "points": 25 },
    { "answer": "Third answer", "points": 20 },
    { "answer": "Fourth answer", "points": 15 },
    { "answer": "Fifth answer", "points": 10 }
  ]
}
```

## License

MIT
# patrick-family-feud
