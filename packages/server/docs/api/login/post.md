# Login

Used to set a session cookie.

**URL** : `/api/login/`

**Method** : `POST`

**Auth required** : NO

**Data constraints**

```json
{
    "username": "[valid username]",
    "password": "[password in plain text]"
}
```

**Data example**

```json
{
    "username": "iloveauth",
    "password": "abcd1234"
}
```

## Success Response

**Code** : `200 OK`

**Header example**
````http
Set-Cookie: personal-gallery_auth=c944ee5bf6ee313191d0c242b79840e5a84967c3798a3526a1b356f6a04b; Path=/; Expires=Fri, 22 Mar 2024 10:33:50 GMT; HttpOnly; SameSite=Lax
````

**Content example**

```json
{
    "status": "success"
}
```

## Error Response

**Condition** : If 'username' and 'password' combination is wrong.

**Code** : `401 Unauthorized`

**Content** :

```json
{
    "status": "error"
}
```

**Condition** : If registration proccess isn't finished.

**Code** : `500 Internal Server Error`

**Content** :

```json
{
    "status": "error"
}
```