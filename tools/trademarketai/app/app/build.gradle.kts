plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.luca.trademarkerai"
    compileSdk = 35
    defaultConfig {
        applicationId = "com.luca.trademarkerai"
        minSdk = 26
        targetSdk = 35
        versionCode = 3
        versionName = "2.1.0-agent-ui"
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions { jvmTarget = "17" }
}
