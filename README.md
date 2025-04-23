# Regional AI Video Translator

A full-stack application to translate videos into multiple Indian languages using AI. The app allows users to upload a video, automatically transcribes and translates the audio, and provides a downloadable translated video with captions. Built with React (frontend), Node.js/Express (backend), and Docker for easy deployment.

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
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express
- **AI Services:** Google Gemini, Sarvam AI
- **Storage:** Cloudinary
- **Containerization:** Docker, Docker Compose

---

## Getting Started

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/)

### 1. Clone the Repository
```sh
git clone <your-repo-url>
cd Regional-AI
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

### 3. Build and Run with Docker Compose
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
