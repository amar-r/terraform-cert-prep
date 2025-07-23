# Terraform Cert Prep

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)](https://docs.docker.com/compose/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688.svg)](https://fastapi.tiangolo.com/)
[![Terraform](https://img.shields.io/badge/Terraform-Associate-623ce4.svg)](https://www.hashicorp.com/certification/terraform-associate)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![GitHub stars](https://img.shields.io/github/stars/amar-r/terraform-cert-prep.svg)](https://github.com/amar-r/terraform-cert-prep/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/amar-r/terraform-cert-prep.svg)](https://github.com/amar-r/terraform-cert-prep/network)

A full-stack web application that simulates the HashiCorp Certified: Terraform Associate exam experience.

## Features

- Interactive multiple-choice questions (A-D format)
- Real-time answer validation with explanations
- Score tracking and final results
- Review mode for missed questions
- Responsive design optimized for exam simulation
- 55+ sample questions covering all Terraform Associate exam domains
- Full exam simulation mode (55 questions, 1-hour format)

## Tech Stack

- **Frontend**: React with Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: JSON file storage
- **Containerization**: Docker & Docker Compose

## Quick Start

1. Clone the repository
2. Make sure Docker and Docker Compose are installed
3. Run the application:

```bash
cd terraform-cert-prep
docker compose up --build
```

4. Open your browser and navigate to `http://localhost:3000`

## Architecture

- **Frontend** (React): Serves the quiz interface on port 3000
- **Backend** (FastAPI): Provides question API and validation on port 8000
- **Data**: Questions stored in JSON format with explanations

## Development

The application uses volume mounting for hot reloading during development.

- Frontend code: `./frontend`
- Backend code: `./backend`
- Questions data: `./backend/data/questions.json`

## Exam Domains Covered

- Infrastructure as Code (IaC) concepts
- Terraform CLI usage
- State management
- Variables and outputs
- Modules and providers
- Terraform Cloud/Enterprise features

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the question database, add new features, or fix bugs. 