@echo off
REM Change to your project folder
cd /d D:\sustaina-ai

REM Activate your virtual environment
call venv\Scripts\activate

REM Start Flask app
start "" http://127.0.0.1:8080/chatbot.html
py app.py
pause
