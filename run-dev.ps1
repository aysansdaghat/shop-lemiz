# اجرای هم‌زمان بک‌اند و فرانت‌اند فروشگاه لمیز
# استفاده: در PowerShell اجرا کنید:
#   .\run-dev.ps1
# یا اگر ExecutionPolicy محدود بود:
#   powershell -ExecutionPolicy Bypass -File .\run-dev.ps1

$root = $PSScriptRoot
$backend = Join-Path $root "backend"
$frontend = Join-Path $root "lemiz-shop"

Write-Host "در حال اجرای بک‌اند روی http://127.0.0.1:8000 ..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList `
  '-NoExit', '-Command', "cd '$backend'; .\.venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000"

Write-Host "در حال اجرای فرانت‌اند روی http://localhost:5173 ..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList `
  '-NoExit', '-Command', "cd '$frontend'; npm run dev -- --port 5173 --strictPort"

Write-Host ""
Write-Host "آماده شد!" -ForegroundColor Green
Write-Host "  فروشگاه : http://localhost:5173"
Write-Host "  ادمین   : http://127.0.0.1:8000/admin/  (admin / admin12345)"
Write-Host "  API     : http://127.0.0.1:8000/api/docs/"
Write-Host ""
Write-Host "برای توقف، پنجره‌های بازشده را ببندید یا در آن‌ها Ctrl+C بزنید."