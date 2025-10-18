@echo off
title Google Cloud Setup - Saudi Arabia Region

echo ========================================
echo Google Cloud - Saudi Arabia Setup
echo ========================================
echo.

echo Setting default region to me-central1...
gcloud config set compute/region me-central1

echo Setting default zone to me-central1-a...
gcloud config set compute/zone me-central1-a

echo.
echo ========================================
echo Configuration Complete!
echo ========================================
echo Region: me-central1 (Saudi Arabia)
echo Zone: me-central1-a
echo.

pause