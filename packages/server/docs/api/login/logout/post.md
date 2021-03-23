# Logout

Used to logout and invalidate session cookie. 

**URL** : `/api/login/logout/`

**Method** : `POST`

**Auth required** : NO


## Success Response

**Code** : `200 OK`

**Header example**
````http
Set-Cookie: personal-gallery_auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax
Clear-Site-Data: "cache", "cookies", "storage"
````

**Content example**

```json
{
    "status": "success"
}
```

## Error Response

**Condition** : If 'username' or 'password' is empty.

**Code** : `400 Bad Request`

**Content** :

```json
{
    "status": "error"
}
```
