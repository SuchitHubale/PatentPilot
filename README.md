# PatentPilot 🚀

<div align="center">


**AI-Powered Patent Analysis Platform**

[![Next.js](https://img.shields.io/badge/Next.js-14.0.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-2.1.1-green?style=flat-square&logo=flask)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-technology-stack) • [Contributing](#-contributing)

</div>

---

## 📖 Overview

PatentPilot is an intelligent patent analysis platform that empowers inventors and researchers to evaluate their ideas against existing patents. Leveraging advanced BERT-based semantic search and Google's Gemini AI, PatentPilot delivers comprehensive patent landscape analysis, novelty assessment, and actionable recommendations to strengthen patentability.

### Why PatentPilot?

- **Save Time**: Quickly identify relevant prior art from thousands of patents
- **Gain Insights**: Understand your invention's position in the patent landscape
- **Strengthen Applications**: Get AI-powered recommendations to improve patentability
- **User-Friendly**: Intuitive chat interface makes patent analysis accessible to everyone

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔍 **Semantic Patent Search** | BERT-based similarity search finds relevant patents using meaning, not just keywords |
| 🤖 **AI-Powered Analysis** | Gemini AI provides detailed landscape analysis and patentability assessments |
| 💬 **Interactive Chat** | User-friendly conversational interface for submitting ideas and viewing results |
| 📊 **Patent Cards** | Beautiful, expandable cards displaying comprehensive patent information |
| 🔐 **Secure Authentication** | User management powered by Clerk with OAuth support |
| 💾 **Real-time Storage** | Firebase Firestore integration for chat history and user data |
| 📱 **Responsive Design** | Modern, mobile-friendly UI that works seamlessly across devices |
| 🎨 **Rich Formatting** | Markdown support for clear, formatted analysis results |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│  Next.js 14 • React 18 • TailwindCSS • Clerk • Firebase   │
└─────────────────────┬───────────────────────────────────────┘
                      │ REST API
┌─────────────────────▼───────────────────────────────────────┐
│                         Backend                             │
│   Flask • Sentence Transformers • FAISS • Gemini AI        │
└─────────────────────────────────────────────────────────────┘
```

### Frontend Stack
- **Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS with custom components
- **Authentication**: Clerk
- **Database**: Firebase Firestore
- **UI Components**: Custom React components with Lucide icons

### Backend Stack
- **Framework**: Flask REST API
- **ML Model**: Sentence Transformers (all-MiniLM-L6-v2)
- **Vector Database**: FAISS for efficient similarity search
- **AI Integration**: Google Gemini API
- **Data Processing**: Pandas

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher
- **Python** 3.8 or higher
- **npm** or **yarn**
- **pip** for Python package management

You'll also need API keys for:
- [Clerk](https://clerk.com/) (Authentication)
- [Firebase](https://firebase.google.com/) (Database)
- [Google Gemini](https://ai.google.dev/) (AI Analysis)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/SuchitHubale/PatentPilot.git
cd PatentPilot
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

Configure your `.env.local` file:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Backend Setup

```bash
cd Backend/patent_search

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Important**: Update the Gemini API key in `Backend/patent_search/app.py` (line 14):

```python
genai.configure(api_key="YOUR_GEMINI_API_KEY")
```

### 4. Prepare Patent Data

Ensure these files exist in `Backend/patent_search/indexed/`:

- `indexed.csv` - Patent database with columns: title, abstract, publication_number, date, inventors
- `faiss_indexed_updated.pickle` - Pre-computed FAISS index for semantic search

---

## 🎯 Running the Application

### Start the Backend Server

```bash
cd Backend/patent_search
python app.py
```

Backend runs on: `http://127.0.0.1:8080`

### Start the Frontend Development Server

```bash
# In the root directory
npm run dev
```

Frontend runs on: `http://localhost:3000`

---

## 📖 Usage

1. **Sign Up/Login**  
   Create an account or log in using Clerk authentication

2. **Start a Chat**  
   Click "New Chat" to begin a conversation

3. **Submit Your Idea**  
   Describe your invention idea in the chat input

4. **View Results**  
   - Similar patents displayed in expandable cards
   - AI-generated analysis with key insights

5. **Review Analysis**  
   Comprehensive breakdown including:
   - Key overlaps with existing patents
   - Unique aspects of your idea
   - Recommendations to strengthen patentability
   - Overall patentability assessment

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.0.4 | React framework |
| React | 18.2.0 | UI library |
| TailwindCSS | 3.3.2 | Styling |
| Clerk | 4.27.2 | Authentication |
| Firebase | 12.0.0 | Database |
| Axios | 1.10.0 | HTTP client |
| Lucide React | - | Icons |
| React Markdown | - | Markdown rendering |
| React Hot Toast | - | Notifications |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Flask | 2.1.1 | Web framework |
| Sentence Transformers | - | BERT embeddings |
| FAISS | - | Vector similarity search |
| Google Generative AI | - | Gemini API |
| Pandas | 1.5.3 | Data processing |
| NumPy | 1.24.2 | Numerical computing |
| BeautifulSoup4 | 4.9.3 | Web scraping |

---

## 📁 Project Structure

```
PatentPilot/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   └── chat/                 # Chat-related endpoints
│   ├── page.js                   # Main page component
│   └── layout.js                 # Root layout
├── components/                   # React components
│   ├── PatentCard.jsx            # Patent display component
│   ├── PromptBox.jsx             # Chat input component
│   ├── Message.jsx               # Message display component
│   └── Sidebar.jsx               # Navigation sidebar
├── Backend/                      # Flask backend
│   └── patent_search/
│       ├── app.py                # Flask application
│       ├── bert.py               # BERT search logic
│       ├── model.py              # ML model utilities
│       ├── requirements.txt      # Python dependencies
│       └── indexed/              # Patent data & FAISS index
├── config/                       # Configuration files
│   └── firebase.js               # Firebase setup
├── context/                      # React context providers
│   └── AppContext.jsx            # Global app state
├── models/                       # Data models
│   ├── User.js                   # User model
│   └── Chat.js                   # Chat model
├── assets/                       # Static assets
├── public/                       # Public files
└── package.json                  # Node dependencies
```

---

## 🔌 API Endpoints

### Frontend API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat/ai` | Send user prompt and get AI analysis |
| GET | `/api/chat/get` | Retrieve chat history |

### Backend API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bert_search` | Perform semantic patent search |
| POST | `/api/gemini_suggest` | Get AI-powered patent analysis |

---

## 🔒 Security & Best Practices

> **⚠️ Important Security Notice**

- **Never commit API keys** to version control
- Store sensitive credentials in `.env.local` (frontend) and environment variables (backend)
- The `.env.local` file is gitignored by default
- Use environment variables in production for `Backend/patent_search/app.py` and `model.py`
- Rotate API keys regularly
- Use different keys for development and production

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit** your changes
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push** to the branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open** a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Suchit Hubale**

- GitHub: [@SuchitHubale](https://github.com/SuchitHubale)

---

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for patent analysis capabilities
- [Sentence Transformers](https://www.sbert.net/) for semantic search technology
- [FAISS](https://github.com/facebookresearch/faiss) for efficient vector similarity search
- [Next.js](https://nextjs.org/) and [React](https://reactjs.org/) communities
- [Clerk](https://clerk.com/) for authentication services
- [Firebase](https://firebase.google.com/) for database services

---

## 📞 Support

For issues, questions, or suggestions:

- 📧 Open an [issue on GitHub](https://github.com/SuchitHubale/PatentPilot/issues)
- 💬 Start a [discussion](https://github.com/SuchitHubale/PatentPilot/discussions)
- 📖 Check our [documentation](https://github.com/SuchitHubale/PatentPilot/wiki)

---

<div align="center">

**Built with ❤️ for inventors and innovators worldwide**

⭐ Star this repo if you find it helpful!

</div>