# Cartas - Mail Exchange Application

A Next.js 16 web application that enables two people to exchange emails between them with a vintage sunflower aesthetic.

## Features

- **Two-User Password Authentication**: Secure login with pre-hashed passwords
- **Rich Text Email Composer**: Full-featured editor with bold, italic, underline, links, text alignment, and colors
- **Edit/Delete Window**: Authors can edit or delete their emails within 5 minutes of posting
- **Search Functionality**: Client-side search across email subjects and content
- **Pagination**: 15 emails per page for easy browsing
- **Dark/Light Mode**: Sunflower vintage theme with automatic persistence
- **Responsive Design**: Mobile-first, fully adaptive layout
- **Session-Based Auth**: No password persistence - reloading requires re-authentication

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: MongoDB with native driver
- **UI Library**: Material-UI (MUI) v6
- **Rich Text**: Tiptap v2
- **Authentication**: JWT with httpOnly cookies (jose library)
- **Password Hashing**: bcrypt
- **HTML Sanitization**: sanitize-html
- **Language**: TypeScript

## Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB instance)

## Setup Instructions

### 1. Clone and Install

\`\`\`bash
cd /path/to/exchange
npm install
\`\`\`

### 2. Configure MongoDB

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user with read/write permissions
3. Whitelist your IP or use `0.0.0.0/0` for serverless deployments
4. Get your connection string

### 3. Environment Variables

Copy the example environment file:

\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Edit `.env.local` and update:

- **MONGODB_URI**: Your MongoDB connection string
- **JWT_SECRET**: Generate with `openssl rand -base64 32`
- **USER_1_PASSWORD_HASH** & **USER_2_PASSWORD_HASH**: Pre-configured for development

#### Passwords

To change passwords, generate new bcrypt hashes:

\`\`\`bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('your-new-password', 10, (err, hash) => { if (err) throw err; console.log(hash); });"
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) and log in with one of the passwords above.

## Deployment to Vercel

### 1. Push to Git

\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
\`\`\`

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository
4. Configure environment variables in project settings:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `USER_1_PASSWORD_HASH`
   - `USER_2_PASSWORD_HASH`
5. Deploy!

### 3. MongoDB Atlas Whitelist

In MongoDB Atlas, update Network Access to allow connections from `0.0.0.0/0` (all IPs) for Vercel serverless functions.

## Project Structure

\`\`\`
exchange/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts       # Password authentication
│   │   │   ├── logout/route.ts      # Clear session
│   │   │   └── me/route.ts          # Get current user
│   │   └── emails/
│   │       ├── route.ts             # GET/POST emails
│   │       └── [id]/route.ts        # PUT/DELETE email
│   ├── login/
│   │   └── page.tsx                 # Login page
│   ├── layout.tsx                   # Root layout with fonts
│   ├── page.tsx                     # Main email list page
│   └── providers.tsx                # Theme provider
├── components/
│   ├── email/
│   │   ├── ComposeDrawer.tsx        # Email composer
│   │   ├── EmailItem.tsx            # Single email card
│   │   ├── EmailList.tsx            # Email list with pagination
│   │   └── RichTextEditor.tsx       # Tiptap editor
│   └── layout/
│       └── Header.tsx               # App header with search
├── lib/
│   ├── auth.ts                      # JWT and password verification
│   ├── mongodb.ts                   # MongoDB connection singleton
│   └── theme.ts                     # MUI theme configuration
├── types/
│   ├── auth.ts                      # Auth-related types
│   └── email.ts                     # Email-related types
└── middleware.ts                    # Route protection
\`\`\`

## Usage

### For Users

1. **Login**: Enter your password on the login page
2. **View Emails**: Browse all emails sorted by newest first
3. **Search**: Use the search bar to filter by content
4. **Compose**: Click the edit icon to write a new email
5. **Edit/Delete**: Within 5 minutes of posting, you can edit or delete your own emails
6. **Theme**: Toggle between light and dark modes

### For Developers

- **Email Storage**: Emails are stored in MongoDB's `emails` collection
- **Session Management**: JWT tokens in httpOnly cookies, 24-hour expiry
- **Edit Window**: Tracked via sessionStorage + server-side timestamp validation
- **HTML Sanitization**: All rich text content is sanitized before storage
- **Character Limit**: 10,000 characters per email content

## Security Considerations

- Passwords are hashed with bcrypt (10 rounds)
- JWT tokens stored in httpOnly cookies (prevents XSS)
- HTML content sanitized to prevent XSS attacks
- 5-minute edit window enforced server-side
- MongoDB connection pooling for serverless environments

## Customization

### Change Theme Colors

Edit `lib/theme.ts` to modify the color palette for light and dark modes.

### Modify Edit Window

Change the `EDIT_WINDOW_MS` constant in `app/page.tsx` and `app/api/emails/[id]/route.ts`.

### Add More Users

Currently supports 2 users. To add more:
1. Add `USER_3_PASSWORD_HASH`, etc. to environment variables
2. Update `lib/auth.ts` to check additional passwords
3. Update `types/auth.ts` to include new user IDs

## Troubleshooting

**MongoDB Connection Failed**
- Verify connection string in `.env.local`
- Check MongoDB Atlas Network Access whitelist
- Ensure database user has correct permissions

**JWT Verification Failed**
- Generate a new `JWT_SECRET`
- Clear browser cookies and log in again

**Edit/Delete Not Working**
- Check browser console for sessionStorage errors
- Verify the email was posted less than 5 minutes ago

## License

MIT

## Acknowledgments

Built using Next.js, MUI, and Tiptap.
