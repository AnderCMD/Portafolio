REM filepath: /d:/AnderCMD/OneDrive/Ander/Software/Proyectos/Fix-Windows/FixWindows.bat
@echo off
chcp 65001 > nul
color 0b
cls


echo.
echo     █████╗ 
echo    ██╔══██╗███╗   ██╗██████╗ ███████╗██████╗  ██████╗███╗   ███╗██████╗ 
echo    ███████║████╗  ██║██╔══██╗██╔════╝██╔══██╗██╔════╝████╗ ████║██╔══██╗
echo    ██╔══██║██╔██╗ ██║██║  ██║█████╗  ██████╔╝██║     ██╔████╔██║██║  ██║
echo    ██║  ██║██║╚██╗██║██║  ██║██╔══╝  ██╔══██╗██║     ██║╚██╔╝██║██║  ██║
echo    ██║  ██║██║ ╚████║██████╔╝███████╗██║  ██║╚██████╗██║ ╚═╝ ██║██████╔╝
echo    ╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝╚═╝     ╚═╝╚═════╝ 
echo    ═════════════════════════════════════════════════════════════════════
echo.
echo                ████████╗ ██████╗  ██████╗ ██╗      ███████╗
echo                ╚══██╔══╝██╔═══██╗██╔═══██╗██║      ██╔════╝
echo                   ██║   ██║   ██║██║   ██║██║      ███████╗
echo                   ██║   ██║   ██║██║   ██║██║      ╚════██║
echo                   ██║   ╚██████╔╝╚██████╔╝███████╗ ███████║
echo                   ╚═╝    ╚═════╝  ╚═════╝ ╚══════╝ ╚══════╝
echo    ═════════════════════════════════════════════════════════════════════
echo                    [+] Windows System Repair Tool v1.0 [+]
echo    ═════════════════════════════════════════════════════════════════════
echo.

:: Confirmación para iniciar
echo [*] Iniciando proceso de reparación...
set /p confirm="[?] Presione Enter para continuar..."

:: Verifica administrador
openfiles >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] Error: Ejecute como administrador
    pause
    exit /b
)

:: Ejecuta comandos
echo [*] Ejecutando SFC...
sfc /scannow
echo [*] Ejecutando DISM CheckHealth...
DISM /Online /Cleanup-Image /CheckHealth
echo [*] Ejecutando DISM ScanHealth...
DISM /Online /Cleanup-Image /ScanHealth
echo [*] Ejecutando DISM RestoreHealth...
DISM /Online /Cleanup-Image /RestoreHealth

echo.
echo [+] Proceso completado
pause

