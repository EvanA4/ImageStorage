# ImageStorage

Basic express app for an image database

```
pnpm i      <-- Install necessary JS packages
pnpm dev    <-- Start server in DEV mode
pnpm build  <-- Build server into raw JS
pnpm start  <-- Run raw JS build
```

### Routes

`GET /`
- Returns basic HTML landing page for database

`GET /images`
- Returns all MongoDB documents in image database
- Providing an `_id` query parameter returns a specific image
- Using `_id` and setting `doc` query parameter to `"true"` returns image's MongoDB document

`POST /images`
- Uploads an image to the database
- Body must be a `multipart/form-data` type
- Body must contain two fields:
    - `images` is an array of files
    - `password` is secret defined in this project's `.env`

`DELETE /images`
- Deletes an image from the database
- Body must contain `password` field

`POST /sync`
- Deletes any files/MongoDB documents not found in both the filesystem and MongoDB
- Body must contain `password` field