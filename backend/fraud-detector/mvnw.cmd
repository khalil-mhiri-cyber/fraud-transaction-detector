@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.
@REM Maven Wrapper startup batch script, version 3.3.2
@REM ----------------------------------------------------------------------------

@IF "%__MVNW_ARG0_NAME__%"=="" (SET "BASE_DIR=%~dp0")

@SET MAVEN_PROJECTBASEDIR=%BASE_DIR%
@IF NOT "%MAVEN_BASEDIR%"=="" (SET "MAVEN_PROJECTBASEDIR=%MAVEN_BASEDIR%")

@SET WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain
@SET DOWNLOAD_URL=https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.2/maven-wrapper-3.3.2.jar

@SET WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
@SET WRAPPER_PROPERTIES="%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.properties"

@FOR /F "usebackq tokens=1,2 delims==" %%A IN (%WRAPPER_PROPERTIES%) DO (
    @IF "%%A"=="distributionUrl" (SET "DISTRIBUTION_URL=%%B")
    @IF "%%A"=="wrapperUrl" (SET "WRAPPER_URL=%%B")
)

@SET JAVA_HOME_TRIMMED=%JAVA_HOME:"=%
@IF NOT "%JAVA_HOME_TRIMMED%"=="" (
    @SET JAVA_EXECUTABLE="%JAVA_HOME_TRIMMED%\bin\java.exe"
) ELSE (
    @SET JAVA_EXECUTABLE=java
)

@IF NOT EXIST %WRAPPER_JAR% (
    @IF NOT "%WRAPPER_URL%"=="" (
        %JAVA_EXECUTABLE% -classpath "%MAVEN_PROJECTBASEDIR%\.mvn\wrapper" ^
            "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" ^
            org.apache.maven.wrapper.MavenWrapperDownloader "%WRAPPER_URL%"
    )
)

@SET MAVEN_CMD_LINE_ARGS=%*

%JAVA_EXECUTABLE% ^
  -classpath %WRAPPER_JAR% ^
  "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" ^
  %WRAPPER_LAUNCHER% %MAVEN_CMD_LINE_ARGS%
