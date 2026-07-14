# API Reference

## Base URL
`http://localhost:3001/api`

## Transcoders

### GET /transcoders
List all transcoders.

### GET /transcoders/:id
Get a specific transcoder.

### POST /transcoders
Create a new transcoder.

**Body:**
```json
{
  "name": "Channel 1",
  "sourceIp": "239.0.0.1",
  "sourcePort": 5000,
  "outputFormat": "hls",
  "outputPath": "/var/www/hls/channel1/index.m3u8",
  "hlsSegmentDuration": 4,
  "hlsPlaylistSize": 5,
  "abrTemplateId": "uuid-here",
  "description": "Main channel transcoder"
}
```

### PUT /transcoders/:id
Update a transcoder.

### DELETE /transcoders/:id
Delete a transcoder.

### POST /transcoders/:id/start
Start a transcoder process.

### POST /transcoders/:id/stop
Stop a running transcoder process.

## ABR Templates

### GET /abr-templates
List all ABR templates.

### GET /abr-templates/:id
Get a specific ABR template.

### POST /abr-templates
Create a new ABR template.

**Body:**
```json
{
  "name": "HD Ladder",
  "description": "Standard HD ABR ladder",
  "isDefault": false,
  "abrLadder": {
    "videoProfiles": [
      { "name": "1080p", "width": 1920, "height": 1080, "bitrate": "5000k", "framerate": 30, "codec": "libx264" },
      { "name": "720p", "width": 1280, "height": 720, "bitrate": "2500k", "framerate": 30, "codec": "libx264" },
      { "name": "480p", "width": 854, "height": 480, "bitrate": "1000k", "framerate": 25, "codec": "libx264" }
    ],
    "audioProfiles": [
      { "name": "stereo", "bitrate": "128k", "sampleRate": 48000, "channels": 2, "codec": "aac" }
    ]
  }
}
```

### PUT /abr-templates/:id
Update an ABR template.

### DELETE /abr-templates/:id
Delete an ABR template.

## Jobs

### GET /jobs
List all jobs. Optional query: `?transcoderId=uuid`

### GET /jobs/:id
Get a specific job.

### GET /jobs/transcoder/:id/logs
Get logs for a transcoder.

## WebSocket

Connect to `ws://localhost:3002` for real-time updates.

### Messages
```json
{
  "type": "status_update",
  "transcoderId": "uuid",
  "payload": { "status": "running", "jobId": "uuid" },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

Message types: `status_update`, `metrics`, `log`, `error`
