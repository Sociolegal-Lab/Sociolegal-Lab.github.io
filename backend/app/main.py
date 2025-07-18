from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Mount the frontend as static files
app.mount("/assets", StaticFiles(directory="../../frontend/assets"), name="assets")
app.mount("/", StaticFiles(directory="../../frontend/pages", html=True), name="pages")

# Optional: Define a route to serve the index.html as the root
@app.get("/")
async def root():
    return FileResponse("frontend/pages/index.html")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
