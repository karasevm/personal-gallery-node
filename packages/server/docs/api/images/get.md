# List all images

Used to get all images on the server.

**URL** : `/api/images/`

**Method** : `GET`

**Auth required** : YES

**Optional query parameters**
| Parameter | Possible values | Default | Description |
|------     | -----           | ---     | ---         |
|`sortBy`| `filename` or `added`|`filename`| Specifies how to sort the output|
|`sortOrder`| `ASC` or `DSC`|`ASC`|Specifies sort direction |
|`page`| integers >= 0|0| Specifies page offset|

## Success Responses

**Condition** : There are no images on the server.

**Code** : `200 OK`

**Content** : `[]`

### OR

**Condition** : There are images on the server.

**Code** : `200 OK`

**Content** 
````json
[
    {
        "url": "/4bNPpMw.png",
        "filename": "4bNPpMw.png",
        "thumbnails": [
            {
                "filetype": "image/avif",
                "url": "/api/thumbnails/4bNPpMw.png/avif"
            },
            {
                "filetype": "image/webp",
                "url": "/api/thumbnails/4bNPpMw.png/webp"
            },
            {
                "filetype": "image/jpeg",
                "url": "/api/thumbnails/4bNPpMw.png/jpeg"
            }
        ]
    },
    {
        "url": "/82dyCV7.png",
        "filename": "82dyCV7.png",
        "thumbnails": [
            {
                "filetype": "image/avif",
                "url": "/api/thumbnails/82dyCV7.png/avif"
            },
            {
                "filetype": "image/webp",
                "url": "/api/thumbnails/82dyCV7.png/webp"
            },
            {
                "filetype": "image/jpeg",
                "url": "/api/thumbnails/82dyCV7.png/jpeg"
            }
        ]
    }
]
````