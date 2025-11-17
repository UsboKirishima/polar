FROM golang:1.22-alpine AS builder

WORKDIR /app
COPY apps/ranker .

RUN go mod tidy
RUN go build -o ranker ./src/main.go

FROM alpine:3.20
WORKDIR /app

COPY --from=builder /app/ranker ./ranker
EXPOSE 5000

CMD ["./ranker"]
