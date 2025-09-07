#!/bin/bash

API_URL="http://localhost:3000/api/v1/friends/request"
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyMTc2ZWNhZC01MTFiLTQwOGUtYjEwNC01ZjcxYmI3ZTAzMjciLCJpYXQiOjE3NTcyNTk4NjEsImV4cCI6MTc1NzM0NjI2MX0.ZQFTO376v3rrmYIQs7OsaKVB_k4GrdOIeDo2MhdQ2JQ"

USER_IDS=(
"0067d065-27c8-41cb-bddf-f753e70e66cd"
"04ed8ff8-32e4-4fdc-94ed-25eeafe278f6"
"093c9d92-780b-48aa-ba1e-bc6710bd4948"
"0f975a8e-07d9-4b03-9547-9af655483922"
"172dcdfd-0560-4c49-881b-a4c35078d137"
"2176ecad-511b-408e-b104-5f71bb7e0327"
"337f0bac-c0b5-425d-88f5-1fca257de3e6"
"363c8cd5-7cc5-4cff-98e1-3113e10bdf6d"
"400f7634-7c93-4ac9-bd5a-c33a929184b3"
"4c698a53-a772-41d5-9877-b88298054843"
"6eba6037-e93b-403d-919a-3060350e0fb0"
"77d2aa7d-931a-41f0-aa4f-f31f157f152c"
"9cbdf336-8f2a-4065-be7f-91852d5a65b7"
"b6305f32-30d9-4fa9-8aa9-62a54e985740"
"b8ab55c7-bbed-42d1-a7d7-729187efc5d0"
"bd32b788-94fe-4101-8503-a7e6f9b6010f"
"c52a16b6-ba30-4af1-acc8-e3d8a114cd6d"
"c5881b8d-8cec-4528-b366-6188f076c268"
"cdcc0388-84e2-4dcf-9974-29c3fbe19a16"
"d1598a27-0a5f-48bd-9095-2d50fa7205eb"
"f981ca72-4c88-4e9c-ac15-18900e394d39"
)

echo "Sending friend requests..."

for USER_ID in "${USER_IDS[@]}"; do
  echo "Sending friend request to user $USER_ID"

  curl -s -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{
      \"receiverId\": \"$USER_ID\"
    }" > /dev/null

  echo "Request sent to $USER_ID"
done

echo "All friend requests sent!"

