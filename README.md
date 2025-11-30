# VocabBuilder 📚

A modern, interactive vocabulary learning application built with Vue 3, TypeScript, and a beautiful UI. Create custom decks, organize words into stages, and master new languages through an engaging quiz system.

![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=flat&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

## ✨ Features

### 🎯 Core Features

- **Custom Vocabulary Decks**: Create and manage multiple language learning decks
- **Stage-Based Learning**: Organize words into progressive stages (e.g., New, Learning, Mastered)
- **Interactive Flashcards**: Click-to-reveal cards with translations, pronunciations, and example sentences
- **Quiz System**: Test your knowledge and automatically progress words through stages
- **Text-to-Speech**: Listen to word pronunciations in multiple languages
- **Drag & Drop**: Intuitively reorganize cards and stages
- **Real-time Audio**: Powered by ResponsiveVoice for accurate pronunciation

### 🔐 Authentication

- Email/Password authentication
- Google OAuth integration
- Email verification
- Password reset functionality
- Secure JWT-based sessions

### 👥 User Management

- Personal vocabulary decks
- Admin dashboard for system management
- User and deck analytics

### 🎨 Modern UI/UX

- Beautiful, responsive design with Tailwind CSS
- Smooth animations and transitions
- Dark mode support
- Mobile-friendly interface
- Accessible components using Radix UI (via shadcn/vue)

## 🛠️ Tech Stack

### Frontend

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API with `<script setup>`)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom theme
- **UI Components**: [shadcn/vue](https://www.shadcn-vue.com/) (Radix UI primitives)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Form Validation**: [Vee-Validate](https://vee-validate.logaretm.com/) + [Zod](https://zod.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Routing**: [Vue Router](https://router.vuejs.org/)
- **Drag & Drop**: [vuedraggable](https://github.com/SortableJS/vue.draggable.next)
- **Notifications**: [vue-sonner](https://github.com/xiaoluoboding/vue-sonner)

### Supported Languages

- English (US & UK)
- Vietnamese
- French
- Spanish
- German
- Japanese
- Korean

## 📦 Project Structure

```
src/
├── api/              # API service layer
│   ├── admin.ts      # Admin endpoints
│   ├── auth.ts       # Authentication
│   ├── boards.ts     # Board/deck management
│   ├── cards.ts      # Vocabulary cards
│   ├── lists.ts      # Stages/lists
│   └── users.ts      # User management
├── components/       # Vue components
│   ├── ui/           # shadcn/vue UI components
│   ├── AppNavbar.vue
│   ├── ConfirmDeleteDialog.vue
│   ├── EditCardDialog.vue
│   ├── EditableText.vue
│   └── QuizDialog.vue
├── stores/           # Pinia stores
│   ├── admin.ts
│   ├── auth.ts
│   ├── board.ts
│   ├── card.ts
│   └── list.ts
├── views/            # Page components
│   ├── admin/
│   ├── auth/
│   └── boards/
├── router/           # Vue Router configuration
├── schemas/          # Zod validation schemas
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- Backend API server running (see backend repository)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/vocabbuilder.git
cd vocabbuilder
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
# or
yarn install
```

3. Create a `.env` file in the root directory:

```env
VITE_BACKEND_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Linting & Type Checking
npm run lint         # Lint code with ESLint
npm run type-check   # Type check with TypeScript
```

## 📱 Usage

### Creating a Deck

1. Click **"Create New Deck"** on the Boards page
2. Enter deck name, description, and select target language
3. Click **"Create Deck"**

### Adding Stages

1. Open a deck
2. Click **"Add Stage"**
3. Enter stage name (e.g., "New Words", "Learning", "Mastered")
4. Stage is added to the board

### Adding Vocabulary Cards

1. Click **"Add word"** in any stage
2. Enter the word and its translation
3. Click **"Add Word"**
4. Click the card to add pronunciation and example sentences

### Taking a Quiz

1. Click the **Play** icon on any stage
2. Review each flashcard
3. Mark as "Correct" or "Incorrect"
4. Correct answers automatically move to the next stage

### Drag & Drop

- **Drag stages** to reorder them
- **Drag cards** between stages to manually reorganize
- Changes are saved automatically

## 🎨 Customization

### Adding UI Components

This project uses shadcn/vue. To add new components:

```bash
npx shadcn-vue@latest add button
npx shadcn-vue@latest add dialog
npx shadcn-vue@latest add dropdown-menu
```

### Theme Customization

Edit `src/style.css` to customize colors, spacing, and typography. The theme uses CSS variables for easy customization:

```css
:root {
  --primary: oklch(0.205 0 0);
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  /* ... */
}
```

## 🔒 Authentication Flow

1. **Register**: User signs up with email/username/password
2. **Email Verification**: User receives verification email
3. **Login**: User logs in with verified credentials or Google OAuth
4. **Session Management**: JWT tokens with automatic refresh
5. **Protected Routes**: Navigation guards prevent unauthorized access

## 🏗️ State Management

The app uses Pinia stores organized by feature:

- **authStore**: User authentication and profile
- **boardStore**: Deck management
- **listStore**: Stage management
- **cardStore**: Vocabulary card operations
- **adminStore**: Admin dashboard data

## 🌐 API Integration

API calls are centralized in the `src/api/` directory with:

- Automatic token refresh
- Request/response interceptors
- Error handling
- Type-safe responses

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

Project Link: [https://github.com/yourusername/vocabbuilder](https://github.com/yourusername/vocabbuilder)

---

Made with ❤️ using Vue 3 and TypeScript
