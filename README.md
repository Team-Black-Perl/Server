# Server API Documentation

## Introduction

This server provides endpoints to manage alerts and associated files. The alerts contain information such as user ID, location, status, and creation date. The associated files are uploaded to Firebase storage and are accessible via download URLs.

## Base URL
http://localhost:PORT


## Endpoints

### 1. Upload Alert and File

- **URL**: `/`
- **Method**: `POST`
- **Description**: Uploads an alert along with an associated file.
- **Request Body**:
  - `file`: File to be uploaded (multipart/form-data)
  - `user_id`: User ID associated with the alert
  - `lat`: Latitude of the alert location
  - `long`: Longitude of the alert location
- **Response**:
  - `message`: Description of the operation result
  - `name`: Name of the uploaded file
  - `type`: MIME type of the uploaded file
  - `downloadURL`: Download URL of the uploaded file

### 2. Get All Alerts

- **URL**: `/All`
- **Method**: `GET`
- **Description**: Retrieves all alerts.
- **Response**:
  - Array of alert objects containing the following fields:
    - `uid`: Unique identifier of the alert
    - `user_id`: User ID associated with the alert
    - `status`: Status of the alert (true/false)
    - `lat`: Latitude of the alert location
    - `long`: Longitude of the alert location
    - `createdAt`: Date and time when the alert was created
    - `downloadURL`: Download URL of the associated file

### 3. Get Incomplete Alerts

- **URL**: `/incomplete`
- **Method**: `GET`
- **Description**: Retrieves all incomplete alerts (alerts with status = false).
- **Response**:
  - Array of incomplete alert objects with the same fields as described in the "Get All Alerts" endpoint.

### 4. Update Alert Status

- **URL**: `/update`
- **Method**: `POST`
- **Description**: Updates the status of an alert to true.
- **Request Body**:
  - `uid`: Unique identifier of the alert to be updated
- **Response**:
  - `message`: Description of the operation result

### 5. Add or Update User Data

- **URL**: `/`
- **Method**: `POST`
- **Description**: Adds or updates user data based on the provided user ID. If the user ID already exists in the database, the user data is updated; otherwise, a new user document is created.
- **Request Body**:
  - `user_id`: User ID (string or number)
  - `ip_address`: IP address of the user
  - `long`: Longitude of the user's location
  - `lat`: Latitude of the user's location
  - `city`: City of the user's location
  - `state`: State of the user's location
- **Response**:
  - Success message indicating whether the user data was added or updated successfully

## Error Handling

- If an error occurs during the execution of any endpoint, the server responds with an appropriate error status code (500 for server errors) along with a JSON object containing an error message.

## Example Usage

### Upload Alert and File

```bash
curl -X POST -F "file=@/path/to/file.mp4" -F "user_id=123" -F "lat=12.345" -F "long=67.890" http://localhost:PORT/

```
### Get All Alerts
```bash
curl http://localhost:PORT/All
```

### Get Incomplete Alerts
```bash
curl http://localhost:PORT/incomplete
```

### Update Alert Status
```bash
curl -X POST -H "Content-Type: application/json" -d '{"uid":"2VGQCs2qGiFLvIlGFGZr"}' http://localhost:PORT/update
```

### Add or Update User Data
```bash
curl -X POST -H "Content-Type: application/json" -d '{"user_id":123, "ip_address":"192.168.0.1", "long":12.345, "lat":67.890, "city":"Example City", "state":"Example State"}' http://localhost:PORT/
```

### Note
Replace PORT with the actual port number where the server is running.