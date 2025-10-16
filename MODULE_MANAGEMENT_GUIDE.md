# Module Management System

## Overview
The module management system allows you to control which of the 102 modules are visible to users without deleting them from the database.

## Module Status Types

### 1. **active** (default)
- Module is visible in the catalog
- Appears in search results
- Can be enrolled
- Shows on homepage featured modules

### 2. **hidden**
- Module exists but is not shown in catalog
- Not visible in search results
- Direct link access is blocked
- Useful for: modules under development, seasonal courses, or content being updated

### 3. **archived** (optional)
- Permanently removed from public view
- Kept for historical records
- Cannot be accessed even with direct links
- Useful for: deprecated courses, outdated content

## How to Manage Module Status

### Method 1: Edit modules.json Directly

Add a `"status"` field to any module:

```json
{
  "id": "python-programming",
  "title": "Python Programming",
  "category": "Programming Foundation",
  "status": "active",
  ...
}
```

**Examples:**

```json
// Active module (visible to everyone)
{
  "id": "react-development",
  "status": "active",
  ...
}

// Hidden module (temporarily disabled)
{
  "id": "vue-framework",
  "status": "hidden",
  ...
}

// Archived module (permanently removed)
{
  "id": "angular-js-legacy",
  "status": "archived",
  ...
}
```

### Method 2: Bulk Status Update Script

Use the provided PowerShell script to update multiple modules:

```powershell
# Hide multiple modules
.\scripts\update-module-status.ps1 -ModuleIds "vue-framework,angular-legacy" -Status "hidden"

# Activate modules
.\scripts\update-module-status.ps1 -ModuleIds "react-development,python-programming" -Status "active"
```

### Method 3: Admin Dashboard (Future Enhancement)

A visual interface where admins can:
- Toggle module status with a switch
- Preview changes before saving
- Bulk hide/show by category
- See hidden module count

## Module Filtering Logic

### Frontend Filtering
```javascript
// Only show active modules in catalog
const visibleModules = modules.filter(m => m.status !== 'hidden' && m.status !== 'archived');

// Count by status
const activeCount = modules.filter(m => !m.status || m.status === 'active').length;
const hiddenCount = modules.filter(m => m.status === 'hidden').length;
```

### When to Use Each Status

**Use `active`** when:
- Module is ready for enrollment
- Content is complete and tested
- You want it visible in all searches

**Use `hidden`** when:
- Module is under development
- Content needs updating but you don't want to delete it
- Seasonal courses (hide during off-season)
- Testing new curriculum before launch
- Temporarily discontinuing a course

**Use `archived`** when:
- Course is permanently discontinued
- Technology is deprecated
- Merging duplicate content
- Need to keep records but prevent all access

## Quick Reference Commands

### Hide a module temporarily
```json
"status": "hidden"
```

### Archive a module permanently
```json
"status": "archived"
```

### Show a module (or omit status field)
```json
"status": "active"
// or simply omit the field - defaults to active
```

## Migration Notes

**Existing modules without status field:**
- Default to `"active"` automatically
- No need to add status to all 102 modules at once
- Only add status when you want to hide/archive

**Backward compatibility:**
- Modules without status field = active
- Old module data continues to work
- Add status field only when needed

## Best Practices

1. **Document why modules are hidden**
   - Add a comment field: `"hiddenReason": "Under revision"`

2. **Review hidden modules regularly**
   - Don't leave modules hidden indefinitely
   - Either activate or archive after updates

3. **Use archived sparingly**
   - Consider hidden first for most cases
   - Archive only when truly deprecated

4. **Test before hiding popular modules**
   - Check if students are enrolled
   - Notify active students before hiding

## Example Module Configuration

```json
[
  {
    "id": "python-programming",
    "title": "Python Programming",
    "status": "active",
    "category": "Programming Foundation",
    ...
  },
  {
    "id": "ruby-on-rails",
    "title": "Ruby on Rails",
    "status": "hidden",
    "hiddenReason": "Updating to Rails 7",
    "category": "Web Development Backend",
    ...
  },
  {
    "id": "perl-programming",
    "title": "Perl Programming",
    "status": "archived",
    "archivedDate": "2025-10-01",
    "category": "Programming Foundation",
    ...
  }
]
```

## Troubleshooting

**Module still showing after hiding?**
- Clear browser cache
- Check status field spelling: `"hidden"` not `"Hidden"`
- Verify modules.json was saved correctly

**Can't find hidden modules?**
- Hidden modules don't appear in any public list
- Edit modules.json directly to view all modules
- Use admin dashboard (future) to manage hidden content

**Want to temporarily disable all modules in a category?**
- Use bulk update script (coming soon)
- Or manually add status to each module in that category

---

**Last Updated:** October 17, 2025
**Version:** 1.0
**Status:** Implementation Complete
