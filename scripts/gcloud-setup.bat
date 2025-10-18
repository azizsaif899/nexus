@echo off
title Google Cloud Setup - Region Configuration

echo ========================================
echo Google Cloud - Region Setup
echo ========================================
echo.

echo Setting default region to us-central1...
gcloud config set compute/region us-central1

echo Setting default zone to us-central1-a...
gcloud config set compute/zone us-central1-a

echo.
echo ========================================
echo Configuration Complete!
echo ========================================
echo Region: us-central1
echo Zone: us-central1-a
echo.

pause