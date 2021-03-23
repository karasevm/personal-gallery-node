# Get thumbnail

Get a thumbnail for the specified image in the specified format.

**URL** : `/api/thumbnails/:image/:type`

**URL Parameters** : 
 - `image=[string]` where `image` is the name of the requested image
 - `type=['jpeg'|'webp'|'avif']` where `type` is the requested thumbnail type

**Method** : `GET`

**Auth required** : YES

## Success Response

**Code** : `200 OK`

**Content**: the requested thumbnail.
