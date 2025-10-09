#!/bin/bash

# Git Helper Script - Reusable for all commits
# Usage: ./git-helper.sh

echo "🚀 Git Workflow Helper"
echo "======================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to show menu
show_menu() {
    echo -e "${BLUE}What would you like to do?${NC}"
    echo "1) Create new feature branch"
    echo "2) Commit current changes"
    echo "3) Push to GitHub"
    echo "4) Check status"
    echo "5) Pull latest changes"
    echo "6) Complete workflow (commit + push)"
    echo "7) Exit"
    echo ""
    read -p "Choose (1-7): " choice
    echo ""
}

# Function to create branch
create_branch() {
    echo -e "${YELLOW}Creating new feature branch...${NC}"
    echo ""
    echo "Branch naming examples:"
    echo "  feature/user-login"
    echo "  feature/request-form"
    echo "  fix/api-timeout"
    echo "  docs/api-documentation"
    echo ""
    read -p "Enter branch name: " branch_name
    
    git checkout -b "$branch_name"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Created and switched to branch: $branch_name${NC}"
    else
        echo "❌ Failed to create branch. It might already exist."
        read -p "Switch to existing branch? (y/n): " switch
        if [ "$switch" = "y" ]; then
            git checkout "$branch_name"
        fi
    fi
    echo ""
}

# Function to commit changes
commit_changes() {
    echo -e "${YELLOW}Committing changes...${NC}"
    echo ""
    
    # Show current status
    echo "📋 Current changes:"
    git status --short
    echo ""
    
    # Ask what to stage
    echo "What to stage?"
    echo "1) All changes (git add .)"
    echo "2) Select files manually"
    read -p "Choose (1-2): " stage_choice
    echo ""
    
    if [ "$stage_choice" = "1" ]; then
        git add .
        echo -e "${GREEN}✅ All changes staged${NC}"
    else
        echo "Enter files/directories to add (space-separated):"
        read -p "> " files
        git add $files
        echo -e "${GREEN}✅ Selected files staged${NC}"
    fi
    
    echo ""
    echo "📝 Commit message types:"
    echo "  feat:     New feature"
    echo "  fix:      Bug fix"
    echo "  docs:     Documentation"
    echo "  style:    Code style/formatting"
    echo "  refactor: Code refactoring"
    echo "  test:     Adding tests"
    echo "  chore:    Build/config changes"
    echo ""
    
    read -p "Enter commit message (e.g., 'feat: add login page'): " commit_msg
    
    git commit -m "$commit_msg"
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅ Committed successfully!${NC}"
        echo ""
        git log -1 --oneline
    else
        echo "❌ Commit failed"
    fi
    echo ""
}

# Function to push
push_changes() {
    echo -e "${YELLOW}Pushing to GitHub...${NC}"
    echo ""
    
    current_branch=$(git branch --show-current)
    echo "Current branch: $current_branch"
    echo ""
    
    # Check if branch exists on remote
    if git ls-remote --exit-code --heads origin "$current_branch" >/dev/null 2>&1; then
        echo "Branch exists on remote, pushing changes..."
        git push
    else
        echo "First time pushing this branch..."
        git push -u origin "$current_branch"
    fi
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅ Pushed successfully!${NC}"
        echo ""
        echo "Next steps:"
        echo "1. Go to GitHub"
        echo "2. Create Pull Request"
        echo "3. Request review from teammate"
    else
        echo "❌ Push failed"
    fi
    echo ""
}

# Function to check status
check_status() {
    echo -e "${YELLOW}Git Status:${NC}"
    echo ""
    
    current_branch=$(git branch --show-current)
    echo -e "${GREEN}Current branch:${NC} $current_branch"
    echo ""
    
    echo "📋 Changed files:"
    git status --short
    echo ""
    
    echo "📝 Recent commits:"
    git log --oneline -5
    echo ""
}

# Function to pull latest
pull_latest() {
    echo -e "${YELLOW}Pulling latest changes...${NC}"
    echo ""
    
    current_branch=$(git branch --show-current)
    
    if [ "$current_branch" != "main" ]; then
        echo "You're on branch: $current_branch"
        read -p "Switch to main first? (recommended) (y/n): " switch
        if [ "$switch" = "y" ]; then
            git checkout main
        fi
    fi
    
    git pull origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅ Pulled latest changes!${NC}"
    else
        echo "❌ Pull failed"
    fi
    echo ""
}

# Function for complete workflow
complete_workflow() {
    echo -e "${BLUE}Complete Workflow: Commit + Push${NC}"
    echo ""
    
    # Stage changes
    echo "📦 Staging all changes..."
    git add .
    echo ""
    
    # Show what's staged
    echo "📋 Files to commit:"
    git status --short
    echo ""
    
    # Get commit message
    read -p "Enter commit message: " commit_msg
    
    # Commit
    git commit -m "$commit_msg"
    
    if [ $? -ne 0 ]; then
        echo "❌ Commit failed"
        return
    fi
    
    echo -e "${GREEN}✅ Committed!${NC}"
    echo ""
    
    # Push
    current_branch=$(git branch --show-current)
    
    if git ls-remote --exit-code --heads origin "$current_branch" >/dev/null 2>&1; then
        git push
    else
        git push -u origin "$current_branch"
    fi
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅ Pushed successfully!${NC}"
        echo ""
        echo "🎉 Done! Now create a Pull Request on GitHub"
    else
        echo "❌ Push failed"
    fi
    echo ""
}

# Main loop
while true; do
    show_menu
    
    case $choice in
        1)
            create_branch
            ;;
        2)
            commit_changes
            ;;
        3)
            push_changes
            ;;
        4)
            check_status
            ;;
        5)
            pull_latest
            ;;
        6)
            complete_workflow
            ;;
        7)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid option"
            echo ""
            ;;
    esac
done

