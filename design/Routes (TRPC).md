#### Legenda
- `M` Mutazione
- `Q` Query
- * Public procedure
#### Note
- Alcune procedure richiedono paginazione per evitare sovvraccarichi del server. In particolare `user.getAll`, `user.getFriends`, `post.getAll`, `post.getFeed`, `post.getSaved`, `category.getAll`.
---
### Auth
- * `M auth.register(BetterAuth)`
- * `M auth.login(BetterAuth)`
- `M auth.logout()`
- `M auth.resetPasswordRequest()`
- `M auth.resetPassword(token, newPassword)`
- `M auth.changePassword(oldPassword, newPassword)`
- `M auth.deleteAccount(BetterAuth)`
### Users
- `Q user.getMe()`
- `Q user.search(query)`
- `Q user.getAll()`
- `Q user.getById(userId)`
- `Q user.getByUsername(username)`
- `Q user.getFriends(userId)`
- `Q user.getPosts(userId)`
- `M user.setAvatar(null | new_avatar)`
- `M user.setBanner(null | new_banner)`
- `M user.edit(new_config)` (just on myself)
### Posts
- `Q post.getById(postId)`
- `Q post.getAll()`
- `Q post.getFeed()`
- `M post.create(post_info)`
- `M post.edit(postId, new_info)`
- `M post.delete(postId)` (just on myself)
- `M post.toggleLike(postId)`
- `M post.toggleSave(postId)`
- `Q post.getSaved()`
- `Q post.getCommentById(commentId)`
- `M post.createComment(postId, comment_info)`
- `M post.editComment(commentId, new_text)`
- `M post.deleteComment(commentId)` (my comments or comments under my posts)
### Friends
- `Q friend.getAllRequests()`
- `Q friend.getSentRequests()`
- `Q friend.getAll()` (just on myself)
- `M friend.sendRequest(userId)`
- `M friend.acceptRequest(requestId)`
- `M friend.denyRequest(requestId)`
- `M friend.remove(userId)`
### Categories
- * `Q category.getAll()`
- `Q category.search(query)`
- `Q category.getById(categoryId)`
- `Q category.getByName(categoryName)`