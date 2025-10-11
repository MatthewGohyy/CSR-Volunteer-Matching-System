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
    echo "7) Switch branches"
    echo "8) Merge feature branch to main"
    echo "9) List all branches"
    echo "10) Exit"
    echo ""
    read -p "Choose (1-10): " choice
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

# Function to switch branches
switch_branch() {
    echo -e "${YELLOW}Switch Branch${NC}"
    echo ""
    
    echo "📋 Available branches:"
    git branch -a
    echo ""
    
    current_branch=$(git branch --show-current)
    echo -e "${GREEN}Current branch:${NC} $current_branch"
    echo ""
    
    read -p "Enter branch name to switch to: " branch_name
    
    # Check for uncommitted changes
    if ! git diff-index --quiet HEAD --; then
        echo ""
        echo "⚠️  You have uncommitted changes!"
        echo ""
        echo "Options:"
        echo "1) Commit changes first"
        echo "2) Stash changes (save for later)"
        echo "3) Discard changes (dangerous!)"
        echo "4) Cancel"
        read -p "Choose (1-4): " save_choice
        echo ""
        
        case $save_choice in
            1)
                commit_changes
                ;;
            2)
                git stash push -m "Auto-stash before switching to $branch_name"
                echo -e "${GREEN}✅ Changes stashed${NC}"
                echo ""
                ;;
            3)
                read -p "Are you SURE you want to discard changes? (yes/no): " confirm
                if [ "$confirm" = "yes" ]; then
                    git reset --hard
                    echo -e "${GREEN}✅ Changes discarded${NC}"
                else
                    echo "❌ Cancelled"
                    return
                fi
                ;;
            4)
                echo "❌ Cancelled"
                return
                ;;
        esac
    fi
    
    git checkout "$branch_name"
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅ Switched to branch: $branch_name${NC}"
    else
        echo "❌ Failed to switch branch"
    fi
    echo ""
}

# Function to merge feature branch to main
merge_to_main() {
    echo -e "${YELLOW}Merge Feature Branch to Main${NC}"
    echo ""
    
    current_branch=$(git branch --show-current)
    
    if [ "$current_branch" = "main" ]; then
        echo "⚠️  You're already on main branch!"
        echo ""
        
        # Check if there are any feature branches
        feature_branches=$(git branch | grep -v "main" | grep -v "^\s*$" | wc -l | tr -d ' ')
        
        if [ "$feature_branches" -eq 0 ]; then
            echo "❌ No feature branches found!"
            echo ""
            echo "Create a feature branch first:"
            echo "  ./git-helper.sh → Option 1"
            echo ""
            return
        fi
        
        echo "📋 Available feature branches:"
        git branch | grep -v "main"
        echo ""
        read -p "Which branch do you want to merge into main? " feature_branch
        
        # Validate input
        if [ -z "$feature_branch" ]; then
            echo "❌ No branch name provided"
            return
        fi
    else
        feature_branch=$current_branch
        echo "Current branch: $feature_branch"
        echo "This will merge $feature_branch into main"
        echo ""
    fi
    
    # Confirm merge
    read -p "Merge $feature_branch into main? (y/n): " confirm
    if [ "$confirm" != "y" ]; then
        echo "❌ Merge cancelled"
        return
    fi
    
    echo ""
    echo "🔄 Starting merge process..."
    echo ""
    
    # Step 1: Switch to main
    echo "1️⃣ Switching to main..."
    git checkout main
    if [ $? -ne 0 ]; then
        echo "❌ Failed to switch to main"
        return
    fi
    echo -e "${GREEN}✅ On main branch${NC}"
    echo ""
    
    # Step 2: Pull latest
    echo "2️⃣ Pulling latest changes from remote..."
    git pull origin main
    if [ $? -ne 0 ]; then
        echo "❌ Failed to pull latest changes"
        return
    fi
    echo -e "${GREEN}✅ Main is up to date${NC}"
    echo ""
    
    # Step 3: Merge
    echo "3️⃣ Merging $feature_branch into main..."
    
    # Use --no-edit to avoid opening vim for merge commit message
    git merge "$feature_branch" --no-edit
    
    if [ $? -ne 0 ]; then
        echo ""
        echo "❌ Merge conflict detected!"
        echo ""
        echo "Conflicting files:"
        git diff --name-only --diff-filter=U
        echo ""
        echo "📝 To resolve:"
        echo "1. Fix conflicts in the files above"
        echo "2. Stage resolved files: git add <file>"
        echo "3. Complete merge: git commit"
        echo ""
        echo "Or abort merge: git merge --abort"
        return
    fi
    
    echo -e "${GREEN}✅ Merged successfully!${NC}"
    echo ""
    
    # Step 4: Push
    read -p "4️⃣ Push to GitHub? (y/n): " push_confirm
    if [ "$push_confirm" = "y" ]; then
        git push origin main
        if [ $? -eq 0 ]; then
            echo ""
            echo -e "${GREEN}✅ Pushed to GitHub!${NC}"
            echo ""
            
            # Optional: Delete feature branch
            read -p "Delete feature branch '$feature_branch'? (y/n): " delete_confirm
            if [ "$delete_confirm" = "y" ]; then
                git branch -d "$feature_branch"
                git push origin --delete "$feature_branch" 2>/dev/null
                echo -e "${GREEN}✅ Feature branch deleted${NC}"
            fi
        else
            echo "❌ Push failed"
        fi
    fi
    echo ""
    echo "🎉 Merge complete!"
    echo ""
}

# Function to list branches
list_branches() {
    echo -e "${YELLOW}All Branches${NC}"
    echo ""
    
    current_branch=$(git branch --show-current)
    echo -e "${GREEN}Current branch:${NC} $current_branch"
    echo ""
    
    echo "📋 Local branches:"
    git branch
    echo ""
    
    echo "📋 Remote branches:"
    git branch -r
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
            switch_branch
            ;;
        8)
            merge_to_main
            ;;
        9)
            list_branches
            ;;
        10)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid option"
            echo ""
            ;;
    esac
done

