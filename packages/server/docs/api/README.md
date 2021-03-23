# REST API Documentation

Where full URLs are provided in responses they will be rendered as if service
is running on 'http://testserver/'.

## Open Endpoints

Open endpoints require no Authentication.

* [Login](login/post.md) : `POST /api/login/`
* [Register](login/register/post.md) : `POST /api/login/register/`
* [Logout](login/logout.md) : `POST /api/login/logout/`

## Endpoints that require Authentication

### Auth options
* Token in cookie `personal-gallery_auth`, can be set via the login endpoint.
* Bearer token in `Authorization` header, can be aquiered via the getApiKey endpoint.

### Image related

* [Image list](images/get.md) : `GET /api/images/`
* [Add image](images/post.md) : `POST /api/images/`
* [Get thumbnail](thumbnails/get.md) : `GET /api/thumbnails/:image/:type/`

### User related

* [API key](user/getApiKey/post.md) : `POST /api/user/getApiKey/`
* [User credentials update](user/updateCredentials/post.md) : `POST /api/user/updateCredentials/`