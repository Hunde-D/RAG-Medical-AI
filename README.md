# RAG MEDICAL AI (Medical Report AI)

This project leverages cutting-edge AI to process medical reports. Users can upload images of medical reports, which are then analyzed and extracted for detailed information. Additionally, users can ask follow-up questions for more insights.

## Key Features

- **Image Processing**: Extracts text and data from medical report images.
- **Interactive Q&A**: Allows users to ask questions about the extracted data.
- **Advanced AI Models**: Powered by Gemini 1.5 Pro and the Vercel AI SDK for robust performance.

## Technologies Used

- **Gemini 1.5 Pro**: Advanced AI model for natural language understanding and text generation.
- **Vercel AI SDK**: Provides seamless integration for AI functionalities.
- **JavaScript**: Core language for backend and frontend processing.

## Getting Started

### Prerequisites

- Node.js 16+
- [Other dependencies based on the project requirements.]

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Hunde-D/RAG-Medical-AI.git
   cd RAG-Medical-AI
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file based on the provided `.env.example`.
   - Add necessary API keys and configurations.

### Running the Application

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Access the application locally at `http://localhost:3000`.

## Usage

1. Upload a medical report image.
2. Edit the extracted data for better results also include past medical history to extracted report.
3. Ask questions to gain further insights into the extracted data.

## Contributing

Contributions are welcome! Please:

1. Fork the repository.
2. Create a new branch for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Push your changes and create a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
