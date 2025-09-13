# FloodGuard CI/CD Pipeline & Deployment Guide

## 🚀 Phase 2: GitHub Actions CI/CD Pipeline Setup

### 📋 Prerequisites
1. **GitHub Repository** - Push your code to GitHub
2. **Docker Hub or GitHub Container Registry** - For storing Docker images
3. **VPS Server** - Ubuntu 20.04+ with Docker installed

## 🔐 Required GitHub Secrets

Navigate to your GitHub repository → Settings → Secrets and variables → Actions

### Essential Secrets:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db?sslmode=require` |
| `VPS_HOST` | Your VPS server IP address | `192.168.1.100` |
| `VPS_USERNAME` | SSH username for VPS | `ubuntu` |
| `SSH_PRIVATE_KEY` | Private SSH key for VPS access | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `GHCR_PAT` | GitHub Personal Access Token | `ghp_xxxxxxxxxxxx` |
| `DOCKER_USER` | GitHub username for GHCR | `your-github-username` |

### 🔑 How to Generate Required Secrets:

#### 1. SSH Private Key (`SSH_PRIVATE_KEY`)
```bash
# On your local machine, generate SSH key pair
ssh-keygen -t rsa -b 4096 -C "github-actions@yourdomain.com"

# Copy the private key content (this goes in GitHub secret)
cat ~/.ssh/id_rsa

# Copy the public key to your VPS
ssh-copy-id -i ~/.ssh/id_rsa.pub ubuntu@your-vps-ip
```

#### 2. GitHub Personal Access Token (`GHCR_PAT`)
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select scopes: `write:packages`, `read:packages`, `repo`
4. Copy the token value

#### 3. Database URL (`DATABASE_URL`)
Use your existing Neon PostgreSQL connection string:
```
postgresql://neondb_owner:npg_jQf23SrGyWTx@ep-super-moon-aeh0rrkf.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require
```

## 🖥️ VPS Server Setup

### Step 1: Prepare Your VPS

```bash
# SSH into your VPS
ssh ubuntu@your-vps-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again to apply Docker group changes
exit
ssh ubuntu@your-vps-ip

# Verify installations
docker --version
docker-compose --version
```

### Step 2: Setup Project Directory

```bash
# Create project directory
mkdir ~/floodguard
cd ~/floodguard

# Create environment file
nano .env
```

Add this content to `.env`:
```env
DATABASE_URL=postgresql://neondb_owner:npg_jQf23SrGyWTx@ep-super-moon-aeh0rrkf.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### Step 3: Setup Production Docker Compose

```bash
# Download production docker-compose file
curl -o docker-compose.yml https://raw.githubusercontent.com/kahloncoder/FLOODGUARD/main/docker-compose.prod.yml

# Edit the image name in docker-compose.yml
nano docker-compose.yml
# Should already be set to: ghcr.io/kahloncoder/floodguard:main
```

## 🔄 CI/CD Pipeline Workflow

### Trigger Events:
- **Push to main branch** → Full deployment
- **Pull Request** → Testing only (no deployment)

### Pipeline Stages:

1. **Backend CI** 🐍
   - Code quality checks (Black, Ruff)
   - Run tests (Pytest)
   - Validate imports

2. **Frontend Build** ⚛️
   - Install dependencies
   - Run linter
   - Build static files
   - Upload artifacts

3. **Docker Build & Push** 🐳
   - Download frontend artifacts
   - Build Docker image
   - Security scan (Trivy)
   - Push to GitHub Container Registry

4. **Deploy to VPS** 🚀
   - SSH into VPS
   - Pull latest image
   - Restart services
   - Clean up old images

## 📊 Monitoring & Verification

### Health Checks:
- **Application**: `http://your-vps-ip/health`
- **API**: `http://your-vps-ip/api/stations`
- **Frontend**: `http://your-vps-ip/`

### Useful Commands on VPS:

```bash
# Check running containers
docker ps

# View application logs
docker-compose logs -f

# Restart services
docker-compose restart

# Update to latest image
docker-compose pull && docker-compose up -d

# Check disk usage
docker system df

# Clean up old images
docker image prune -f
```

## 🐛 Troubleshooting

### Common Issues:

#### 1. CI/CD Pipeline Fails
- **Check GitHub Secrets**: Ensure all secrets are set correctly
- **Review Logs**: Check GitHub Actions logs for specific errors
- **Database Connection**: Verify DATABASE_URL is accessible from GitHub Actions

#### 2. Deployment Fails
- **SSH Access**: Test SSH connection manually
- **Docker Permissions**: Ensure user is in docker group
- **Image Pull**: Check if GHCR_PAT has correct permissions

#### 3. Application Not Accessible
- **Port Mapping**: Verify port 80 is open on VPS
- **Firewall**: Check if UFW or iptables blocks traffic
- **Container Status**: Use `docker ps` to check if container is running

### Debug Commands:

```bash
# Test SSH from local machine
ssh -T ubuntu@your-vps-ip

# Test GitHub Container Registry login
echo $GHCR_PAT | docker login ghcr.io -u kahloncoder --password-stdin

# Check container health
docker inspect floodguard_production | grep Health

# View detailed container logs
docker logs floodguard_production --follow
```

## 🔄 Manual Deployment (if CI/CD fails)

```bash
# SSH into VPS
ssh ubuntu@your-vps-ip
cd ~/floodguard

# Pull and restart manually
docker-compose pull
docker-compose up -d

# Or build locally and push
docker build -t ghcr.io/kahloncoder/floodguard:main .
docker push ghcr.io/kahloncoder/floodguard:main
```

## 📈 Next Steps

1. **SSL Certificate**: Add Let's Encrypt for HTTPS
2. **Domain Setup**: Point your domain to VPS IP
3. **Monitoring**: Add application monitoring (Prometheus/Grafana)
4. **Backup Strategy**: Implement database backup automation
5. **Scaling**: Consider load balancing for high traffic

## 🔐 Security Best Practices

- ✅ Use non-root user in Docker containers
- ✅ Scan images for vulnerabilities (Trivy)
- ✅ Use secrets for sensitive data
- ✅ Enable firewall on VPS
- ✅ Regular security updates
- ✅ SSH key-based authentication only