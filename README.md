# Regional AI Video Translator (LokVaani)

A full-stack application to translate videos into multiple Indian languages using AI. The app allows users to upload a video, automatically transcribes and translates the audio, and provides a downloadable translated video with captions. Built with React (frontend), Node.js/Express (backend), and Docker for easy deployment.

![LokVaani Main Interface](https://res.cloudinary.com/rahul9307/image/upload/v1/regional-ai/screenshots/main_interface.png)

---

## Features
- **Video Upload:** Upload videos for processing.
- **Automatic Transcription:** Uses Google Gemini AI for speech-to-text.
- **Translation:** Translates the transcript into the selected Indian language.
- **Text-to-Speech:** Uses Sarvam AI for high-quality voice synthesis.
- **Cloud Storage:** Stores videos and audio in Cloudinary.
- **Downloadable Results:** Get the translated video and captions.

---

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Shadcn UI
- **Backend:** Node.js, Express
- **AI Services:** Google Gemini, Sarvam AI
- **Storage:** Cloudinary (organized in dedicated folders)
- **Containerization:** Docker, Docker Compose

---

## Screenshots

### Translation Interface
![Translation Interface](https://res.cloudinary.com/rahul9307/image/upload/v1/regional-ai/screenshots/translation_interface.png)

### Results View
![Results View](https://res.cloudinary.com/rahul9307/image/upload/v1/regional-ai/screenshots/results_view.png)

---

## Getting Started

### Prerequisites
Choose one of the following setups:
- **Localhost:** [Node.js](https://nodejs.org/) (v18+), [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- **Docker:** [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/)

### 1. Clone the Repository
```sh
git clone https://github.com/RahulJha93/LokVaani.git
cd LokVaani
```

### 2. Environment Variables
Create `.env` files in both `backend` and `frontend`:

#### `backend/.env`
```
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
SARVAM_API_KEY=your_sarvam_api_key
SARVAM_TTS_ENDPOINT=https://api.sarvam.ai/text-to-speech
```

#### `frontend/.env`
```
VITE_BACKEND_URL=http://localhost:5000
```

---

## Running the App

### Option 1: Localhost (Recommended for Development)

#### 1. Start the Backend
```sh
cd backend
npm install
npm run dev
```
The backend will run at [http://localhost:5000](http://localhost:5000)

#### 2. Start the Frontend
Open a new terminal and run:
```sh
cd frontend
npm install
npm run dev
```
The frontend will run at [http://localhost:5173](http://localhost:5173)

---

### Option 2: Docker Compose

```sh
docker-compose up --build
```
- Frontend: [http://localhost:4173](http://localhost:4173)
- Backend: [http://localhost:5000](http://localhost:5000)

---

## Project Structure
```
Regional-AI/
├── backend/           # Express backend
│   ├── controller/
│   ├── routes/
│   ├── utils/
│   └── ...
├── frontend/          # React frontend
│   ├── Pages/
│   ├── Components/
│   └── ...
├── docker-compose.yml
└── README.md
```

---

## Deployment
- You can deploy using any VPS/cloud that supports Docker Compose (e.g., DigitalOcean, AWS EC2, Hetzner).
- For CI/CD, see `.github/workflows/` for GitHub Actions example.

---

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License
[MIT](LICENSE)
