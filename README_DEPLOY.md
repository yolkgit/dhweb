# Ubuntu Server Deployment Guide

This guide explains how to deploy your application to an Ubuntu server using Docker.

## Prerequisites

1.  **Ubuntu Server**: You need a server (e.g., AWS EC2, DigitalOcean Droplet) with Ubuntu installed.
2.  **Domain (Optional)**: If you want to use a real domain instead of an IP address.

## Step 1: Install Docker on Server

Connect to your Ubuntu server via SSH and run the following commands to install Docker and Docker Compose:

```bash
# Update package list
sudo apt update

# Install Docker
sudo apt install -y docker.io

# Install Docker Compose
sudo apt install -y docker-compose

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to the docker group (optional, avoids using sudo)
sudo usermod -aG docker $USER
```

_(Log out and log back in for group changes to take effect)_

## Step 2: Upload Code to Server

You can use `git` or `scp` to upload your project files. If using Git:

```bash
# Install git
sudo apt install -y git

# Clone your repository (assuming you pushed your code to GitHub)
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

If you don't use Git, you can copy the files from your local PC:

```bash
# Run this on your LOCAL Windows PowerShell
scp -r C:\path\to\dahyeon-industry user@your-server-ip:~/dahyeon-industry
```

## Step 3: Deployment

Navigate to the project directory on your server and run:

```bash
# Build and start the containers in the background
sudo docker-compose up -d --build
```

## Step 4: Verification

1.  Open your browser and visit `http://your-server-ip:3003`.
2.  The website should be live!
3.  Go to `/admin` endpoint (or click the admin link).
4.  Try creating a new category or product.
5.  Refresh the page to ensure the data persists (it is now saved in `server/database.json`).

## Troubleshooting

- **Check Logs**:
  ```bash
  sudo docker-compose logs -f
  ```
- **Restart Containers**:
  ```bash
  sudo docker-compose restart
  ```
- **Update Code**:
  Pull the new code or upload changes, then run `sudo docker-compose up -d --build` again.

## Data Backup

Your data is stored in the `server/database.json` file and uploaded images are in `server/uploads/`.
To backup, simply download these files/folders from the server.
