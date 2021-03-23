# User credentials

Used to change username and password. 

**URL** : `/api/user/updateCredentials/`

**Method** : `POST`

**Auth required** : YES

**Data constraints**

```json
{
    "username": "[OPTIOANAL, valid username]",
    "password": "[OPTIOANAL, password in plain text]",
    "oldPassword": "[old password in plain text]"
}
```

**Data example**

```json
{
    "username": "iloveauth",
    "oldPassword": "abcd1234"
}
```


## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "token": "cd37949572cdea54ec5479d0cbe1ebfa6562a7ea33a4ea71e52609d232b5"
}
```

## Error Response

**Condition** : If neither 'username' or 'password' are set.

**Code** : `400 Bad Request`

**Content** :

```json
{
    "status": "error"
}
```

**Condition** : If 'oldPassword' is incorrect.

**Code** : `401 Unauthorized`

**Content** :

```json
{
    "status": "error"
}
```