# API Documentation: Nudge Creation

This document provides detailed information about the API used to create and manage nudges for events.

## Base URL



## API Endpoints

### 1. Create Nudge
**Endpoint**: `/nudges`  
**Method**: `POST`  
**Description**: This endpoint allows the user to create a nudge for an event, including title, image, time, description, icon, and invitation.

#### Request Payload:
```json
{
  "event_id": "string",
  "title": "string",
  "cover_image": "string (base64 or image URL)",
  "send_time": "string (ISO 8601 format)",
  "description": "string",
  "icon": "string (image URL or icon identifier)",
  "invitation_text": "string"
}

Response:
Status: 201 Created
Body:

{
  "nudge_id": "string",
  "message": "Nudge successfully created"
}


2. Get Nudge Details
Endpoint: /nudges/{nudge_id}
Method: GET
Description: This endpoint fetches the details of a specific nudge by nudge_id.

Response:
Status: 200 OK
Body:

{
  "nudge_id": "string",
  "event_id": "string",
  "title": "string",
  "cover_image": "string (image URL)",
  "send_time": "string (ISO 8601 format)",
  "description": "string",
  "icon": "string (image URL or icon identifier)",
  "invitation_text": "string"
}



