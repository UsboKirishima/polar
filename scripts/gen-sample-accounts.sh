#!/bin/bash

API_URL="http://localhost:3000/api/v1/auth/register"

USERNAMES=("mario" "giulia" "luca" "francesca" "giovanni" "chiara" "alessandro" "martina" "simone" "federica" "paolo" "sofia" "gabriele" "elisa" "matteo" "ilaria" "riccardo" "valentina" "davide" "alice")
FULLNAMES=("Mario Rossi" "Giulia Bianchi" "Luca Verdi" "Francesca Neri" "Giovanni Esposito" "Chiara Ferrari" "Alessandro Romano" "Martina Conti" "Simone Rinaldi" "Federica Marino" "Paolo Fontana" "Sofia Ricci" "Gabriele De Luca" "Elisa Romano" "Matteo Galli" "Ilaria Greco" "Riccardo Serra" "Valentina Bruno" "Davide Marchi" "Alice Moretti")

PASSWORD="Password123!"

echo "Users generation started..."

for i in {0..19}; do
  EMAIL="${USERNAMES[$i]}@example.com"
  USERNAME="${USERNAMES[$i]}"
  FULLNAME="${FULLNAMES[$i]}"
  
  YEAR=$((RANDOM % 16 + 1990))
  MONTH=$((RANDOM % 12 + 1))
  DAY=$((RANDOM % 28 + 1))
  DOB=$(printf "%04d-%02d-%02d" $YEAR $MONTH $DAY)

  echo "Creating user $USERNAME with email $EMAIL and DOB $DOB"

  curl -s -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -d "{
      \"email\": \"$EMAIL\",
      \"password\": \"$PASSWORD\",
      \"profile\": {
        \"username\": \"$USERNAME\",
        \"dateOfBirth\": \"$DOB\",
        \"fullName\": \"$FULLNAME\"
      }
    }" > /dev/null

done

echo "Generated successfully!"

