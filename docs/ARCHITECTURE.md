# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              React Frontend (Vite)                    │  │
│  │  - Dashboard, Transcoders, ABR Templates, Jobs        │  │
│  │  - React Query for data fetching                      │  │
│  │  - WebSocket for real-time updates                    │  │
│  └─────────────────────────┬─────────────────────────────┘  │
└────────────────────────────┼────────────────────────────────┘
                             │ HTTP/WebSocket
┌────────────────────────────▼────────────────────────────────┐
│                    Node.js Backend                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Express API  │  │  WebSocket   │  │   D-Bus Service  │  │
│  │  REST CRUD   │  │   Server     │  │  systemd control │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘  │
│         │                  │                   │            │
│  ┌──────▼──────────────────▼───────────────────▼─────────┐  │
│  │              FFmpeg Service Layer                     │  │
│  │  - Command building, start/stop, metrics             │  │
│  └──────────────────────────┬────────────────────────────┘  │
└─────────────────────────────┼────────────────────────────────┘
                              │
┌─────────────────────────────▼────────────────────────────────┐
│                     PostgreSQL Database                      │
│  - transcoders, abr_templates, streams, jobs, logs          │
└──────────────────────────────────────────────────────────────┘
```

## Key Components

### Backend

- **Express API**: RESTful CRUD endpoints for all entities
- **WebSocket Service**: Real-time broadcasting to connected clients
- **FFmpeg Service**: Manages FFmpeg process lifecycle and command construction
- **D-Bus Service**: Integrates with systemd for service management
- **TypeORM**: Database ORM with PostgreSQL

### Frontend

- **React Query**: Server state management with automatic refetching
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS styling
- **WebSocket Hook**: Real-time status updates and connection state

## Database Schema

### transcoders
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR | Display name |
| source_ip | VARCHAR | Input IP address |
| source_port | INT | UDP port |
| output_format | VARCHAR | hls or dash |
| output_path | VARCHAR | Output file path |
| status | VARCHAR | idle/running/stopped/error |

### abr_templates
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR | Template name |
| abr_ladder | JSONB | Video/audio profiles |
| is_default | BOOLEAN | Default template flag |

### jobs
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| transcoder_id | UUID | Foreign key |
| status | VARCHAR | Job status |
| ffmpeg_command | TEXT | Built command |
| pid | INT | Process ID |
| started_at | TIMESTAMP | Start time |
| ended_at | TIMESTAMP | End time |

### transcoder_logs
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| transcoder_id | UUID | Foreign key |
| level | VARCHAR | Log level |
| message | TEXT | Log message |
| created_at | TIMESTAMP | Log timestamp |
