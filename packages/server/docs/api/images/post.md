# Add image

Used to upload images to the server.

**URL** : `/api/images/`

**Method** : `POST`

**Auth required** : YES

**Request type**: `multipart/form-data`

**File key**: `file`

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "url": "/zVV3DFY.png",
    "filename": "zVV3DFY.png",
    "thumbnails": [
        {
            "filetype": "image/avif",
            "url": "/api/thumbnails/zVV3DFY.png/avif"
        },
        {
            "filetype": "image/webp",
            "url": "/api/thumbnails/zVV3DFY.png/webp"
        },
        {
            "filetype": "image/jpeg",
            "url": "/api/thumbnails/zVV3DFY.png/jpeg"
        }
    ]
}
```

## Error Response

**Condition** : If no file was sent.

**Code** : `400 Bad Request`

**Content** :

```json
{
    "status": "error", 
    "error": "File missing." 
}
```

**Condition** : If multiple files were sent at once.

**Code** : `400 Bad Request`

**Content** :

```json
{
    "status": "error",
    "error": "Send one file at a time." 
}
```

**Condition** : If filetype is impossible to extract or it mismatches the extension.

**Code** : `400 Bad Request`

**Content** :

```json
{
    "status": "error",
    "error": "Malformed file." 
}
```

**Condition** : If filetype is unsupported by server.

**Code** : `400 Bad Request`

**Content** :

```json
{
    "status": "error",
    "error": "Unsupported file type." 
}
```

**Condition** : If server can't write the file to disk.

**Code** : `500 Internal Server Error`

**Content** :

```json
{
    "status": "error",
    "error": "Error saving uploaded image." 
}
```

