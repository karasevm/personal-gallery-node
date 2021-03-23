# Meta information

Used to get server meta info.

**URL** : `/api/meta/`

**Method** : `GET`

**Auth required** : NO

## Success Responses

**Code** : `200 OK`

**Content** 
````json
{
    "accepted": [
        "image/png",
        "image/webp",
        "image/gif",
        "image/avif",
        "image/jpeg",
        "video/mp4",
        "video/webm"
    ],
    "setupFinished": true
}
````