#!/bin/bash
# Script to help identify which controllers still use direct Prisma access

echo "🔍 Scanning controllers for direct Prisma usage..."
echo ""

find src/controllers -name "*.controller.ts" -exec sh -c '
  count=$(grep -c "prisma\." "$1" 2>/dev/null || echo 0)
  if [ "$count" -gt 0 ]; then
    echo "❌ $1 ($count direct Prisma calls)"
  else
    echo "✅ $1 (refactored)"
  fi
' _ {} \;

echo ""
echo "📊 Summary:"
total=$(find src/controllers -name "*.controller.ts" | wc -l | tr -d ' ')
refactored=$(find src/controllers -name "*.controller.ts" -exec sh -c 'grep -q "prisma\." "$1" || echo "$1"' _ {} \; | wc -l | tr -d ' ')
remaining=$((total - refactored))

echo "Total controllers: $total"
echo "Refactored: $refactored"
echo "Remaining: $remaining"
