# @polar/frontend

This is the Vue.js code base for Polar's client.

## Idea
The first idea is to make a simple and performance-focused website with a minimal UI and soft colors.

## Technologies

- **Vue.js**: The web framework
- **tRPC** (Client): API calls to Back-end
- **Pinia**: Store manager
- **Vite**: Build environment
- **Zod**: Data validation

## Configuration

- Setup `.env`
    ```bash
    cp .env.example .env
    ```
- Build for production:
    ```bash
    pnpm build
    ```
- Run 
    ```bash
    pnpm preview
    ```