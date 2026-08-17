@echo off
echo Starting Spring Boot Backend...
echo.

REM Set JAVA_HOME to Java 25
set JAVA_HOME=C:\Users\hibab\AppData\Local\Programs\Eclipse Adoptium\jdk-25.0.2.10-hotspot
echo Using Java from: %JAVA_HOME%

REM Use the locally installed Maven
set MAVEN_HOME=%~dp0..\maven\apache-maven-3.9.6
set PATH=%MAVEN_HOME%\bin;%JAVA_HOME%\bin;%PATH%

echo Using Maven from: %MAVEN_HOME%
echo.

cd /d %~dp0

mvn.cmd spring-boot:run

pause
