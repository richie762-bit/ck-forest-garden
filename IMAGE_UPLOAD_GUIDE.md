# Image Upload Guide - CK Forest Garden

This guide explains where and how to upload images for your website.

## 📁 Image Folder Structure

```
client/public/assets/images/
├── logo/          # Logo files
│   └── README.md  # Instructions for logo images
└── gallery/       # Gallery photos
    └── README.md  # Instructions for gallery images
```

## 🖼️ Logo Images

### Location
`client/public/assets/images/logo/`

### What to Upload
- **Main Logo**: `logo.png` (recommended: 200x200px or 300x300px, PNG with transparent background)
- **White Logo** (optional): `logo-white.png` (for dark backgrounds)
- **Favicon**: `favicon.ico` (16x16px, 32x32px, 48x48px)

### How to Use After Upload
To use your logo in the header, update this file:
- **File**: `client/src/components/common/Header.jsx`
- **Line**: Around line 39 (replace the Trees icon)
- **Example**:
  ```jsx
  <img src="/assets/images/logo/logo.png" alt="CK Forest Garden" className="w-8 h-8" />
  ```

## 🌄 Gallery Images

### Location
`client/public/assets/images/gallery/`

### What to Upload
Upload 6 or more high-quality photos showing:
1. Forest/nature views
2. Camping areas
3. Hiking trails
4. Activities
5. Groups/events
6. Facilities

### Recommended Specs
- **Format**: JPG or PNG
- **Size**: 1200x800px (landscape) or 800x800px (square)
- **File Size**: 200-500KB (optimize for web)
- **Names**: Use descriptive names like `forest-view-1.jpg`, `camping-area.jpg`

### How to Use After Upload
To display your gallery images, update this file:
- **File**: `client/src/components/home/Gallery.jsx`
- **Replace the icon placeholders (lines 8-39) with image paths**
- **Example**:
  ```jsx
  const galleryItems = [
    {
      image: '/assets/images/gallery/forest-view-1.jpg',
      title: 'Lush Forest',
    },
    {
      image: '/assets/images/gallery/camping-area.jpg',
      title: 'Camping Sites',
    },
    // ... more items
  ];
  ```

- **Update the rendering (around line 60-73)**:
  ```jsx
  <div className="aspect-video bg-gradient-to-br overflow-hidden">
    <img
      src={item.image}
      alt={item.title}
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
    />
  </div>
  ```

## 📝 Quick Upload Steps

1. **Prepare Your Images**
   - Resize to recommended dimensions
   - Compress/optimize file sizes
   - Rename with descriptive names

2. **Upload to Folders**
   - Copy logo file(s) to: `client/public/assets/images/logo/`
   - Copy gallery photos to: `client/public/assets/images/gallery/`

3. **Update Code** (if needed)
   - For logo: Update `Header.jsx`
   - For gallery: Update `Gallery.jsx`

4. **Restart Dev Server**
   ```bash
   # Stop the current server (Ctrl+C)
   cd client
   npm run dev
   ```

5. **Verify**
   - Visit your website
   - Check that images load correctly
   - Test on different screen sizes

## 🛠️ Image Optimization Tools

### Online Tools (Free)
- **TinyPNG** - https://tinypng.com/ (PNG/JPG compression)
- **Squoosh** - https://squoosh.app/ (Advanced image optimization)
- **Compressor.io** - https://compressor.io/ (Fast compression)

### Desktop Tools
- **Adobe Photoshop** - Professional editing
- **GIMP** - Free alternative to Photoshop
- **IrfanView** - Batch resize and convert

## ✅ Checklist

Before uploading:
- [ ] Images are properly sized
- [ ] File sizes are optimized (< 500KB)
- [ ] File names are descriptive and web-friendly (no spaces, use hyphens)
- [ ] Images are clear and high quality
- [ ] You have rights to use the images
- [ ] Images represent CK Forest Garden accurately

## 🆘 Need Help?

If you encounter issues:
1. Check file paths are correct (case-sensitive)
2. Ensure files are in the correct folders
3. Restart the development server
4. Clear browser cache
5. Check browser console for errors (F12)

## 📧 Next Steps

After uploading images, consider:
- Adding alt text for accessibility
- Creating different sizes for mobile/desktop
- Adding captions or descriptions
- Setting up lazy loading for better performance
