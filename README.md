[![Stories in Ready](https://badge.waffle.io/unearth/unearth.png?label=ready&title=Ready)](https://waffle.io/unearth/unearth)
Unearth
==========

#Steps to install:

###Set Up PostgreSQL
 - run `\i server/database/schema.sql` while running psql to set up the tables

###Add a config file
 - Copy `server/config.example.js` into a new `server/config.js`
 - Add database path

###Install the grunt-cli
 - `npm install -g grunt-cli`

###Install npm dependencies
 - `npm install`

Routes
=============================


##Signup
###Post /signup
#####Headers:
 - Content-type: `application/json`

#####Body:
```
{
  "email": "Melony@gmail.com",
  "password": "securepassword",
  "name": "Melony"
}
```

#####Response:
```
{
  "token": "YOUR TOKEN HERE"
}
```


##Login
###Post /login
#####Headers:
 - Content-type: `application/json`

#####Body:
```
{
  "email": "Melony@gmail.com",
  "password": "securepassword"
}
```

#####Response:
```
{
"token": "YOUR TOKEN HERE"
}
```


##Logout
###Post /logout
#####Headers:
 - Content-type: `application/json`
 - Authorization: `bearer YOURTOKENHERE`

#####Response:
```
{
  "success": "Session has been removed!"
}
```

##Waypoints
###Get /waypoints
#####Headers:
 - Authorization: `bearer + token`

#####Response:
```
{
  "waypoints": [
    [
      412.52341235234,
      425.23421
    ],
    [
     432.52341235234,
     475.23421
    ]
  ]
}
```

###Post /waypoints
#####Headers:
 - Content-type: `application/json`
 - Authorization: `bearer YOURTOKENHERE`

#####Body:
```
{
  "waypoints": [
    [412.52341235234, 425.23421],
    [432.52341235234, 475.23421]
  ]
}
```

#####Response:
```
{
  "success": "Waypoints have been posted!"
}
```

##Groups
###Get /group
#####Headers:
 - Content-type: `application/json`
 - Authorization: `bearer YOURTOKENHERE`

#####Response:
```
{
  "groups": [
    {
      "group_id": 54,
      "name": "Thisisagroupname",
      "description": "This is a cool group",
      "members": [
        {
          "user_id": 4,
          "email": "Melony@gmail.com",
          "name": "Melony"
        }
      ],
      "pendingMembers": [
        {
          "user_id": 5,
          "email": "Ben@gmail.com",
          "name": "Ben"
        }
      ]
    }
```


###Get /group/waypoints
#####Headers:
 - Content-type: `application/json`
 - Authorization: `bearer YOURTOKENHERE`
 - groupId: 3

#####Response:
```
{
  "waypoints": [
    {
      "user_id": 4,
      "waypoints": [
        [
          412.52341235234,
          425.23421
        ],
        [
          432.52341235234,
          475.23421
        ],
        [
          112.52341235234,
          225.23421
        ]
      ]
    }
  ]
}
```

###Post /group/create
#####Headers:
 - Content-type: `application/json`
 - Authorization: `bearer YOURTOKENHERE`

#####Body:
```
{
  "groupName": "MY GROUP NAME",
  "groupDescription": "MY GROUP DESCRIPTION",
  "emails": ["Melony@gmail.com"]
}
```

#####Response:
```
{
  "groupId": {
    "?column?": 54
  }
}
```


##Invitations
###Post /group/invite
#####Headers:
 - Content-type: `application/json`
 - Authorization: `bearer YOURTOKENHERE`

#####Body:
```
{
  "email": "beniscool@ben.com"
  "groupId": 2"
}
```

###Post /group/accept
#####Headers:
 - Content-type: `application/json`
 - Authorization: `bearer YOURTOKENHERE`

#####Body:
```
{
  "groupId": 2"
}
```

###Post /group/deny
#####Headers:
 - Content-type: `application/json`
 - Authorization: `bearer YOURTOKENHERE`

#####Body:
```
{
  "groupId": 2"
}
```

##Markers
###Get /markers
#####Headers:
 - Content-type: `application/json`
 - Authorization: `bearer YOURTOKENHERE`

###Post /markers
#####Headers:
 - Content-type: `application/json`
 - Authorization: `bearer YOURTOKENHERE`

#####Body:
```
{
  "markers": [
    {
      "groupId": 4,
      "location":[412.52341235234, 425.23421],
      "name": "This is a cool place",
      "imageUrl": "imageurl.com/image",
      "description": "Why this place is the coolest"
    },
    {
      "groupId": 5,
      "location":[10, 10],
      "name": "This is a cooler place",
      "imageUrl": "imageurl.com/image2",
      "description": "Why this place is the coolester"
    }
  ]
}
```
