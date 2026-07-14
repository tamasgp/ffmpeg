# FFmpeg Transcoder Manager

A comprehensive React web application for managing FFmpeg transcoder processes with real-time monitoring, ABR ladder management, and systemd integration.

## Features

- **Transcoder Configuration Management**
  - Source IP address and UDP port configuration
  - Multi-stream selection (video/audio/subtitle)
  - ABR ladder templates with presets
  - HLS/DASH output settings

- **Real-time Process Management**
  - Start/stop FFmpeg processes via systemd D-Bus
  - Live status monitoring and metrics
  - Process lifecycle tracking
  - System resource monitoring

- **Web UI**
  - Modern React dashboard
  - Real-time WebSocket updates
  - Configuration management interface
  - Job monitoring and logging

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Frontend**: React, TypeScript, Vite, TailwindCSS
- **Database**: PostgreSQL, TypeORM
- **Process Management**: systemd D-Bus
- **Real-time**: WebSocket

## Getting Started

See [docs/SETUP.md](./docs/SETUP.md) for detailed setup instructions.

## Project Structure

```
├── backend/          # Express API server
├── frontend/         # React web application
├── docs/            # Documentation
└── docker-compose.yml
```
