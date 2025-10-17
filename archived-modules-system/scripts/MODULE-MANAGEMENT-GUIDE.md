# Module Management Script Usage Guide

## Script: `manage-modules.ps1`

### ✅ FIXED ISSUES:
- Removed Unicode characters that caused PowerShell parsing errors
- Clean ASCII-only syntax for cross-platform compatibility
- Proper error handling and validation

### 📋 USAGE EXAMPLES:

#### Hide modules:
```powershell
.\scripts\manage-modules.ps1 -ModuleIds "module1,module2,module3" -Status "hidden" -Reason "Under development"
```

#### Show hidden modules:
```powershell
.\scripts\manage-modules.ps1 -ModuleIds "module1,module2" -Status "active"
```

#### Archive old modules:
```powershell
.\scripts\manage-modules.ps1 -ModuleIds "old-module" -Status "archived" -Reason "Deprecated technology"
```

### 🔧 PARAMETERS:
- **ModuleIds** (Required): Comma-separated list of module IDs
- **Status** (Required): "active", "hidden", or "archived"
- **Reason** (Optional): Explanation for hiding/archiving

### ✅ WHAT IT DOES:
1. ✓ Updates root `modules.json`
2. ✓ Automatically syncs to `public/modules.json`
3. ✓ Verifies both files match
4. ✓ Shows before/after status summary
5. ✓ Handles errors gracefully

### 📊 CURRENT STATUS:
- **Active modules**: 49
- **Hidden modules**: 53
- **Total modules**: 102

### 🚀 READY FOR FUTURE USE!
The script is now fully functional and can be used anytime to manage module visibility.