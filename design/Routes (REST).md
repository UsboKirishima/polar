### Auth

- `POST /auth/register` (dati di registrazione)
- `POST /auth/login` (email, password)
- `POST /auth/refreshToken` (refreshToken)
- `POST /auth/revokeRefreshTokens` (userId)

### Users

- `GET /users/profile` (me)
- `GET /users` (me) {get all users}
- `GET /users/:id`
- `GET /users/:id/friends`
- `GET /users/u/:username`
- `PATCH /users/:id/username`

### Posts

- `POST /posts/new` (me, text)
- `DELETE /posts/:postId`
- `POST /posts/:postId/like` {toogle like}
- `POST /posts/:postId/comment` (me, text)
- `DELETE /posts/comment/:commentId` (me)
- `GET /posts/:postId`
- `GET /posts/user/:userId`
- `GET /posts` {get all posts}

### Friends

- `POST /friends/request` (me, userId)
- `POST /friends/accept` (me, friendship)
- `POST /friends/remove` (me, friendship)
- `POST /friends/deny` (me, friendship)
- `GET /friends/requests` (me)
- `GET /friends` (me) {get all friends}

### Categories

- `GET /categories` {get all categories}
- `GET /categories/:categoryId`
- `GET /categories/n/:categoryName`

### Avatar

- `GET /avatar` (me) {get self avatar}
- `POST /avatar` (me) {set self avatar}
- `DELETE /avatar` (me) {delete self avatar}
- `GET /avatar/:userId`

### Banner

- `GET /banner` (me) {get self banner}
- `POST /banner` (me) {set self banner}
- `DELETE /banner` (me) {delete self banner}
- `GET /banner/:userId`
