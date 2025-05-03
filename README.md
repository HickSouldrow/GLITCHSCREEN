# GlitchScreen 👨‍💻

**GlitchScreen** is an indie game store website, developed for a competition and project presentation.  
The idea is to gather independent games in a modern, fast, and stylish platform focused on user experience.

Built with **React**, **Vite**, and **TailwindCSS**, featuring routing, API requests, and a mock server with **json-server**.

## Technologies Used:

- React
- Vite
- React Router DOM
- Axios
- SweetAlert2
- TailwindCSS
- json-server (for simulating a backend API)

## 🛠️ How to Run the Project (on the Visual Studio Code)

```bash
# Clone the repository
git clone https://github.com/HickSouldrow/GLITCHSCREEN.git

# Enter the project folder
cd GlitchScreen/vite-project

# Install all dependencies
npm i

# Install the main libraries
npm install react react-dom react-router-dom axios sweetalert2 json-server

# Use the database
npx json-server --watch db.json --port 5000

# Install TailwindCSS
npm install tailwindcss @tailwindcss/vite

# Run the development server
npm run dev
